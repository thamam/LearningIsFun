/// <reference path="embeddedlogin.js" />
(function () {

  var config = {
    "sites": {
      "ebag.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag"},
      "ar.ebag.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ar.ebag" },
      "ebaghigh.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "ofek4class.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "mytestbox.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "testbox.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "ebag" },
      "ebagcourses.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "ar.ebagcourses.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ar.ebag" },
      "smarttest.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "ebag" },
      "ar.smarttest.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "ar.ebag" },
      "mindcet.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "links.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "myebag.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ebag" },
      "arlearners.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ar.ebag" },
      "ar.mindsonstem.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "ar.ebag" },
      "mindsonstem.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "en.ebag" },
      "horizon.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "en.ebag" },
      "ivritil.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "ivritil" },
      "discovery.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "en.ebag" },
      "vsionglobal.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "vi.ebag" },
      "nobel.cet.ac.il": { hideElementsKey: "EbagRedirectCetLogin", cssFileKey: "zh.ebag" },
      "tal.cet.ac.il": { hideElementsKey: "Ebag", cssFileKey: "zh.ebag" },
      "lo.cet.ac.il": { hideElementsKey: "LO", cssFileKey: "lo" },
      "mybag.ebag.cet.ac.il": { hideElementsKey: "MyBag", cssFileKey: "mybag.ebag" },
      "mybag.mytestbox.cet.ac.il": { hideElementsKey: "MyBag", cssFileKey: "mybag.ebag" },
      "school.kotar.cet.ac.il": { hideElementsKey: "Kotar", cssFileKey: "school.kotar" },
      "ar.school.kotar.cet.ac.il": { hideElementsKey: "Kotar", cssFileKey: "ar.school.kotar" },
      "kotar.cet.ac.il": { hideElementsKey: "Kotar", cssFileKey: "kotar" },
      "productplayer.cet.ac.il": { hideElementsKey: "ProductPlayer", cssFileKey: "productplayer" },
      "cybersquad-he.cet.ac.il": { hideElementsKey: "Cybersquad", cssFileKey: "he.cybersquad" },
      "cybersquad.cet.ac.il": { hideElementsKey: "Cybersquad", cssFileKey: false },
      "kefel3.cet.ac.il": { hideElementsKey: "Kefel3", cssFileKey: "Kefel3" },
      "kesem2.cet.ac.il": { hideElementsKey: "kesem2", cssFileKey: "kesem2" },
      "nairobi": { hideElementsKey: "Nairobi", cssFileKey: "nairobi" }
    },
    "hideElements": {
      "Ebag": [
        ".tile-content.tile-login[data-widget='login'] .login-widget-wrapper",
        ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll"
      ],
      "EbagRedirectCetLogin": [
        ".cus-login-main-container .cus-login-inner-container.cus-container"
      ],
      "LO": [
        ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll"
      ],
      "MyBag": [
        "#ctl00_MainBody_LoginControl1_upLoginDialog"
      ],
      "Kotar": [
        ".login .login-container",
        "form[action*='/login.aspx'] .cart_info",
        "form[action*='/Create.aspx'] .cart_info.kotar_acces_mng-popup .login-container-outer[style*='display: block']",
        "form[action*='/Purchase.aspx'] .cart_info.kotar_acces_mng-popup .login-container-outer[style*='display: block']"
      ],
      "ProductPlayer": [
        ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll"
      ],
      "Cybersquad": [
        ".login-content__login-panel",
      ],
      "Kefel3": [
        "#login-content_container",
      ],
      "kesem2": [
        "#login-content_container",
      ],
      "Nairobi": [
        "[data-acces_mng='widget']"
      ],
    }
  }

  var lastElement = document.querySelector('[data-requiremodule="accessMng"], .embedded_login_loder');
  var insertElemement = function (element) {
    if (lastElement) {
      lastElement.insertAdjacentElement('afterend', element);
    }
    else {
      document.head.appendChild(element);
    }
    lastElement = element;
  }

  var loadScript = function (url, onLoad) {
    var script = document.createElement('script');
    if (onLoad) {
      script.onload = onLoad;
    }
    script.src = url;
    insertElemement(script);
  };

  var loadCSS = function (url, onLoad) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    if (onLoad) {
      link.onload = onLoad;
    }
    link.href = url;
    insertElemement(link);
  };

  var getEnvironment = function () {
    var env = window.CetSSOEnvironment;
    if (!env) {
      var host = window.location.host;
      if (host.indexOf('.dev.') > -1) {
        env = 'dev';
      } else if (host.indexOf('.testing.') > -1) {
        env = 'testing';
      }
    } 
    return env;
  }
  var getProductHostName = function () {
    if (window.location.hostname.startsWith("nairobi") || window.location.hostname.startsWith("myofek")) {
      return "nairobi";
    }
    if (window.location.hostname.startsWith("kotar-cet-ac-il")) {
      return "kotar.cet.ac.il";
    }
    if (window.location.hostname.startsWith("school-kotar-cet-ac-il")) {
      return "school.kotar.cet.ac.il";
    }
    if (window.location.hostname.startsWith("ar-school-kotar-cet-ac-il")) {
      return "ar.school.kotar.cet.ac.il";
    }
    return window.location.hostname.replace(getEnvironment() + ".", "");
  }
  var currentSite = getProductHostName();

  //DOMSubtreeModified is not fired on popup window e.g. 
  //https://mytestbox.testing.cet.ac.il/ click on create exam
  //so we force generate event by changing element attribute change
  var forceDOMSubtreeModified = function () {
    currentInterval = [];
    if (config.sites[currentSite]) {
      var hideElementsKey = config.hideElements[config.sites[currentSite].hideElementsKey];
      if (hideElementsKey.length) {
        for (var i = 0; i < hideElementsKey.length; i++) {
          (function (i) {
            currentInterval[i] = setInterval(function () {
              if ($(hideElementsKey[i]).length > 0) {
                var newElement = $('<div>').attr('data-forceOnDOMContentLoaded', (new Date()).toLocaleTimeString());
                $(hideElementsKey[i]).append(newElement);
                setTimeout(function () {
                  newElement.remove();
                }, 300);
              } else {
                clearInterval(currentInterval[i]);
              }
            }, 300)
          })(i);
        }
      }
    }
  }

  var loadStyle = function () {
    if (config.sites[currentSite]) {
      var css = config.hideElements[config.sites[currentSite].hideElementsKey];
      if (css.length) {
        var completeCSS = [];
        for (var i = 0; i < css.length; i++) {
          //completeCSS = completeCSS + 'html[data-acces_mng] ';
          completeCSS.push(css[i]);
        }
        completeCSS = completeCSS.join(', ') + " { display: none!important; }";
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = completeCSS;
        } else {
          style.appendChild(document.createTextNode(completeCSS));
        }
        insertElemement(style);
      }
    }
  };

  var loadSources = function () {
    var cssFileKey = config.sites[currentSite] && 'cssFileKey' in config.sites[currentSite] ? config.sites[currentSite].cssFileKey : "ebag";

    if (cssFileKey) {
      loadCSS('//cdn.' + environment + 'cet.ac.il/ui-services/embeddedLogin/Style/embeddedLogin.' + cssFileKey + '.min.css?loder_id=' + window.embedded_login_loder_id);
    }
    loadScript('//apigateway.' + environment + 'cet.ac.il/accessmngapi/provider/accessmanagement.js?loder_id=' + window.embedded_login_loder_id);
    loadScript('//cdn.' + environment + 'cet.ac.il/ui-services/embeddedLogin/Scripts/embeddedLogin.js?loder_id=' + window.embedded_login_loder_id);

    forceDOMSubtreeModified();
  }


  var replaceBackgroundImage = function () {
    // Get the computed style of the background image
    var currentBackgroundImage = window.getComputedStyle(document.body).backgroundImage;

    // List of image names that, if found, will trigger the replacement
    var imageNames = [
      'shop-eiun-bg.png',
      'shop-bg.jpg'
    ];

    // New background image to use as replacement
    var newBackgroundImage = '//cdn.' + environment +'cet.ac.il/ui-services/embeddedlogin/style/images/popup_bg.jpg';


    // Check if the current background image includes any of the image names in the list
    var shouldReplace = imageNames.some(function (name) {
      // Use a regex to match the name within the URL structure
      var regex = new RegExp(name);
      return regex.test(currentBackgroundImage);
    });

    // If a match is found, replace the background image
    if (shouldReplace) {
      document.body.style.backgroundImage = 'url("' + newBackgroundImage + '")';
    }
  }

  // Add an event listener to ensure this runs once the document is fully loaded
  document.addEventListener('DOMContentLoaded', replaceBackgroundImage);

  var environment = (function () {
    var environment = '';
    if (document.location.href.includes('dev') || document.location.href.includes('localhost')) {
      environment = 'dev.';
    }
    else if (document.location.href.includes('testing')) {
      environment = 'testing.';
    }
    return environment;
  })();

  var getQuerystring = function (name, url) {
    if (!url) url = window.location.href;
    url = url.toString().toLowerCase();
    name = name.toLowerCase().replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  document.querySelector('html').setAttribute('data-acces_mng', location.host);
  var AM_CONFIG = getQuerystring("AM_CONFIG", location);
  if (AM_CONFIG != "false") {
    loadStyle();
  }

  /*[init loder_id]*/
  var isNumber = function (str) {
    var numberStr = str.replace(/\s/g, '');
    return !/\D/.test(numberStr);
  }
  if (window.embedded_login_loder_id) {
    loadSources();
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      window.embedded_login_loder_id = isNumber(xhr.responseText) ? xhr.responseText : String((new Date()).getTime());
      loadSources();
    });
    xhr.addEventListener('error', function () {
      window.embedded_login_loder_id = String((new Date()).getTime());
      loadSources();
    });
    xhr.open('GET', '//cdn.' + environment + 'cet.ac.il/versioning/version.txt');//?t=' + (new Date()).getTime()
    xhr.send();
  }
})();