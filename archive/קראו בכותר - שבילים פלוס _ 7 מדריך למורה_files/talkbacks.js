/*!
	Autosize 3.0.8
	license: MIT
	http://www.jacklmoore.com/autosize
*/
!function(e,t){if("function"==typeof define&&define.amd)define(["exports","module"],t);else if("undefined"!=typeof exports&&"undefined"!=typeof module)t(exports,module);else{var o={exports:{}};t(o.exports,o),e.autosize=o.exports}}(this,function(e,t){"use strict";function o(e){function t(){var t=window.getComputedStyle(e,null);"vertical"===t.resize?e.style.resize="none":"both"===t.resize&&(e.style.resize="horizontal"),u="content-box"===t.boxSizing?-(parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)):parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth),i()}function o(t){var o=e.style.width;e.style.width="0px",e.offsetWidth,e.style.width=o,v=t,l&&(e.style.overflowY=t),n()}function n(){var t=window.pageYOffset,o=document.body.scrollTop,n=e.style.height;e.style.height="auto";var i=e.scrollHeight+u;return 0===e.scrollHeight?void(e.style.height=n):(e.style.height=i+"px",document.documentElement.scrollTop=t,void(document.body.scrollTop=o))}function i(){var t=e.style.height;n();var i=window.getComputedStyle(e,null);if(i.height!==e.style.height?"visible"!==v&&o("visible"):"hidden"!==v&&o("hidden"),t!==e.style.height){var r=document.createEvent("Event");r.initEvent("autosize:resized",!0,!1),e.dispatchEvent(r)}}var r=void 0===arguments[1]?{}:arguments[1],d=r.setOverflowX,s=void 0===d?!0:d,a=r.setOverflowY,l=void 0===a?!0:a;if(e&&e.nodeName&&"TEXTAREA"===e.nodeName&&!e.hasAttribute("data-autosize-on")){var u=null,v="hidden",f=function(t){window.removeEventListener("resize",i),e.removeEventListener("input",i),e.removeEventListener("keyup",i),e.removeAttribute("data-autosize-on"),e.removeEventListener("autosize:destroy",f),Object.keys(t).forEach(function(o){e.style[o]=t[o]})}.bind(e,{height:e.style.height,resize:e.style.resize,overflowY:e.style.overflowY,overflowX:e.style.overflowX,wordWrap:e.style.wordWrap});e.addEventListener("autosize:destroy",f),"onpropertychange"in e&&"oninput"in e&&e.addEventListener("keyup",i),window.addEventListener("resize",i),e.addEventListener("input",i),e.addEventListener("autosize:update",i),e.setAttribute("data-autosize-on",!0),l&&(e.style.overflowY="hidden"),s&&(e.style.overflowX="hidden",e.style.wordWrap="break-word"),t()}}function n(e){if(e&&e.nodeName&&"TEXTAREA"===e.nodeName){var t=document.createEvent("Event");t.initEvent("autosize:destroy",!0,!1),e.dispatchEvent(t)}}function i(e){if(e&&e.nodeName&&"TEXTAREA"===e.nodeName){var t=document.createEvent("Event");t.initEvent("autosize:update",!0,!1),e.dispatchEvent(t)}}var r=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(r=function(e){return e},r.destroy=function(e){return e},r.update=function(e){return e}):(r=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return o(e,t)}),e},r.destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],n),e},r.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],i),e}),t.exports=r});
var cet = cet || {};
(function (i18n) {
  "use strict";

  var data = {}, code = "he";

  function setCode(newCode) {
    if (newCode) {
      code = newCode;
    }
  };

  function add(code, items) {
    var langData = data[code];

    if (!langData) {
      data[code] = langData = {};
    }

    for (var name in items) {
      langData[name] = items[name];
    }
  };

  function geti18n() {
    var langData;

    langData = data[code];
    if (!langData) {
      langData = {};
    }
    langData.code = code;

    return langData;
  };

  function translate(text) {
    var langData;

    langData = data[code];
    if (!langData) {
      langData = {};
    }

    if (typeof text === "undefined") {
      return text;
    }

    return langData[text] || text;
  };

  

  i18n.setCode = setCode;
  i18n.add = add;
  i18n.geti18n = geti18n;
  i18n.translate = translate;
})(cet.talkbackI18n || (cet.talkbackI18n = {}));
var cet = cet || {};
(function (talkbacksapi, $) {
  "use strict";

  var baseApiUrl = "";

  function Init(baseurl) {
    baseApiUrl = "//talkbackservice." + baseurl + "/Talkback/";
  }

  function callMethod(method, onSuccess) {
    $.getJSON(baseApiUrl + method)
      .done(function (data) {
        onSuccess(data);
      });
  }

  function postMethod(method, dataIn, onSuccess) {
    $.ajax({
      url: baseApiUrl + method,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(dataIn)
    }).done(function (dataOut) {
      onSuccess(dataOut);
    });
  }


  function GetItemTalkbackList(projectKey, projectSectionKey, projectItemKey, token, onSuccess) {
    callMethod("getItemTalkbackList?projectKey=" + projectKey + "&projectSectionKey=" + projectSectionKey + "&projectItemKey=" + projectItemKey + "&token=" + token, onSuccess);
  }

  function GetItemTalkbackCount(projectKey, projectSectionKey, projectItemKey, onSuccess) {
    callMethod("getItemTalkbackCount?projectKey=" + projectKey + "&projectSectionKey=" + projectSectionKey + "&projectItemKey=" + projectItemKey, onSuccess);
  }

  function GetConversationData(projectKey, projectSectionKey, projectItemKey, token, onSuccess) {
    callMethod("GetConversationData?projectKey=" + projectKey + "&projectSectionKey=" + projectSectionKey + "&projectItemKey=" + projectItemKey + "&token=" + token, onSuccess);
  }

  function DeleteTalkback(talkbackID, token, onSuccess) {
    var data = {};
    data.talkbackID = talkbackID;
    data.token = token;
    postMethod("deleteTalkback", data, onSuccess);
  }

  function InsertTalkback(projectKey, projectSectionKey, projectItemKey, username, title, body, token, onSuccess) {
    var data = {};
    data.projectKey = projectKey;
    data.projectSectionKey = projectSectionKey;
    data.projectItemKey = projectItemKey;
    data.title = title;
    data.body = body;
    data.username = username;
    data.token = token;
    postMethod("insertTalkback", data, onSuccess);
  }

  function CreateTalkbackTicket(userName, gUserId, onSuccess) {
    var data = {};
    data.userName = userName;
    data.gUserId = gUserId;
    postMethod("createTalkbackTicket", data, onSuccess);
  }

  talkbacksapi.GetItemTalkbackList = GetItemTalkbackList;
  talkbacksapi.GetItemTalkbackCount = GetItemTalkbackCount;
  talkbacksapi.DeleteTalkback = DeleteTalkback;
  talkbacksapi.InsertTalkback = InsertTalkback;
  talkbacksapi.CreateTalkbackTicket = CreateTalkbackTicket;
  talkbacksapi.GetConversationData = GetConversationData;
  talkbacksapi.init = Init;
})(cet.talkbacksapi || (cet.talkbacksapi = {}), jQuery);
var cet = cet || {};
(function (talkbacksui, talkbacksapi, talkbackI18n) {
  "use strict";

  var headerTemplateUrl = "/Templates/talkbacksHeaderTemplate.html";
  var listTemplateUrl = "/Templates/talkbacksListTemplate.html";
  var headerTemplate = "";
  var listTemplate = "";
  var settings = {};
  var rtlSelector = "_rtl";
  var lanSelector = "he";
  var defaults = {
    baseurl: "",
    projectKey: "",
    projectSectionKey: "",
    username: "",
    token: "",
    candelete: false,
    onupdated: null,
    langcode: "he"
  };

  //#region utility functions
  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  };

  function getUrl(url, onSuccess) {
    var request = new XMLHttpRequest();
    request.open('GET', "//talkbackservice." + settings.baseurl + url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        onSuccess(request.responseText);
      } else {
        // We reached our target server, but it returned an error
      }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
  }

  function closest(element, id) {
    var retVal = null;
    var el = element;
    while (retVal === null) {
      if (el.id === id) {
        retVal = el;
      }
      else if (el.parentElement === null) {
        break;
      }
      else {
        el = el.parentElement;
      }
    }

    return retVal;
  }

  function parseHTML(str) {
    var tmp = document.createElement("span");
    tmp.innerHTML = str;
    return tmp.childNodes[0];
  }
  //#endregion

  //#region public functions
  function Init(options) {
    settings = extend({}, defaults, options);
    getUrl(headerTemplateUrl, function (template) { headerTemplate = template; });
    getUrl(listTemplateUrl, function (template) { listTemplate = template; });
    talkbacksapi.init(settings.baseurl);
    talkbackI18n.setCode(settings.langcode);
    rtlSelector = setRtlSelector(settings.langcode);
    lanSelector = settings.langcode;
  };

  function LoadConversation(el, projectItemKey) {
    setTimeout(function (el) {
      RenderHeader(el, projectItemKey);
    }, 0, el);
    bindEvents(el);
  };

  function Collapse(container) {
    var list = container.querySelector("[id^=tb_list]");
    if (list != null) {
      var show = container.querySelector("#tb_show_comments");
      var hide = container.querySelector("#tb_hide_comments");
      if (!list.classList.contains("tb-collapsed")) {
        list.classList.add("tb-collapsed");
        show.style.display = "inline";
        hide.style.display = "none";
      }
      callupdatecallback();
    }
  };
  //#endregion

  //#region private functions
  function setRtlSelector(langcode) {
    if (langcode == "he" || langcode == "ar") {
      return "_rtl";
    }
    else {
      return "_ltr";
    }
  };

  function ToggleConversation(element) {
    var tb = closest(element, "tb_wrapper");
    if (tb != null) {
      var pkey = tb.dataset["pkey"];
      var list = tb.querySelector("[id^=tb_list]");
      if (list != null) {
        ToggleConversationList(tb, list);
      }
      else {
        LoadConversationList(tb, pkey);
      }
    }
  };

  function RenderHeader(element, projectItemKey) {
    element.innerHTML = getPreloaderDiv();
    talkbacksapi.GetConversationData(
        settings.projectKey,
        settings.projectSectionKey,
        projectItemKey,
        settings.token,
        function (data) {
          var json = null;
          if (data.ok) {
            json = data.value;
          }
          else if (data.code === 1) {
            //this is a new converations
            json = data.value;
          }          
          if (json != null) {
            json.i18n = talkbackI18n.geti18n();
            json.rtlSelector = rtlSelector;
            json.lanSelector = lanSelector;
            element.innerHTML = Mustache.render(headerTemplate, json);
            callupdatecallback();
            setautosize(element);
          }
          else {
            //error - clear the preloader            
            element.innerHTML = "";
          }
        });
  }

  function RerenderHeader(tbEl, projectItemKey, bShowList) {
    var header = tbEl.querySelector("#tb_wrapper_header");
    talkbacksapi.GetConversationData(
        settings.projectKey,
        settings.projectSectionKey,
        projectItemKey,
        settings.token,
        function (data) {
          if (data.ok) {
            data.value.i18n = talkbackI18n.geti18n();
            data.value.rtlSelector = rtlSelector;
            data.value.lanSelector = lanSelector;
            var str = Mustache.render(headerTemplate, data.value);
            var html = parseHTML(str);
            header.outerHTML = html.innerHTML;
            fixiebug(tbEl);

            var list = tbEl.querySelector("[id^=tb_list]");
            SetConversationListHeader(tbEl, list, bShowList);          
          }
        });
  }

  function AddTalkback(element) {
    var tb = closest(element, "tb_wrapper");
    if (tb != null) {
      var newtb = tb.querySelector("#tb_text_new_talkback");
      var body = newtb.value;
      var pkey = tb.dataset["pkey"];
      if (body !== "") {
        talkbacksapi.InsertTalkback(
          settings.projectKey,
          settings.projectSectionKey,
          pkey,
          settings.username,
          "",
          body,
          settings.token,
          function (data) {
            if (data.ok) {
              RenderNewTalkback(tb, pkey, data);
            }
          });
      }
      fixiebug(tb);
    }
  };

  function RenderNewTalkback(tbEl, pkey, data) {
    //rerender header    
    var list = tbEl.querySelector("[id^=tb_list]");    

    //render list
    if (list != null) {
      RerenderHeader(tbEl, pkey, true);

      data.candelete = settings.candelete;
      data.rtlSelector = rtlSelector;
      data.lanSelector = lanSelector;
      var str = Mustache.render(listTemplate, data);
      var tmplt = parseHTML(str);
      var li = tmplt.childNodes[1];
      list.insertBefore(li, list.firstChild);

      if (list.classList.contains("tb-collapsed")) {
        ToggleConversationList(tbEl, list);
      }      

      callupdatecallback();
    }
    else {
      LoadConversationList(tbEl, pkey);
    }
  }


  function LoadConversationList(tbEl, pkey) {
    tbEl.appendChild(parseHTML(getPreloaderDiv()));
    talkbacksapi.GetItemTalkbackList(
      settings.projectKey,
      settings.projectSectionKey,
      pkey,
      settings.token,
      function (data) {
        var preloader = tbEl.querySelector(".tb-preloder");
        if (preloader) {
          preloader.parentElement.removeChild(preloader);
        }
        if (data.ok) {          
          data.candelete = settings.candelete;
          data.rtlSelector = rtlSelector;
          data.lanSelector = lanSelector;
          var str = Mustache.render(listTemplate, data);
          var tmplt = parseHTML(str);
          tbEl.appendChild(tmplt);
       
          RerenderHeader(tbEl, pkey, true);

          var show = tbEl.querySelector("#tb_show_comments");
          var hide = tbEl.querySelector("#tb_hide_comments");
          show.style.display = "none";
          hide.style.display = "inline";
          callupdatecallback();
        }
      });
  };

  function ToggleConversationList(tbEl, list) {
    var show = tbEl.querySelector("#tb_show_comments");
    var hide = tbEl.querySelector("#tb_hide_comments");
    if (list.classList.contains("tb-collapsed")) {
      list.classList.remove("tb-collapsed");
      show.style.display = "none";
      hide.style.display = "inline";
    }
    else {
      list.classList.add("tb-collapsed");
      show.style.display = "inline";
      hide.style.display = "none";
    }
    callupdatecallback();
  }

  function SetConversationListHeader(tbEl, list, bToShow) {
    var show = tbEl.querySelector("#tb_show_comments");
    var hide = tbEl.querySelector("#tb_hide_comments");
    if (bToShow === true) {
      show.style.display = "none";
      hide.style.display = "inline";
    }
    else {
      show.style.display = "inline";
      hide.style.display = "none";
    }
  }


  function DeleteTalkback(element) {
    var tb = closest(element, "tb_wrapper");
    var list = tb.querySelector("[id^=tb_list]");
    if (tb != null && list != null) {
      var pkey = tb.dataset["pkey"];
      var tkbid = element.dataset["id"];
      var isListHidden = (list.classList.contains("tb-collapsed"));
      talkbacksapi.DeleteTalkback(
        tkbid,
        settings.token,
        function (data) {
          if (data.ok) {
            var li = element.parentNode;
            var parentNode = li.parentNode;
            parentNode.removeChild(li);
            RerenderHeader(tb, pkey, !(parentNode.children.length === 0));
          }
        });
    }
  }

  function callupdatecallback() {
    if (typeof settings.onupdated === "function") {
      settings.onupdated();
    }
  }

  function setautosize(element) {
    setTimeout(function () {
      var tb = element.querySelector("#tb_text_new_talkback")
      autosize(tb);
      tb.addEventListener("autosize:resized", function () {
        callupdatecallback();
      });
    }, 0);
  }

  function getPreloaderDiv() {
    return "<div class='tb-preloder' style='width: 100%; height: 100px;'></div>";
  }

  function fixiebug(tbEl) {
    //Bug 110190
    var ta = tbEl.querySelector("#tb_text_new_talkback");
    ta.value = "";
  };
  //#endregion

  function bindEvents(element) {
    element.addEventListener("click", function (e) {
      var elem = e.target;
      var command = elem.dataset["command"];

      switch (command) {
        case "toggle":
          ToggleConversation(elem);
          break;
        case "addnew":
          AddTalkback(elem);
          break;
        case "delete":
          DeleteTalkback(elem);
          break;
      }
    });
  };

  talkbacksui.init = Init;
  talkbacksui.loadConversation = LoadConversation;
  talkbacksui.collapse = Collapse;
})(cet.talkbacksui || (cet.talkbacksui = {}), cet.talkbacksapi, cet.talkbackI18n);
cet.talkbackI18n.add("he", {
  "Comments": "תגובות",
  "Show_Comments": "הצג תגובות",
  "Hide_All_Comments": "הסתר כל התגובות",
  "Add_Comment": "הוסף תגובה"
});
cet.talkbackI18n.add("ar", {
  "Comments": "تعليقات",
  "Show_Comments": "عرض التعليقات",
  "Hide_All_Comments": "إخفاء كلّ التعليقات",
  "Add_Comment": "إضافة تعليق"
});
cet.talkbackI18n.add("en", {
  "Comments": "Comments",
  "Show_Comments": "Show Comments",
  "Hide_All_Comments": "Hide All Comments",
  "Add_Comment": "Add Comment"
});
cet.talkbackI18n.add("zh", {
  "Comments": "注释",
  "Show_Comments": "显示注释",
  "Hide_All_Comments": "隐藏所有注释",
  "Add_Comment": "添加注释"
});