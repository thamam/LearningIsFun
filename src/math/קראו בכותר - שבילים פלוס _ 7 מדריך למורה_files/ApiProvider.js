var cet = cet || {};
cet.microservices = cet.microservices || {};

cet.microservices.api = (function () {
  // find out the origin of API Gateway serving this script in current environment
  let selfUrl = new URL(document.currentScript.src);

  let loadApi = function (path, gatewayName) {
    validatePathAndQuery(path);
    var origin;
    if (gatewayName) {
      // rebulid the origin from this script origin with gatewayName as the first part in host
      var host = selfUrl.host;
      host = [gatewayName].concat(host.split('.').slice(1)).join('.');
      origin = selfUrl.protocol + '//' + host;
      system.addService(origin + path);
    }
    else {
      origin = getGatewayOrigin(path);
    }
    return loadScript(origin + path);
  }

  let loadScript = function (fullpath) {
    //if (Array.from(document.scripts).some(script => script.src && script.src.toLowerCase() == fullpath.toLowerCase())) {
    //  return Promise.resolve();
    //}
    //else {
    return new Promise((resolve, reject) => {
      var scriptElement = document.createElement("script");
      scriptElement.addEventListener('load', (event) => resolve());
      scriptElement.addEventListener('error', (event) => reject());
      scriptElement.src = fullpath;
      document.head.appendChild(scriptElement);
    });
    //}
  }

  let parseService = function (scriptUrl) {
    var url = new URL(scriptUrl);
    return {
      serviceKey: url.pathname.split('/')[1].toLowerCase(),
      gatewayOrigin: url.origin
    };
  }

  let getGatewayOrigin = function (path) {
    var serviceKey = path.split('/')[1].toLowerCase();
    var origin = services[serviceKey]?.gatewayOrigin;
    if (!origin) {
      console.warn(`Could not determine gateway origin from path "${path}". Using current...`);
      origin = selfUrl.origin;
      services[serviceKey] = origin;
    }
    return origin;
  }

  let services = {};
  let system = (function () {
    let addService = function (scriptUrl) {
      var service = parseService(scriptUrl);
      services[service.serviceKey] = service;
    };

    return {
      addService
    }
  })();

  /* PUBLIC ENUMERATIONS */

  let ajaxMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    PATCH: 'PATCH',
    CONNECT: 'CONNECT'
  };

  let responseFormat = {
    EMPTY: 0,
    text: 1,
    json: 2,
    blob: 3,
    formData: 4,
    arrayBuffer: 5
    };

  const httpErrors = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404
  };

  /**
   * some common content types and response types
   * */
  let contentType = {
    json: 'application/json',
    text: 'text/plain',
    html: 'text/html',
    xml: 'text/xml',
    binary: 'application/octet-stream'
  }

  let cacheMode = {
    default: 'default',
    noCache: 'no-cache',
    reload: 'reload',
    forceCache: 'force-cache',
    onlyIfCached: 'only-if-cached'
  }

  /* private */
  let ajaxBase = function (urlOrRequest, options) {
    return fetch(urlOrRequest, options).then(response => {
      return response;
    });
  };

  let defaultOptions = {
    contentType: contentType.json,
    responseType: contentType.json,
    responseFormat: responseFormat.json,
    cache: cacheMode.default,
    authentication: false,
    keepAlive: false,
    abortSignal: null // enable cancel request with AbortController
  };

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const RETRY_INTERVAL = 100;

  let ajax = function (pathAndQuery, method, data, options) {
    validatePathAndQuery(pathAndQuery);
    let url = getGatewayOrigin(pathAndQuery) + pathAndQuery;

    options = Object.assign({}, defaultOptions, options);

    let headers = prepareHeaders(data, options);

    data = prepareRequestBody(data, method, options);

    let fetchOptions = {
      method: method,
      body: data,
      headers: headers,
      mode: 'cors',
      credentials: options.authentication ? 'include' : 'omit',
      cache: options.cache,
      keepalive: options.keepAlive // to avoid OPTIONS preflight, use contentType: text/plain
    };
    // enable abort
    if (options.abortSignal) {
      fetchOptions.signal = options.abortSignal;
    }

    return ajaxBase(url, fetchOptions)
      .catch(error => {
        // wait a bit and retry once.
        console.log("retrying to fetch...")
        return wait(RETRY_INTERVAL).then(() => ajaxBase(url, fetchOptions));
      })
      // an efficient generalized approach to retries: https://stackoverflow.com/questions/38213668/promise-retry-design-patterns
      //function retry(fn, retries = 3, err = null) {
      //  if (!retries) {
      //    return Promise.reject(err);
      //  }
      //  return fn().catch(err => {
      //    return retry(fn, (retries - 1), err);
      //  });
      //}
      .then(response => {
        function onParseError(error) {
          logWarning("responseFormat value does not correspond to actual response. returning text...");
          return responseCopy.text();
        }
        if (!response.ok) {
          // TODO: copy format of fetch.catch() parameter

          /// Ugly fix for old players prod bug. Will be removed in the future
          if (pathAndQuery === '/cookiesapi/Content/GetValues' && response?.status === httpErrors.NOT_FOUND) {
            return null;
          }

          var errorMessage = `ajax response was not ok: Status ${response.status} ${response.statusText}`;
          if (response.status == httpErrors.BAD_REQUEST) {
            return response.text().then((text) => {
              throw new ApiError(errorMessage, "ApiError", { status: response.status, body: text });
            });
          }
          else {
            throw new ApiError(errorMessage, "ApiError", { status: response.status });
          }
        }
        var responseCopy = response.clone();
        var parsing;
        switch (options.responseFormat) {
          case responseFormat.EMPTY:
            return null;
            break;
          case responseFormat.text:
            parsing = response.text();
            break;
          case responseFormat.json:
            parsing = response.json();
            break;
          case responseFormat.blob:
            parsing = response.blob();
            break;
          case responseFormat.formData:
            parsing = response.formData();
            break;
          case responseFormat.arrayBuffer:
            parsing = response.arrayBuffer();
            break;
          default:
            return response;
        }
        return parsing.catch(onParseError);
      },
      (ex) => {
        // if fetch failed, throw specific error.
        throw new ApiError(ex.message, "ConnectivityError");
      });
  }

  function validatePathAndQuery(pathAndQuery) {
    if (!pathAndQuery.startsWith('/')) {
      throw new ApiError("url must contain path and query only to concatenate to api gateway origin.", "ValidationError");
    }
  }

  function prepareRequestBody(data, method, options) {
    if (method == ajaxMethod.GET || method == ajaxMethod.HEAD) {
      return undefined;
    }
    if (data && data instanceof FormData) {
      return data;
    }
    if (options.contentType == contentType.json) {
      if (typeof (data) == typeof ("")) {
        try {
          // if data is a valid stringified json, return it.
          JSON.parse(data);
          return data;
        }
				catch (error) {
					let a = error;
        }
      }
      // otherwise, stringify json.
      return JSON.stringify(data);
    }
    // for other content types, leave as is.
    return data;
  }

  function prepareHeaders(data, options) {
    let headers = {
      'Accept': options.responseType // TODO: add the error message format
    };
    if (data && !(data instanceof FormData)) {
      headers['Content-Type'] = options.contentType;
    }
    Object.assign(headers, options.headers);
    return headers;
  }


  function logWarning(message) {
    console.warn(message);
  }

  /* PUBLIC API */
  let get = function (pathAndQuery, options) {
    return ajax(pathAndQuery, ajaxMethod.GET, null, options);
  }

  let post = function (pathAndQuery, data, options) {
    return ajax(pathAndQuery, ajaxMethod.POST, data, options);
  }

  let safe = (function () {
    let ajax = function (pathAndQuery, method, data, options) {
      let AccessMngLoaded = (cet.accessmanagement && cet.accessmanagement.whenAuthenticatedForServices);
      if (!AccessMngLoaded) {
        return Promise.reject(new Error("cet.accessmanagement must be loaded before requesting safe api.")); // TODO:
      }
      else {
        
        return cet.accessmanagement.whenAuthenticatedForServices().then(function () {
          options = options || {};
          options.authentication = true;
          return cetms.ajax(pathAndQuery, method, data, options);
        });
      }
    }

    /* PUBLIC API */
    let get = function (pathAndQuery, options) {
      return ajax(pathAndQuery, ajaxMethod.GET, null, options);
    }

    let post = function (pathAndQuery, data, options) {
      return ajax(pathAndQuery, ajaxMethod.POST, data, options);
    }

    return {
      ajax,
      get,
      post
    }

  })();


  return {
    loadApi,
    system,
    ajax,
    get,
    post,
    ajaxMethod,
    responseFormat,
    contentType,
    cacheMode,
    safe
  };
})();

// Api custom error
function ApiError(message, name, props) {
  Error.call(this, message);
  this.name = name || "ApiError";
  this.message = message;
  this.detail = props || {};
  // skip in stack trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ApiError);
  }
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.constructor = ApiError;

var cetms = cetms || cet.microservices.api;

cet.microservices.apiready = Promise.resolve();
