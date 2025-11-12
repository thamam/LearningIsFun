(function () {
  if (!window.cet || !window.cet.microservices || !window.cet.microservices.apiready) {
    window.cet = window.cet || {};
    cet.microservices = cet.microservices || {};

    let apiready = new Promise(function (resolve, reject) {
      var scriptElement = document.createElement("script");
      scriptElement.addEventListener('load', resolve);
      scriptElement.addEventListener('error', reject);
      var origin = document.currentScript.src.split('/', 3).join('/');
      scriptElement.src = origin + "/provider/ApiProvider.js?8dde3d47317f400";
      document.head.appendChild(scriptElement);
    });
    cet.microservices.apiready = apiready;
  }
  let selfUrl = document.currentScript.src;
  cet.microservices.apiready.then(() => {
    cet.microservices.api.system.addService(selfUrl);
  });
})();
var cet = cet || {};
// the identifier prefix 'when' denotes a Promise value.
// async methods are denoted by the suffix 'Async' (unless they redirect).
if (!(cet.accessmanagement && cet.accessmanagement.loginCet)) {
    if (document.location.hostname.toLowerCase().endsWith(".cet.ac.il")) {
        cet.accessmanagement = (function () {
            window.cetIdmLoaded = true;
            const TRACE_COOKIE_NAME = "CetStateTrace";
            const EXTEND_SESSION_MAX_INTERVAL = 1000 * 60 * 10; // 10 min
            const EXTEND_SESSION_COOKIE_NAME = "CetStateExtended";

            var whenEnvLoaded = new Promise(function (resolve, reject) {
                if (cet.environment) {
                    resolve();
                }
                else {
                    var scriptel = document.createElement('script');
                    scriptel.src = '//apigateway.cet.ac.il/environment.js';
                    scriptel.onload = resolve;
                    scriptel.onerror = reject;
                    document.head.appendChild(scriptel);
                }
            }).then(() => {
                // base url for redirections
                amBaseUrl = `${location.protocol}//apigateway.${cet.environment.defaultDomain}${amApiBaseUrl}`;
            });
            var amBaseUrl;
            //base url for api using cetms
            var amApiBaseUrl = "/AccessMngApi/";

            var whenAmConfigLoaded = cet.microservices.apiready.then(() => {
                var url = amApiBaseUrl + 'config' + (window.embedded_login_loder_id ? '?loder_id=' + window.embedded_login_loder_id : '');
                return cetms.get(url);
            });

            async function getLoginModuleUrlAsync(moduleName, returnUrl, skin, language, query) {
                await whenEnvLoaded;
                var addQuery = query ? `q=${encodeURIComponent(query)}&` : '';
                return `${amBaseUrl}login/${moduleName}?${addQuery}gotourl=${encodeURIComponent(returnUrl)}&fromurl=${encodeURIComponent(location.href)}&skin=${skin || ''}&lang=${language || ''}`;
            }

            async function getImpersonateUserUrlAsync(returnUrl, skin, language, query) {
                await whenEnvLoaded;
                var addQuery = query ? `q=${encodeURIComponent(query)}&` : '';
                return `${amBaseUrl}ImpersonateUser?${addQuery}gotourl=${encodeURIComponent(returnUrl)}&fromurl=${encodeURIComponent(location.href)}&skin=${skin || ''}&lang=${language || ''}`;
            }

            async function getMfaUrlAsync(returnUrl, skin, language) {
                await whenEnvLoaded;
                return `${amBaseUrl}Mfa?gotourl=${encodeURIComponent(returnUrl)}&fromurl=${encodeURIComponent(location.href)}&skin=${skin || ''}&lang=${language || ''}`;
            }

            async function loginCet(returnUrl, skin, language) {
                returnUrl = getReturnUrl(returnUrl, 'login');
                skin = skin || config.skin;
                language = language || config.language;
                var redirectUrl = await getLoginModuleUrlAsync('start/cet', returnUrl, skin, language);
                window.location.href = redirectUrl;
            }

            async function loginMoe(returnUrl, skin, language) {
                returnUrl = getReturnUrl(returnUrl, 'login');
                skin = skin || config.skin;
                language = language || config.language;
                var redirectUrl = await getLoginModuleUrlAsync('start/moe', returnUrl, skin, language);
                window.location.href = redirectUrl;
            }

            async function impersonate(returnUrl, skin, language, as) {
                var amConfig = await whenAmConfigLoaded;
                returnUrl = getReturnUrl(returnUrl, 'login');
                skin = skin || config.skin;
                language = language || config.language;
                amConfig?.identityProvider == 1 ? await impersonateAuth0(returnUrl, skin, language, as) : await impersonateEdp(returnUrl, skin, language, as);
            }

            async function triggerMfa(returnUrl, skin, language, searchField) {
                returnUrl = getReturnUrl(returnUrl, 'login');
                skin = skin || config.skin;
                language = language || config.language;
                var redirectUrl = await getMfaUrlAsync(returnUrl, skin, language);
                if (searchField) {
                    redirectUrl += `&searchField=${searchField}`;
                }
                window.location.href = redirectUrl;
            }

            function generateRandomState() {
                return Math.random().toString(36).substr(2);  // Simple random string generator
            }

            async function impersonateEdp(returnUrl, skin, language, as) {
                var redirectUrl = await getLoginModuleUrlAsync('start/impersonate', returnUrl, skin, language, as);
                if (await isLoggedInAsync()) {
                    logout(redirectUrl);
                }
                else {
                    window.location.href = redirectUrl;
                }
            }

            async function impersonateAuth0(returnUrl, skin, language, as) {
                var redirectUrl = await getImpersonateUserUrlAsync(returnUrl, skin, language, as);
                window.location.href = redirectUrl;
            }

            async function changeRole(returnUrl, skin, language) {
                returnUrl = getReturnUrl(returnUrl);
                skin = skin || config.skin;
                language = language || config.language;
                var redirectUrl = await getLoginModuleUrlAsync('role', returnUrl, skin, language);
                window.location.href = redirectUrl;
            }

            async function logout(returnUrl, reason) {
                await whenEnvLoaded;
                var amConfig = await whenAmConfigLoaded;
                var idp = amConfig.logout[((sessionInfo || {}).loginAccount || 'CET').toLowerCase()];
                var amUrl = amBaseUrl + "logout";
                if (reason)
                    amUrl += "/" + reason;
                gotoIdpAndBack(idp.url, returnUrl, idp.returnUrlParam, '', idp.languageParam, amUrl, 'logout');
            }

            async function updateProfile(returnUrl, language) {
                await whenEnvLoaded;
                if (await isLoggedInAsync()) {
                    var amConfig = await whenAmConfigLoaded;
                    language = language || config.language;
                    var idp = amConfig.updateProfile[sessionInfo.loginAccount.toLowerCase()];
                    if (idp.url) {
                        gotoIdpAndBack(idp.url, returnUrl, idp.returnUrlParam, language, idp.languageParam, amBaseUrl + "profile/pwd");
                    }
                    else {
                        // implemented by a module in accessmngapi
                        returnUrl = getReturnUrl(returnUrl);
                        //skin = skin || config.skin;
                        language = language || config.language;
                        var redirectUrl = `${amBaseUrl}${idp.local}?gotourl=${encodeURIComponent(returnUrl)}&fromurl=${encodeURIComponent(location.href)}&lang=${language || ''}`;

                        window.location.href = redirectUrl;
                    }
                }
            }

            async function changePassword(returnUrl, language) {
                await whenEnvLoaded;
                if (await isLoggedInAsync()) {
                    var amConfig = await whenAmConfigLoaded;
                    language = language || config.language;
                    var idp = amConfig.changePassword[sessionInfo.loginAccount.toLowerCase()];
                    if (idp.url) {
                        gotoIdpAndBack(idp.url, returnUrl, idp.returnUrlParam, language, idp.languageParam, amBaseUrl + "profile/pwd");
                    }
                    else {
                        // implemented by a module in accessmngapi
                        returnUrl = getReturnUrl(returnUrl);
                        //skin = skin || config.skin;
                        language = language || config.language;
                        var redirectUrl = `${amBaseUrl}${idp.local}?gotourl=${encodeURIComponent(returnUrl)}&fromurl=${encodeURIComponent(location.href)}&lang=${language || ''}`;

                        window.location.href = redirectUrl;
                    }
                }
            }

            function gotoIdpAndBack(idpUrl, appReturnUrl, idpReturnUrlParam, language, idpLanguageParam, amCallbackUrl, eventName) {
                appReturnUrl = getReturnUrl(appReturnUrl, eventName);
                if (idpLanguageParam && language) {
                    let queryChar = idpUrl.indexOf('?') > -1 ? '&' : '?';
                    if (language === "vi" || language === "zh") {
                        language = 'en';
                    }
                    idpUrl += `${queryChar}${idpLanguageParam}=${language}`;
                }
                if (idpReturnUrlParam) {
                    var idpReturnUrl = appReturnUrl;
                    if (amCallbackUrl) {
                        // assuming amCallbackUrl has no querystring
                        idpReturnUrl = `${amCallbackUrl}?gotourl=${encodeURIComponent(appReturnUrl)}&fromurl=${encodeURIComponent(location.href)}`;
                    }
                    let queryChar = idpUrl.indexOf('?') > -1 ? '&' : '?';
                    var redirectUrl = `${idpUrl}${queryChar}${idpReturnUrlParam}=${encodeURIComponent(idpReturnUrl)}`;
                    location.href = redirectUrl;
                }
                else {
                    window.open(idpUrl, "_blank")
                }
            }

            function makeAbsoluteUrl(url) {
                if (url) {
                    return new URL(url, location.origin).href;
                }
                else {
                    return location.href;
                }
            }

            // set a random deviation of pages interval (up to 1 min) so not all pages send at once.
            var extendSessionInterval = EXTEND_SESSION_MAX_INTERVAL - Math.floor(1000 * 60 * Math.random());
            var extendSessionTimer;

            async function extendSessionAsync() {
                if (await isLoggedInAsync()) {
                    // debounce cross open pages
                    console.debug("extendSession: my interval is " + (extendSessionInterval));
                    debounceCrossPagesAsync(EXTEND_SESSION_COOKIE_NAME, extendSessionInterval, extendSessionTimer, requestExtendSessionAsync);
                    return true;
                }
                else {
                    return false;
                }
            }

            async function initExtendSessionDebounce(sessionExists) {
                // on page load after logout, clear the cookie saving the last extendSession time.
                // on page load after login, update it to NOW (if it is not empty then the login occured some time ago).
                if (sessionExists) {
                    if (!(await getCookieAsync(EXTEND_SESSION_COOKIE_NAME))) {
                        setCookieAsync(EXTEND_SESSION_COOKIE_NAME, new Date().getTime());
                    }
                }
                else {
                    setCookieAsync(EXTEND_SESSION_COOKIE_NAME, "");
                }
            }

            function stopExtendSessionDebounce() {
                if (extendSessionTimer) {
                    clearTimeout(extendSessionTimer);
                }
            }

            async function debounceCrossPagesAsync(cookieName, interval, timer, action) {
                async function tryRunActionAsync() {
                    var timeLeft = await getTimeToNextBeatAsync();
                    if (timeLeft) {
                        console.debug("extendSession: missed my turn...");
                    }
                    else {
                        action();
                        console.debug('extendSession: running action');
                        setCookieAsync(cookieName, new Date().getTime());
                    }
                }

                async function getTimeToNextBeatAsync() {
                    var timeLeft = 0;
                    var lastRunStr = await getCookieAsync(cookieName);
                    if (lastRunStr) {
                        var lastRun = new Date(1 * lastRunStr);
                        var elapsed = new Date() - lastRun;
                        if (elapsed < interval) {
                            timeLeft = interval - elapsed;
                        }
                    }
                    return timeLeft;
                }

                if (timer) {
                    clearTimeout(timer);
                }
                var postpone = await getTimeToNextBeatAsync();
                console.debug('extendSession: postpone ' + postpone);
                timer = setTimeout(tryRunActionAsync, postpone);
            }

            var sessionInfo;
            async function loadSessionAsync() {
                if (await isLoggedInAsync()) {
                    initExtendSessionDebounce(true);
                    await cet.microservices.apiready;
                    sessionInfo = await cetms.safe.get(amApiBaseUrl + 'state');
                }
                else {
                    initExtendSessionDebounce();
                    sessionInfo = null;
                }
                return sessionInfo;
            }
            async function getSessionAsync() {
                await whenSessionLoaded;
                return sessionInfo;
            }

            async function getSessionTraceAsync() {
                return await getCookieAsync(TRACE_COOKIE_NAME);
            }

            function parseTrace(trace) {
                var traceObject = null;
                if (trace) {
                    traceObject = {};
                    var traceProps = trace.split('&');
                    for (var i = 0; i < traceProps.length; i++) {
                        var joined = traceProps[i];
                        var pair = joined.split('=');
                        traceObject[pair[0]] = pair[1];
                    }
                }
                return traceObject;
            }

            function isLoggedInByTrace(traceObject) {
                return !!(traceObject && traceObject.userId);
            }

            async function isLoggedInByCurrentTraceAsync() {
                var trace = await getSessionTraceAsync();
                var traceObject = parseTrace(trace);
                return isLoggedInByTrace(traceObject);
            }
            async function isLoggedInAsync() {
                await whenAuthenticated;
                return await isLoggedInByCurrentTraceAsync();
            }

            async function isAuthenticatedForServicesAsync() {
                await adjustSessionCookiesOnStartup();
                return await hasCookieAsync(TRACE_COOKIE_NAME);
            }
            function whenAuthenticatedForServices() {
                return whenAuthenticated;
            }
            async function adjustSessionCookiesOnStartup() {
                // when a user is logged in, the http-only state cookie is session length, while the trace has an expiry.
                // if the browser is restarted, the state is cleared but the trace remains. test with the extend_session cookie which is also session length and clear the trace.
                if (await hasCookieAsync(TRACE_COOKIE_NAME) && !(await hasCookieAsync(EXTEND_SESSION_COOKIE_NAME))) {
                    await deleteCookieAsync(TRACE_COOKIE_NAME);
                }
            }
            async function authenticateGuest() {
                await cet.microservices.apiready;
                await cetms.get(`${amApiBaseUrl}authentication/guest`, { authentication: true, responseFormat: cetms.responseFormat.EMPTY });
            }

            var requestExtendSessionAsync = async function () {
                if (await cetms.safe.post(amApiBaseUrl + 'state/extend')) {
                    return true;
                }
                else {
                    // session max time reached...
                    logout();
                }
            }

            var getCookieNameAsync = async function (basename) {
                await whenEnvLoaded;
                return cet.environment.prefix + basename;
            }
            var setCookieAsync = async function (name, value, maxageSeconds) {
                var expiration = "";
                if (maxageSeconds === 0) {
                    expiration = `expires=${new Date(0).toUTCString()};`
                }
                else if (maxageSeconds) {
                    expiration = `max-age=${maxageSeconds};`;
                }
                var cname = await getCookieNameAsync(name);
                document.cookie = `${cname}=${(value || "")};${expiration} path=/; domain=${cet.environment.defaultDomain}`;
            }
            var deleteCookieAsync = async function (name) {
                await setCookieAsync(name, '', 0);
            };
            var getCookieAsync = async function (name) {
                var cname = await getCookieNameAsync(name);
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(cname + "=") === 0) {
                        return c.substring(1 + cname.length, c.length);
                    }
                }
                return "";
            };
            var hasCookieAsync = async function (name) {
                var cname = await getCookieNameAsync(name);
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(cname + "=") === 0) {
                        return true;
                    }
                }
                return false;
            };

            // initialize apiProvider safe api
            var whenAuthenticated = // evaluate to a promise resolved when at least a guest session is found or created.
                isAuthenticatedForServicesAsync().then(authenticated => {
                    if (authenticated) {
                        return Promise.resolve();
                    }
                    else {
                        return authenticateGuest();
                    }
                });

            var whenSessionLoaded = loadSessionAsync();

            /* SSO events */
            const TRACE_INTERVAL = 2000;
            const TIMEOUT_CORRELATION_COOKIE = "cetTimeouting";
            async function traceStateAsync() {
                var newTrace = await getSessionTraceAsync();
                if (newTrace) {
                    if (newTrace != currentTrace) {
                        whenSessionLoaded = loadSessionAsync();
                        onTraceChangedAsync(parseTrace(currentTrace), parseTrace(newTrace));
                        currentTrace = newTrace;
                    }
                }
                else {
                    var loginSession = await isAuthenticatedForServicesAsync();
                    // login short-time session expired
                    if (!loginSession) {
                        if (sessionInfo != null) { //if the user was logged in
                            await sendLogoutEventAsync(sessionInfo.userId, sessionInfo.role, sessionInfo.schoolId, sessionInfo.sessionId, "timeout");
                        }
                        if (!(await hasCookieAsync(TIMEOUT_CORRELATION_COOKIE))) {
                            await setCookieAsync(TIMEOUT_CORRELATION_COOKIE, "1", Math.ceil(TRACE_INTERVAL / 1000));
                            logout(null, "timeout");
                        }
                        // else wait for full logout by the page that registerd TIMEOUT_CORRELATION_COOKIE
                    }
                }
            }

            // convert async traceStateAsync to sync for setInterval
            function traceStatePromise() {
                return traceStateAsync();
            }

            // start tracing state
            var currentTrace = null;
            whenAuthenticated.then(getSessionTraceAsync).then(trace => {
                currentTrace = trace;
                setInterval(traceStatePromise, TRACE_INTERVAL);
            });

            async function onTraceChangedAsync(oldTraceObject, newTraceObject) {
                var eventName, data, reload;
                // when calling this function, whenSessionLoaded is a pending promise.
                // this means: sessionInfo still holds the old value, but awaiting whenSessionLoaded or getSessionAsync will update it.
                // (This is on purpose, but if it is confusing you may change this and pass here the old and the new session info)
                if (!isLoggedInByTrace(oldTraceObject) && isLoggedInByTrace(newTraceObject)) {
                    eventName = "login";
                    data = { session: await getSessionAsync() /* the new one */ };
                    reload = true;
                    fireEvent(eventName, data, reload);
                }
                else if (isLoggedInByTrace(oldTraceObject) && !isLoggedInByTrace(newTraceObject)) {
                    stopExtendSessionDebounce();
                    eventName = "logout";
                    data = { session: sessionInfo /* the old one */ };
                    reload = true;
                    fireEvent(eventName, data, reload);
                }
                else if (isLoggedInByTrace(oldTraceObject) && isLoggedInByTrace(newTraceObject)) {
                    // both events (sessionchange, profilechange) may be fired sequentially (theoretically). only the first one reloads by default.
                    var properties = findDifferentProperties(["role", "schoolId"], oldTraceObject, newTraceObject);
                    if (properties.length) {
                        eventName = "sessionchange";
                        data = { propertyNames: properties };
                        reload = true;
                        fireEvent(eventName, data, reload);
                    }
                    properties = findDifferentProperties(["email"], oldTraceObject, newTraceObject);
                    if (properties.length) {
                        eventName = "profilechange";
                        data = { propertyNames: properties };
                        reload = false;
                        fireEvent(eventName, data, reload);
                    }
                }
            }

            function findDifferentProperties(names, oldTrace, newTrace) {
                return names.filter(name => oldTrace[name] != newTrace[name]);
            }
            function fireEvent(name, data, reload) {
                var ev = new CustomEvent("cet.accessmanagement." + name, { detail: data, bubbles: true, cancelable: true });
                var doDefault = document.dispatchEvent(ev); // returns true if not cancelled
                if (doDefault && reload) {
                    var url = getReturnUrl(null, name);
                    location.assign(url);
                }
            }
            function getReturnUrl(returnUrlParam, eventName) {
                var requestedUrl = returnUrlParam || getConfiguredReturnUrl(eventName);
                if (requestedUrl)
                    return makeAbsoluteUrl(requestedUrl);
                else
                    return location.href;
            }
            function getConfiguredReturnUrl(eventName) {
                switch (eventName) {
                    case "login":
                        //case "sessionchange": // TODO: ???
                        return config.loginReturnUrl;
                    case "logout":
                        return config.logoutReturnUrl;
                    default:
                        return null;
                }
            }

            function getLogoutEvent(userId, userRole, schoolId, sessionId, reason) {
                return {
                    "product": "foundations",
                    "verb": cet.microservices.bigData.enums.verbs.logged_out,
                    "userId": userId,
                    "userRole": userRole,
                    "objectType": cet.microservices.bigData.enums.objectTypes.user,
                    "objectName": userId,
                    "objectId": userId,
                    "contextReferrer": location.href,
                    "optionalData": {
                        "sessionId": sessionId,
                        "schoolId": schoolId,
                        "objectAdditionalInformation": {
                            "reason": reason || "sign-out"
                        }
                    }
                };
            }

            async function sendLogoutEventAsync(userId, userRole, schoolId, sessionId, reason) {
                try {
                    await loadEventsApi();
                }
                catch (e) {
                    console.error('could not load bigdataprovider.js.', e);
                    return;
                }
                var eve = getLogoutEvent(userId, userRole, schoolId, sessionId, reason);
                // must await to bdp's first-time-on-page preparations
                await cet.microservices.bigData.messages.sendLearningEvent(eve.verb, eve.objectId, eve.objectName, eve.objectType, eve.product, eve.contextReferrer, eve.userRole, eve.userId, eve.optionalData);
            }

            async function loadEventsApi() {
                if (cet.microservices.bigData) return;
                await cetms.loadApi('/bigdataapi/provider/bigdataprovider.js');
            }

            var config = {
                loginReturnUrl: null,
                logoutReturnUrl: null,
                skin: null,
                language: null
            };
            var configuration = {
                setLoginReturnUrl: function (url) {
                    config.loginReturnUrl = url;
                },
                setLogoutReturnUrl: function (url) {
                    config.logoutReturnUrl = url;
                },
                setSkin: function (skin) {
                    config.skin = skin;
                },
                setLanguage: function (language) {
                    config.language = language;
                },
                configure: function (options) {
                    // copy recognized properties from options to config.
                    if (typeof (options) === typeof ({})) {
                        for (var key in options) {
                            if (config.hasOwnProperty(key)) {
                                config[key] = options[key];
                            }
                        }
                    }
                }
            }

            var idm = {
                loginCet,
                loginMoe,
                changeRole,
                logout,
                getSessionAsync,
                isLoggedInAsync,
                whenAuthenticatedForServices,
                //authenticateGuestAsync,
                updateProfile,
                changePassword,
                extendSessionAsync,
                configuration,
                impersonate,
                triggerMfa
            };

            //Object.defineProperty(idm, 'LoggedInVia', { get: getLoggedInVia });

            return idm;

        })();
    }
    else {
        // not supported yet. return an empty API
        cet.accessmanagement = {
            loginCet: () => { },
            loginMoe: () => { },
            changeRole: () => { },
            logout: () => { },
            getSessionAsync: () => Promise.resolve(),
            isLoggedInAsync: () => Promise.resolve(),
            whenAuthenticatedForServices: () => new Promise(function (resolve, reject) { }),
            //authenticateGuestAsync,
            updateProfile: () => { },
            changePassword: () => { },
            extendSessionAsync: () => Promise.resolve(),
            configuration: {
                setLoginReturnUrl: () => { },
                setLogoutReturnUrl: () => { },
                setSkin: () => { },
                setLanguage: () => { },
                configure: () => { }
            },
            impersonate: () => { }
        };
    }
}
