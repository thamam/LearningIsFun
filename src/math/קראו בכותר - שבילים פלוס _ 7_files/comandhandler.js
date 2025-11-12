self.workerbaseurl;

self.addEventListener('message', function (e) {
  var data = e.data;
  workerbaseurl = data.workerbaseurl;

  switch (data.cmd) {
    case 'bookextensions.getallbookextensions':
      LoadBookMiniMarkers(data.param);
      break;
    case 'stop':
      self.close();
      break;
    case 'openLogin':
      Toolbar.login();
  };
}, false);

//command specific functions
function LoadBookMiniMarkers(nBookID) {

  var params = [({ name: "SerType", value: 2 }, { name: "nBookID", value: nBookID })];
  clearDomElements = false;
  callAppKotarCommand("BookExtensions.GetAllBookExtensions", params, {
    onSuccessFunction: loadMiniMarkerWorker_OnComplete,
    onFailureFunction: loadMiniMarkerWorker_OnError,
    nLoadMarkerAfterRefresh: 0,
    clearDomElements: clearDomElements
  });
}

function loadMiniMarkerWorker_OnComplete(aMiniMarkers, oInfo) {
  var objData = {
    cmd: "bookextensions.getallbookextensions",
    aMiniMarkers: aMiniMarkers,
    oInfo: {
      nLoadMarkerAfterRefresh: oInfo.nLoadMarkerAfterRefresh,
      clearDomElements: oInfo.clearDomElements
    }
  };
  self.postMessage(objData);
}

function loadMiniMarkerWorker_OnError() {
  console.log("error");
}


//command handler
function callAppKotarCommand(command, parameters, callbackData) {
  var url = buildKotarCommandBaseUrl('CommandHandler', command);
  if (parameters && parameters.length > 0) {
    for (var i = 0; i < parameters.length; i++) {
      url += encodeURI('&' + parameters[i].name + '=' + parameters[i].value);
    }
  }
  ajax(url, parameters, callbackData);
};

var ajax = function (url, data, callbackData, type) {
  var data_array, data_string, idx, req, value;
  if (data == null) {
    data = {};
  }
  if (callbackData == null) {
    callbackData = function () { };
  }
  if (type == null) {
    //default to a GET request
    type = 'GET';
  }
  data_array = [];
  for (idx in data) {
    parameters = data[idx];
    data_array.push("" + parameters.name + "=" + parameters.value);
  }
  data_string = data_array.join("&");
  req = new XMLHttpRequest();
  req.open(type, url, false);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      if (callbackData && callbackData.onSuccessFunction) {
        return callbackData.onSuccessFunction(req.response, callbackData);
      }
    }
    else {
      if (callbackData && callbackData.onFailureFunction) {
        callbackData.onFailureFunction();
      }
    }
  };
  req.send(data_string);
  return req;
};

function buildKotarCommandBaseUrl(pagename, methodName) {
  var pageurl = new Array();
  pageurl.push('//', workerbaseurl, '/KotarApp/System/', pagename, '.aspx?command=', methodName);

  return pageurl.join('');
}





