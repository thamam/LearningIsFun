(function () {

  var windowLocation = {
    getEnvironment : function () {
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
    },
    getProductHostName : function () {
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
      return window.location.hostname.replace(this.getEnvironment() + ".", "");
    },
    getQuerystring: function (name, url) {
      if (!url) url = window.location.href;
      url = url.toString().toLowerCase();
      name = name.toLowerCase().replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  };
  var keyboard = {
    handleKeyPress: function (event, button) {
      if (event.key === 'Enter' || event.key === ' ' || event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        button.click();  // Trigger the click event programmatically
      }
    }
  }

  var getEmbeddedEbagConfig = function (lang, enable, hasIDM, links) {
    var config = {
      "settings": {
        "skin": "",
        "lang": lang,
        "enable": enable,
        "version": "1.0.0.0",
        "hasIDM": hasIDM,
        "hideElements": {
          "widget": ".tile-content.tile-login[data-widget='login'] .login-widget-wrapper",
          "popup": ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll",
          "logout": "button#login-btn[data-context='Logout']:not(.cet_acces_mng-logout-btn)",
          "updatePassword": {
            selector: "#btn-update-password",
            modifiedFunction: function (item) {
              item.attr('onclick', 'cet.accessmanagement.changePassword(document.location.href,"' + lang + '");return false;');
              item.removeClass('update-password');
              return item;
            }
          },
          "updateMail": {
            selector: "#btn-update-email",
            modifiedFunction: function (item) {
              item.attr('onclick', 'cet.accessmanagement.updateProfile(document.location.href,"' + lang + '");return false;');
              item.removeClass('update-email');
              return item;
            }
          }
        }
      },
      "cet": {
        "title": "התחברות מטח",
        "titleA11y": "התחברות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>התחברות</span> <span>משרד החינוך</span>",
        "titleA11y": "התחברות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    if (links) {
      config.settings.links = links;
    }

    if (!hasIDM) {
      config.settings.hideElements.popup = {
        selector: config.settings.hideElements.popup,
        modifiedFunction: function (item) {
          cet.accessmanagement.loginCet(document.location, lang);
          item.hiden();
          return item;
        }
      }
      config.cet.icon_layout = "column";
    }

    if (lang == "ar") {
      config.cet.title = "تسجيل الدخول مطاح";
      config.moe.title = "<span>تسجيل الدخول</span> <span>وزارة التربية</span>";
      config.moe.titleA11y = "تسجيل الدخول وزارة التربية";
      config.close = "إغلاق";
    }
    else if (lang == "en" || lang == "vi" || lang == "zh") {
      config.cet.title = "<span>CET</span> <span style=\"font-weight: normal;\">Sign in</span>";
      config.moe.title = "<span>כניסה</span> <span>למשתמשים בישראל</span>";
      config.moe.titleA11y = "כניסה למשתמשים בישראל";
      config.close = "סגירה";

      config.cet.icon_layout = "column";
    }

    return config;
  };

  var getEmbeddedLoConfig = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "he",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "popup": {
            selector: ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll",
            modifiedFunction: function (item) {
              return item;
            }
          },
          "logout": {
            selector: ".lo-menu .lo-ulView .lo-dropdown .lo-dropdownOptionsHolder .lo-dropdownOption a.logout__link:not(.cet_acces_mng-logout-btn)",
            modifiedFunction: function (item) {
              item.attr('onclick', 'cet.accessmanagement.logout(document.location.href);return false;');
              item.removeClass('logout__link');
              item.css({
                position: 'relative'
              });
              return item;
            }
          }
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

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

    var productLang = getQuerystring("language", location);
    var lang = productLang ? productLang : "he";
    config.settings.lang = lang;

    if (lang == "ar") {
      config.cet.title = "تسجيل الدخول مطاح";
      config.moe.title = "<span>تسجيل الدخول</span> <span>وزارة التربية</span>";
      config.moe.titleA11y = "تسجيل الدخول وزارة التربية";
      config.close = "إغلاق";
    }
    else if (lang == "en" || lang == "vi" || lang == "zh") {
      config.cet.title = "<span>Sign in</span>";
      config.moe.title = "<span>כניסה</span> <span>למשתמשים בישראל</span>";
      config.moe.titleA11y = "כניסה למשתמשים בישראל";
      config.close = "סגירה";
    }

    var productSite = getQuerystring("sitekey", location);
    var site = productSite ? productSite : "";

    switch (site) {
      case 'testbox':
      case 'smarttest':
      case 'ar.smarttest':
      case 'mindcet':
      case 'links':
      case 'arlearners':
      case 'ar.mindsonstem':
      case 'mindsonstem':
      case 'horizon':
      case 'discovery':
      case 'vsionglobal':
      case 'nobel':
      case 'tal':
        config.settings.hideElements.popup.modifiedFunction = function (item) {
          cet.accessmanagement.loginCet(document.location, lang);
          item.hiden();
          item.attr('data-site', site);
          return item;
        };
        config.settings.hasIDM = false;
        config.cet.icon_layout = "column";
        break;
      case 'ivritil':
        config.settings.hideElements.popup.modifiedFunction = function (item) {
          item.attr('data-site', site);
          return item;
        };
        config.cet.icon_layout = "column";
        break;
    }

    return config;
  };

  var getEmbeddedMyBagConfig = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "he",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "popup": "#ctl00_MainBody_LoginControl1_upLoginDialog"
        },
        "popup": {
          "onClose": function (event) {
            window.location = "/";
          }
        },
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };

  var getEmbeddedKotarConfig = function (lang) {
    var config = {
      "settings": {
        "skin": "",
        "lang": lang,
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "widget": {
            selector: ".login .login-container",
            modifiedFunction: function (item) {
              var HEADERlabel = item.find('.cet_acces_mng-login-btn[data-login="HEADER"]');
              HEADERlabel.remove();
              return item;
            }
          },
          "popup": {
            selector: "form[action*='/login.aspx'] .cart_info, form[action*='/Create.aspx'] .cart_info.kotar_acces_mng-popup .login-container-outer[style*='display: block'], form[action*='/Purchase.aspx'] .cart_info.kotar_acces_mng-popup .login-container-outer[style*='display: block']",
            modifiedFunction: function (item) {

              var HEADERlabel = item.find('.cet_acces_mng-login-btn[data-login="HEADER"]');
              HEADERlabel.find('.cet_acces_mng-login-btn-title span').html(config.settings.popup.header.title);
              HEADERlabel.find('.cet_acces_mng-login-btn-sub_title span').html(config.settings.popup.header.subTitle);

              if ($("form[action*='/Purchase.aspx'] .cart_info.kotar_acces_mng-popup .login-container-outer[style*='display: block']").length > 0) {
                item.find('.cet_acces_mng-login-btn[data-login="CET"]').remove();
                item.find('.cet_acces_mng-login-links').remove();
                setTimeout(function () {
                  var newHeight = $('.cet_acces_mng-popup-inner_content').height() * 0.5;
                  $('.cet_acces_mng-popup-inner_content').height(newHeight);
                  $('.cet_acces_mng-login-btn[data-login=HEADER]').css({ 'bottom': '2em' });
                  $('.cet_acces_mng-login-btn[data-login=HEADER] .cet_acces_mng-login-btn-sub_title span').remove();
                  $('.cet_acces_mng-login-btn[data-login=IDM]').css({ 'top': '4em' });
                }, 300);
              }
              return item;
            }
          }, "logout": {
            selector: ".kotar_acces_mng-logout:not(.cet_acces_mng-logout-btn)",
            modifiedFunction: function (item) {
              if (item.is('[id="login"]')) {
                item.attr('id', 'logout');
              }
              item.attr('onclick', 'cet.accessmanagement.logout(document.location.origin + "/default.aspx?logout=true");return false;');
              return item;
            }
          }
        },
        "popup": {
          "onClose": function (event) {
            globalGoBackFromStore(event);
          },
          "header": {
            "title": "<span>ברוכים הבאים</span>",
            "subTitle": "<span>איך תרצו להתחבר?</span>"
          }
        },
        "returnUrlFunction": function () {
          var returnUrl = window.location.href;
          if (window.getGlobalGoBackUrl) {
            returnUrl = window.getGlobalGoBackUrl();
          }
          return returnUrl;
        },
        "links": [
          {
            "title": "הרשמה",
            "titleA11y": "הרשמה",
            "onclick": function () {
              var returnUrl = encodeURIComponent(window.location.href);
              if (window.getGlobalGoBackUrl) {
                returnUrl = window.getGlobalGoBackUrl();
              }
              window.location = "/KotarApp/Account/Create.aspx?sReturnUrl=" + returnUrl;
            },
            //"href": "/KotarApp/Account/Create.aspx?sReturnUrl=" + getGlobalGoBackUrl()
          }
        ]
      },
      "cet": {
        "title": "התחברות מטח",
        "titleA11y": "התחברות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>התחברות</span> <span>משרד החינוך</span>",
        "titleA11y": "התחברות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };


    //kotar site
    var kotarSite = window.location.hostname.split(".")[0];
    if (kotarSite === "kotar") {
      config.cet.title = "התחברות מטח";
      config.settings.links[0].title = "<div>הרשמה</div>";
    }

    if (lang == "ar") {
      config.cet.title = "تسجيل الدخول مطاح";
      config.moe.title = "<span>تسجيل الدخول</span> <span>وزارة التربية</span>";
      config.moe.titleA11y = "تسجيل الدخول وزارة التربية";
      config.close = "إغلاق";
      config.settings.popup.header.title = "<span>مرحبا بك</span>";
      config.settings.popup.header.subTitle = "<span>كيف تريد الشبك?</span>";
      config.settings.links[0].title = "تسجيل";
    }
    return config;
  };

  var getEmbeddedProductPlayerConfig = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "he",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "popup": {
            selector: ".cus-login-modal.cus-login-modal--authentication .cuc-dialog__inner-content.cus-login-modal-scroll",
            modifiedFunction: function (item) {
              var _lang = $('#login-root .cus-login-main-container').data('language');
              if (_lang === "ar") {
                item.find('.cet_acces_mng-login-btn[data-login="IDM"] .cet_acces_mng-login-btn-title').html('<span><span>تسجيل الدخول</span> <span>وزارة التربية</span></span>');
                item.find('.cet_acces_mng-login-btn[data-login="CET"] .cet_acces_mng-login-btn-title').html('<span>تسجيل الدخول مطاح</span>');
                config.settings.skin = "ar";
              }
              else if (_lang === "en") {
                item.find('.cet_acces_mng-login-btn[data-login="IDM"] .cet_acces_mng-login-btn-title').html('<span><span>כניסה</span> <span>למשתמשים בישראל</span></span>');
                item.find('.cet_acces_mng-login-btn[data-login="CET"] .cet_acces_mng-login-btn-title').html('<span>Sign in</span>');
                item.find('.cet_acces_mng-login-btn[data-login="CET"]').attr("data-icon_layout", "column");
                item.attr("data-site", "enSkin");
                config.settings.skin = "en";
              }
              return item;
            }
          }
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };
    return config;
  };

  var getEmbeddedCybersquadHeConfig = function () {
    var config = {
      "settings": {
        "skin": "cybersquad",
        "lang": "he",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "widget": ".login-content__login-panel"
        },
        "returnUrlFunction": function () {
          return document.location;
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };

  var getEmbeddedCybersquadConfig = function () {
    var config = {
      "settings": {
        "skin": "cybersquad",
        "lang": "en",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": false,
        "hideElements": {
          "widget": {
            selector: ".login-content__login-panel",
            modifiedFunction: function (item) {
              cet.accessmanagement.loginCet(document.location, config.settings.skin, config.settings.lang);
              return item;
            }
          }
        }
      },
      "cet": {
        "title": "",
        "titleA11y": "",
        "subTitle": ""
      },
      "moe": {
        "title": "",
        "titleA11y": "",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };

  var getEmbeddedKefel3Config = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "logout": "#settings #logout",
          "widget": "#login_content_container"
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };

  var getEmbeddedKesem2Config = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "logout": "#settings #logout",
          "widget": "#login_content_container"
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };

  var getEmbeddedNairobiConfig = function () {
    var config = {
      "settings": {
        "skin": "",
        "lang": "",
        "enable": true,
        "version": "1.0.0.0",
        "hasIDM": true,
        "hideElements": {
          "widget": "[data-acces_mng='widget']",
          "widget": {
            selector: "[data-acces_mng='widget']",
            modifiedFunction: function (item) {
              if ($('[data-acces_mng_lang="ar"]').length > 0) {
                item.find('.cet_acces_mng-login-btn[data-login="IDM"] .cet_acces_mng-login-btn-title').html('<span><span>تسجيل الدخول</span> <span>وزارة التربية</span></span>');
                item.find('.cet_acces_mng-login-btn[data-login="CET"] .cet_acces_mng-login-btn-title').html('<span>تسجيل الدخول مطاح</span>');
              }
              else if ($('[data-acces_mng_lang="en"]').length > 0) {
                item.find('.cet_acces_mng-login-btn[data-login="IDM"] .cet_acces_mng-login-btn-title').html('<span><span>כניסה</span> <span>למשתמשים בישראל</span></span>');
                item.find('.cet_acces_mng-login-btn[data-login="CET"] .cet_acces_mng-login-btn-title').html('<span>Sign in</span>');
              }
              return item;
            }
          },
          "logout": "[data-acces_mng='logout']",
          "updatePassword": {
            selector: "[data-acces_mng='updatePassword']",
            modifiedFunction: function (item) {
              item.attr('onclick', 'cet.accessmanagement.changePassword(document.location.href,"' + document.location.pathname.split('/')[1] + '");return false;');
              return item;
            }
          }

        },
        "returnUrlFunction": function () {
          return document.location;
        }
      },
      "cet": {
        "title": "הזדהות מטח",
        "titleA11y": "הזדהות מטח",
        "subTitle": ""
      },
      "moe": {
        "title": "<span>הזדהות</span> <span>משרד החינוך</span>",
        "titleA11y": "הזדהות משרד החינוך",
        "subTitle": ""
      },
      "close": {
        "title": "סגירה"
      }
    };

    return config;
  };
  
  var embeddedConfig = {
    "version": "1.0.0.0",
    "enable": false,
    "embeddedLoginHTML": "<div class='cet_acces_mng-login' data-hasIDM='0' data-has_links='0'>\
                            <div class='cet_acces_mng-login-wrapper'>\
                                <div class='cet_acces_mng-design_item' data-item='1'></div>\
                                <div class='cet_acces_mng-design_item' data-item='2'></div>\
                                <div class='cet_acces_mng-login-btn' data-login='HEADER'>\
                                    <div class='cet_acces_mng-design_item' data-item='3'></div>\
                                    <div class='cet_acces_mng-design_item' data-item='4'></div>\
                                    <div class='cet_acces_mng-login-btn-content'>\
                                        <div class='cet_acces_mng-login-btn-title'><span></span></div>\
                                        <div class='cet_acces_mng-login-btn-sub_title'><span></span></div>\
                                    </div>\
                                </div>\
                                <div class='cet_acces_mng-login-btn' data-login='IDM'>\
                                    <div class='cet_acces_mng-design_item' data-item='5'></div>\
                                    <div class='cet_acces_mng-design_item' data-item='6'></div>\
                                    <div class='cet_acces_mng-login-btn-content'>\
                                        <div class='cet_acces_mng-login-btn-title'><span></span></div>\
                                        <div class='cet_acces_mng-login-btn-sub_title'><span></span></div>\
                                    </div>\
                                </div>\
                                <div class='cet_acces_mng-login-btn' data-login='CET'>\
                                    <div class='cet_acces_mng-design_item' data-item='7'></div>\
                                    <div class='cet_acces_mng-design_item' data-item='8'></div>\
                                    <div class='cet_acces_mng-login-btn-content'>\
                                        <div class='cet_acces_mng-login-btn-title'><span></span></div>\
                                        <div class='cet_acces_mng-login-btn-sub_title'><span></span></div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>",
    "embeddedPopupHTML": "<div class='cet_acces_mng-popup'>\
                                <div class='cet_acces_mng-popup__background'></div>\
                                <div class='cet_acces_mng-popup__content'>\
                                    <div class='cet_acces_mng-popup-inner_content'></div>\
                                    <div id='btnClose' class='cet_acces_mng-popup__close-btn' tabindex='0' role='button' aria-label='סגירה'></div>\
                                </div>\
                            </div>'",
    "ebag.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "ar.ebag.cet.ac.il": getEmbeddedEbagConfig("ar", true, true),
    "ebaghigh.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "ofek4class.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "mytestbox.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "testbox.cet.ac.il": getEmbeddedEbagConfig("he", true, false, [{ title: 'לא רשום?', href: '/צור-קשר/שירות-לקוחות/', 'class': 'ebag-link' }]),
    "ebagcourses.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "ar.ebagcourses.cet.ac.il": getEmbeddedEbagConfig("ar", true, true),
    "smarttest.cet.ac.il": getEmbeddedEbagConfig("he", true, false, [{ title: 'לא רשום?', href: '/צור-קשר/שירות-לקוחות/', 'class': 'ebag-link' }]),
    "ar.smarttest.cet.ac.il": getEmbeddedEbagConfig("ar", true, false, [{ title: 'غير مسجّل؟ سارع إلى التسجيل!', href: '/اتّصل-بنا/خدمة-الزبائن/', 'class': 'ebag-link' }]),
    "mindcet.cet.ac.il": getEmbeddedEbagConfig("he", true, false),
    "links.cet.ac.il": getEmbeddedEbagConfig("he", true, false, [{ title: 'לא רשום?', href: '/צור-קשר/שירות-לקוחות/', 'class': 'ebag-link' }]),
    "myebag.cet.ac.il": getEmbeddedEbagConfig("he", true, true),
    "arlearners.cet.ac.il": getEmbeddedEbagConfig("ar", true, false),
    "ar.mindsonstem.cet.ac.il": getEmbeddedEbagConfig("ar", true, false, [{ title: 'غير مسجّل؟ سارع إلى التسجيل!', href: '/اتّصل-بنا/خدمة-الزبائن/', 'class': 'ebag-link' }]),
    "mindsonstem.cet.ac.il": getEmbeddedEbagConfig("en", true, false, [{ title: 'Not subscribed yet? Join Us!', href: '/Contact-us/Customers-support/', 'class': 'ebag-link' }]),
    "horizon.cet.ac.il": getEmbeddedEbagConfig("en", true, false, [{ title: 'Not subscribed yet? Join Us!', href: '/Contact-us/Customers-support/', 'class': 'ebag-link' }]),
    "ivritil.cet.ac.il": getEmbeddedEbagConfig("en", true, true),
    "discovery.cet.ac.il": getEmbeddedEbagConfig("en", true, false, [{ title: 'Not subscribed yet? Join Us!', href: '/Contact-us/Customers-support/', 'class': 'ebag-link' }]),
    "vsionglobal.cet.ac.il": getEmbeddedEbagConfig("vi", true, false, [{ title: 'Hãy gia nhập với chúng tôi!', href: '/Liên-hệ/Chăm-sóc-khách-hàng/', 'class': 'ebag-link' }]),
    "nobel.cet.ac.il": getEmbeddedEbagConfig("zh", true, false, [{ title: '尚未订阅？加入我们！', href: '/联系我们/客户服务/', 'class': 'ebag-link' }]),
    "tal.cet.ac.il": getEmbeddedEbagConfig("zh", true, false, [{ title: '尚未订阅？加入我们！', href: '/联系我们/客户服务/', 'class': 'ebag-link' }]),
    "lo.cet.ac.il": getEmbeddedLoConfig(),
    "mybag.ebag.cet.ac.il": getEmbeddedMyBagConfig("he", true, true),
    "mybag.mytestbox.cet.ac.il": getEmbeddedMyBagConfig("he", true, true),
    "school.kotar.cet.ac.il": getEmbeddedKotarConfig("he"),
    "ar.school.kotar.cet.ac.il": getEmbeddedKotarConfig("ar"),
    "kotar.cet.ac.il": getEmbeddedKotarConfig("he"),
    "productplayer.cet.ac.il": getEmbeddedProductPlayerConfig(),
    "cybersquad-he.cet.ac.il": getEmbeddedCybersquadHeConfig(),
    "cybersquad.cet.ac.il": getEmbeddedCybersquadConfig(),
    "kefel3.cet.ac.il": getEmbeddedKefel3Config(),
    "kesem2.cet.ac.il": getEmbeddedKesem2Config(),
    "nairobi": getEmbeddedNairobiConfig()
  };

  const embeddedLogin = {
    injectHeadClass: function (val) {
      document.querySelector('html').setAttribute('data-acces_mng', val);
    },
    isAttributeExist: function (hideElement, attrName) {
      if (hideElement[0].hasAttributes()) {
        var isAttribute = false;
        var attrs = hideElement[0].attributes;
        var output = "";
        for (var i = 0; i < attrs.length; i++) {
          if (attrs[i].name === attrName) {
            isAttribute = true;
          }
        }
        return isAttribute;
      }
    },
    addClass: function (el, classNameToAdd) {
      el.className += ' ' + classNameToAdd;
    },
    replaceLogin: function () {
      var that = this;
      var inReplaceLogin = false;
      var productHostName = this.getProductHostName();
      var onDOMContentLoaded = function (event) {

        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
              mutation.addedNodes.forEach(function (node) {
                if (inReplaceLogin) {
                  return;
                }
                inReplaceLogin = true;
                var hideElements = embeddedConfig[productHostName].settings.hideElements;
                for (var element in hideElements) {
                  var selector = hideElements[element].selector || hideElements[element];
                  var modifiedFunction = hideElements[element].modifiedFunction || function (item) { return item; };
                  var hideElement = document.querySelectorAll(selector);
                  if (hideElement.length > 0) {
                    for (var i = 0; i < hideElement.length; i++) {
                      var embeddedHTML = that.embeddedHTML(element, hideElement[i]);
                      if (embeddedHTML) {
                        embeddedHTML = modifiedFunction(embeddedHTML);
                        that.hideTextEmbeddedHTML(embeddedHTML);
                        if (!$(hideElement[i]).data('once')) {
                          $(hideElement[i]).data('once', true);
                          $(hideElement[i]).after(embeddedHTML);
                          $(hideElement[i]).remove();
                          that.showEmbeddedHTMLText($('.showEmbeddedHTMLText'));
                        }
                      }
                    }
                  }
                }
                var closeButton = document.getElementById('btnClose');
                // First, check if closeButton is not null or undefined
                if (closeButton) {
                  // Check if embeddedConfig, productHostName, close, and title are defined and not null
                  if (embeddedConfig &&
                    embeddedConfig[productHostName] &&
                    embeddedConfig[productHostName].close &&
                    embeddedConfig[productHostName].close !== null &&
                    embeddedConfig[productHostName].close.title) {

                    closeButton.setAttribute('aria-label', embeddedConfig[productHostName].close.title);
                  }
                }
                inReplaceLogin = false;
              });
            }
          });
        });

        observer.observe(document.body, { childList: true, subtree: true });

      };
      if (document.readyState && (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive")) {
        onDOMContentLoaded();
      }
      else {
        window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
      }
    },
    embeddedHTML: function (elementType, oldDom) {
      var productHostName = this.getProductHostName();

      if (elementType === "logout") {
        var hideElement = oldDom;
        var embeddedHTML = hideElement ? $(hideElement.outerHTML.replace("<button", "<span").replace("</button>", "</span>")) : false;
        if (embeddedHTML) {
          if (embeddedHTML.is('a')) {
            embeddedHTML.attr('href', '#');
          }
          embeddedHTML.attr('onclick', 'cet.accessmanagement.logout(document.location.origin);return false;');
          embeddedHTML.addClass('cet_acces_mng-logout-btn');
        }
        return embeddedHTML;
      } else if (elementType === "updatePassword") {
        var hideElement = oldDom;
        var embeddedHTML = hideElement ? $(hideElement.outerHTML) : false;
        if (embeddedHTML) {
          if (embeddedHTML.is('a')) {
            embeddedHTML.attr('href', '#');
          }
          embeddedHTML.attr('onclick', 'cet.accessmanagement.changePassword(document.location.href);return false;');
          embeddedHTML.addClass('cet_acces_mng-update-password-btn');
        }
        return embeddedHTML;
      } else if (elementType === "updateMail") {
        var hideElement = oldDom;
        var embeddedHTML = hideElement ? $(hideElement.outerHTML) : false;
        if (embeddedHTML) {
          if (embeddedHTML.is('a')) {
            embeddedHTML.attr('href', '#');
          }
          embeddedHTML.attr('onclick', 'cet.accessmanagement.updateProfile(document.location.href);return false;');
          embeddedHTML.addClass('cet_acces_mng-update-mail-btn');
        }
        return embeddedHTML;
      } else {
        var embeddedHTML = $(embeddedConfig[productHostName].settings.embeddedLoginHTML || embeddedConfig.embeddedLoginHTML);

        var MOEButton = embeddedHTML.find('.cet_acces_mng-login-btn[data-login="IDM"]');
        MOEButton.attr('tabindex', '0');
        MOEButton.attr('aria-label', embeddedConfig[productHostName].moe.titleA11y);
        MOEButton.attr('role', 'button');
        MOEButton.on('click', function () {
          var returnUrl = embeddedConfig[productHostName].settings.returnUrl || (embeddedConfig[productHostName].settings.returnUrlFunction && embeddedConfig[productHostName].settings.returnUrlFunction()) || document.location.href;
          cet.accessmanagement.loginMoe(returnUrl);
        });
        // Add keydown event listener for 'Enter' and 'Spacebar'
        MOEButton.on('keydown', function (event) {
          keyboard.handleKeyPress(event, MOEButton);
        });
        MOEButton.find('.cet_acces_mng-login-btn-title span').html(embeddedConfig[productHostName].moe.title);
        MOEButton.find('.cet_acces_mng-login-btn-sub_title span').html(embeddedConfig[productHostName].moe.subTitle);
        if (embeddedConfig[productHostName].moe.icon_layout) {
          MOEButton.attr('data-icon_layout', embeddedConfig[productHostName].moe.icon_layout);
        }

        var CETButton = embeddedHTML.find('.cet_acces_mng-login-btn[data-login="CET"]');
        CETButton.attr('tabindex', '0');
        CETButton.attr('aria-label', embeddedConfig[productHostName].cet.titleA11y);
        CETButton.attr('role', 'button');
        CETButton.on('click', function () {
          var returnUrl = embeddedConfig[productHostName].settings.returnUrl || (embeddedConfig[productHostName].settings.returnUrlFunction && embeddedConfig[productHostName].settings.returnUrlFunction()) || document.location.href;
          var productSkin = embeddedConfig[productHostName].settings.skin;
          var productLang = embeddedConfig[productHostName].settings.lang;
          cet.accessmanagement.loginCet(returnUrl, productSkin, productLang);
        });
        // Add keydown event listener for 'Enter' and 'Spacebar'
        CETButton.on('keydown', function (event) {
          keyboard.handleKeyPress(event, CETButton);
        });
        CETButton.find('.cet_acces_mng-login-btn-title span').html(embeddedConfig[productHostName].cet.title);
        CETButton.find('.cet_acces_mng-login-btn-sub_title span').html(embeddedConfig[productHostName].cet.subTitle);
        if (embeddedConfig[productHostName].cet.icon_layout) {
          CETButton.attr('data-icon_layout', embeddedConfig[productHostName].cet.icon_layout);
        }

        if (embeddedConfig[productHostName].settings.links) {
          embeddedHTML.attr('data-has_links', '1');
          var links = $('<div class="cet_acces_mng-login-links"></div>');
          embeddedHTML.find('.cet_acces_mng-login-wrapper').after(links);
          for (var i = 0; i < embeddedConfig[productHostName].settings.links.length; i++) {
            var link = embeddedConfig[productHostName].settings.links[i];
            if (link.href) {
              links.append('<a class="cet_acces_mng-login-link' + (link.class ? ' ' + link.class : '') + '" href="' + link.href + '">' + link.title + '</a>');
            }
            else if (link.onclick) {
              var link_dom = $('<span class="cet_acces_mng-login-link' + (link.class ? ' ' + link.class : '') + '" tabindex="0" aria-label="' + link.titleA11y +'" role="button">' + link.title + '</span>');
              link_dom.click(link.onclick);
              links.append(link_dom);
            }
          }
        }

        if (embeddedConfig[productHostName].settings.hasIDM) {
          embeddedHTML.attr('data-hasIDM', '1');
        }

        if (elementType === "popup" && embeddedConfig[productHostName].settings.popup) {
          var popup = $(embeddedConfig[productHostName].settings.embeddedPopupHTML || embeddedConfig.embeddedPopupHTML);
          popup.find('.cet_acces_mng-popup-inner_content').html(embeddedHTML);
          popup.on('click', '.cet_acces_mng-popup__close-btn', function (event) {
            if (embeddedConfig[productHostName].settings.popup.onClose) {
              embeddedConfig[productHostName].settings.popup.onClose(event);
            }
          });
          embeddedHTML = popup;
        }

        return embeddedHTML;
      }
    },
    getEnvironment: function () {
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
    },
    getProductHostName: function () {
      if (window.location.hostname.startsWith("nairobi") || window.location.hostname.startsWith("myofek")) {
        return "nairobi";
      }
      return window.location.hostname.replace(this.getEnvironment() + ".", "");
    },
    getQuerystring: function (name, url) {
      if (!url) url = window.location.href;
      url = url.toString().toLowerCase();
      name = name.toLowerCase().replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    hideTextEmbeddedHTML: function (embeddedHTML) {
      var embeddedHtmlSpans = $(embeddedHTML).find('span');
      for (var i = 0; i < embeddedHtmlSpans.length; i++) {
        $(embeddedHtmlSpans[i]).css("visibility", "hidden");
        $(embeddedHtmlSpans[i]).addClass("showEmbeddedHTMLText");
      }

    },
    //show text only after embeddedLogin css loaded otherwise will see flickering text
    showEmbeddedHTMLText: function ($embeddedHTMLText) {
      if ($('.cet_acces_mng-login-btn[data-login="IDM"]').length || $('.cet_acces_mng-login-btn[data-login="CET"]').length) {
        setTimeout(function () {
          var counter = 0;
          var backgroundImageIDM = document.querySelector('.cet_acces_mng-login-btn[data-login="IDM"]') ? getComputedStyle(document.querySelector('.cet_acces_mng-login-btn[data-login="IDM"]'), ':before').backgroundImage : "none";
          if (backgroundImageIDM != "none") {
            counter++;
          }
          var backgroundImageCET = document.querySelector('.cet_acces_mng-login-btn[data-login="CET"]') ? getComputedStyle(document.querySelector('.cet_acces_mng-login-btn[data-login="CET"]'), ':before').backgroundImage : "none";
          if (backgroundImageCET != "none") {
            counter++;
          }
          if (counter > 0) {
            for (var i = 0; i < $embeddedHTMLText.length; i++) {
              $($embeddedHTMLText[i]).css("visibility", "visible");
            }
          } else {
            embeddedLogin.showEmbeddedHTMLText($embeddedHTMLText);
          }
        }, 300);
      } else {
        for (var i = 0; i < $embeddedHTMLText.length; i++) {
          $($embeddedHTMLText[i]).css("visibility", "visible");
        }
      }
    },
    init: function () {
      var AM_CONFIG = this.getQuerystring("AM_CONFIG", location);
      var productHostName = this.getProductHostName();
      if (AM_CONFIG != "false") {
        this.injectHeadClass(location.host);
        this.replaceLogin();
      }
      else {
        this.injectHeadClass('');
      }
    }
  }

  embeddedLogin.init();
})();