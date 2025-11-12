(function () {

  var ssoCount = 0;
  window.addEventListener('load', initKotarCetSSO(ssoCount));

  function initKotarCetSSO(ssoCount) {
    if (!(window.cet && window.cet.accessmanagement) && ssoCount < 5) {
      setTimeout(function () {
        initKotarCetSSO(++ssoCount);
      }, 750);
    }
    if (window.cet && window.cet.accessmanagement) {
      ssoAMEvents();
      //loginCetNewUser();
      iframeAM();
      if (sessionStorage.openDrawer === "true") {
        openCurrentEmbeddedId();
      }
    }
  }

  function isEnableSSO() {
    var isDisableSyncAccessManagement = getDisableSyncAccessManagement();
    var enableSSO = true;
    if (isDisableSyncAccessManagement) {
      enableSSO = false;
    }
    return enableSSO;
  }
  function getDisableSyncAccessManagement() {
    var disableSyncAccessManagement = false;

    //Don't sync AM new user after welcome page or cart
    if (//location.pathname.toLowerCase().indexOf("/kotarapp/account/welcome.aspx") > -1
      //|| location.pathname.toLowerCase().indexOf("/kotarapp/account/create.aspx") > -1
      location.pathname.toLowerCase().indexOf("/KotarApp/BackOffice/Login.aspx") > -1
      || location.pathname.toLowerCase().indexOf("/kotarapp/shop/cart.aspx") > -1) {
      disableSyncAccessManagement = true;
    }
    return disableSyncAccessManagement;
  }

  function ssoAMEvents() {
    var enableSSO = isEnableSSO();
    if (enableSSO) {
      addEventListenerAM();
    } else {
      removeEventListenerAM();
    }
  }
  function addEventListenerAM() {
    document.addEventListener("cet.accessmanagement.login", _onLoggedinUserChanged);
    document.addEventListener("cet.accessmanagement.logout", _onLogout);
    document.addEventListener("cet.accessmanagement.sessionchange", _onLoggedinUserChanged);
    document.addEventListener("cet.accessmanagement.profilechange", _onLoggedinUserChanged);
  }
  function removeEventListenerAM() {
    document.removeEventListener("cet.accessmanagement.login", _onLoggedinUserChanged);
    document.removeEventListener("cet.accessmanagement.logout", _onLogout);
    document.removeEventListener("cet.accessmanagement.sessionchange", _onLoggedinUserChanged);
    document.removeEventListener("cet.accessmanagement.profilechange", _onLoggedinUserChanged);
  }


  function loginCetNewUser() {
    if (location.pathname.toLowerCase().indexOf("/kotarapp/account/welcome.aspx") > -1){
      window.cet.accessmanagement.getSessionAsync().then(function (loggedUser) {
        var kotarUserID = (typeof (BaseMaster_gUserID) != "undefined" ? BaseMaster_gUserID : '00000000-0000-0000-0000-000000000000');
        var AMUserID = (loggedUser ? loggedUser.userId : '00000000-0000-0000-0000-000000000000');
        if (AMUserID != kotarUserID && AMUserID == '00000000-0000-0000-0000-000000000000') {
          var returnUrl = document.location.href;
          var productSkin = "";
          var productLang = document.location.host.indexOf("ar.") === 0 ? "ar" : "he";
          setTimeout(function () {
            cet.accessmanagement.loginCet(returnUrl, productSkin, productLang);
          }, 5000);
        }
      });
    }
  }

  function _onLoggedinUserChanged() {
    window.location.href = "/default.aspx?logout=true";
  }

  function _onLogout() {
    cet.accessmanagement.logout(document.location.origin + "/default.aspx?logout=true");
  }

  //Manage AM for LO Activities inside IFrame
  function iframeAM() {
    if (window.addEventListener)
      window.addEventListener('message', receiveMessage, false);
    else
      window.attachEvent('onmessage', receiveMessage);
  }
  //Manage AM for LO Iframe
  function receiveMessage(e) {
    
    if (e.data && e.data.sender != "cet.lo.client" && window.location.pathname.indexOf("login.aspx?sReturnUrl=") > -1)
      return;

    var returnUrl = document.location.href;
    var productSkin = "";
    var productLang = document.location.host.indexOf("ar.") === 0 ? "ar" : "he";

    if (window.cet && window.cet.accessmanagement) {
      switch (e.data.action) {
        case 'onLoginRequest':

          //LO Activity that was open in book before login
          sessionStorage.setItem("openDrawer", true);

          switch (e.data.type) {
            case 'CET':
              cet.accessmanagement.loginCet(returnUrl, productSkin, productLang);
              break;
            case 'MOE':
              cet.accessmanagement.loginMoe(returnUrl, productSkin, productLang);
              break;
            default:
              return;
          }
          break;
        case 'onLogoutRequest':
          cet.accessmanagement.logout(document.location.origin + "/default.aspx?logout=true");
          break;
        default:
          return;
      }
    }   
  }

  function openCurrentEmbeddedId() {
    var embeddedOptions = sessionStorage.currentEmbeddedId;
    if (embeddedOptions && embeddedOptions.length > 0) {
      sessionStorage.setItem("currentEmbeddedId", "");
      sessionStorage.setItem("openDrawer", false);
      var options = JSON.parse(embeddedOptions);
      setTimeout(function () {
        MasterDrawer.Open({ url: options.EmbededURL, minwidth: 0, title: options.sTitle });
      }, 1000);
    }

  }
})();

