var SiteSubscriptionEnum = { None: 0, Standart: 1, Monthly: 2 };

//SiteBook functions
function AddSiteBookToCart(sender, nBookID) {
  if ($(sender).attr("class") == "addToCartCheck") {
    //PageMethods.AddSiteBookToCart(nBookID, AddSiteBookToCart_OnSuccess, AddSiteBookToCart_OnFailure);
    $("#hdnSiteBook").val(nBookID);
    $("#addBookToCart").removeClass("addToCartCheck").addClass("addToCartCheck_on");
  }
  else if ($(sender).attr("class") == "addToCartCheck_on") {
    //PageMethods.RemoveSiteBookFromCart(nBookID, RemoveSiteBookFromCart_OnSuccess, RemoveSiteBookFromCart_OnFailure);
    $("#hdnSiteBook").val(0);
    $("#addBookToCart").removeClass("addToCartCheck_on").addClass("addToCartCheck");
  }
}

function AddSiteBookToCart_OnSuccess() {
  $("#addBookToCart").removeClass("addToCartCheck").addClass("addToCartCheck_on");
}

function AddSiteBookToCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorAddingProductToCart);
}

function RemoveSiteBookFromCart_OnSuccess(nItemsInCart) {
  $("#addBookToCart").removeClass("addToCartCheck_on").addClass("addToCartCheck");
}

function RemoveSiteBookFromCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorAddingProductToCart);
}

//Site functions
function AddSiteToCart_OnSuccess() {

}

function AddSiteToCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorAddingProductToCart);
}

function AddSiteToCart(sender, bMonthly) {

  if ($(sender).attr("class") == "addToCartRadio") {

    if (bMonthly) {
      if ($("#standartSubscription").attr("class") == "addToCartRadio_on") {
        $("#standartSubscription").removeClass("addToCartRadio_on").addClass("addToCartRadio");
      }

      $("#monthlySubscription").removeClass("addToCartRadio").addClass("addToCartRadio_on");
    }

    else {
      if ($("#monthlySubscription").attr("class") == "addToCartRadio_on") {
        $("#monthlySubscription").removeClass("addToCartRadio_on").addClass("addToCartRadio");
      }

      $("#standartSubscription").removeClass("addToCartRadio").addClass("addToCartRadio_on");

    }

    if (bMonthly)
      $("#hdnSiteSubscription").val(SiteSubscriptionEnum.Monthly);
    else
      $("#hdnSiteSubscription").val(SiteSubscriptionEnum.Standart);

    //PageMethods.AddSiteToCart(bMonthly, AddSiteToCart_OnSuccess, AddSiteToCart_OnFailure);
  }

}

function RemoveSiteFromCart_OnSuccess() {
}

function RemoveSiteFromCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorRemovingProductFromCart);
}

// AppBook functions
function AddAppBookToCart_OnSuccess(nItemsInCart) {
  $("#addAppBookToCart").removeClass("addToCartCheck").addClass("addToCartCheck_on");
}

function AddAppBookToCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorAddingProductToCart);
}

function RemoveAppBookFromCart_OnSuccess(nItemsInCart) {
  $("#addAppBookToCart").removeClass("addToCartCheck_on").addClass("addToCartCheck");
}

function RemoveAppBookFromCart_OnFailure() {
  Utils_ShowErrorMessageDialog(TXT_ErrorRemovingProductFromCart);
}

function AddAppBookToCart(sender, nBookID) {
  if ($(sender).attr("class") == "addToCartCheck") {
    //PageMethods.AddAppBookToCart(nBookID, AddAppBookToCart_OnSuccess, AddAppBookToCart_OnFailure);
    $("#hdnAppBook").val(nBookID);
    $("#addAppBookToCart").removeClass("addToCartCheck").addClass("addToCartCheck_on");
  }
  else if ($(sender).attr("class") == "addToCartCheck_on") {
    //PageMethods.RemoveAppBookFromCart(nBookID, RemoveAppBookFromCart_OnSuccess, RemoveAppBookFromCart_OnFailure);
    $("#hdnAppBook").val(0);
    $("#addAppBookToCart").removeClass("addToCartCheck_on").addClass("addToCartCheck");
  }
}

function ChooseSiteSubscription(sender) {
  if (sender.getAttribute('id') === 'standartSubscription') {
    $("#hdnSiteSubscription").val(SiteSubscriptionEnum.Standart);
  } else if (sender.getAttribute('id') === 'monthlySubscription') {
    $("#hdnSiteSubscription").val(SiteSubscriptionEnum.Monthly);
  } else {
    $("#hdnSiteSubscription").val(SiteSubscriptionEnum.None);
  }
  //if ($(sender).attr("class") == "addToCartCheck") {
  //  $("#standartSubscription").removeClass("addToCartRadio_disable").addClass("addToCartRadio");
  //  $("#monthlySubscription").removeClass("addToCartRadio_disable").addClass("addToCartRadio");
  //  $(sender).removeClass("addToCartCheck").addClass("addToCartCheck_on");
  //}
  //else if ($(sender).attr("class") == "addToCartCheck_on") {
  //  $("#standartSubscription").removeClass("addToCartRadio").removeClass("addToCartRadio_on").addClass("addToCartRadio_disable");
  //  $("#monthlySubscription").removeClass("addToCartRadio").removeClass("addToCartRadio_on").addClass("addToCartRadio_disable");
  //  $(sender).removeClass("addToCartCheck_on").addClass("addToCartCheck");
  //  //PageMethods.RemoveSiteFromCart(RemoveSiteFromCart_OnSuccess, RemoveSiteFromCart_OnFailure);
  //  $("#hdnSiteSubscription").val(SiteSubscriptionEnum.None);
  //}
}

function PopUpCart(NumItemsInCart, nBookID, site) {
  var popupBlockerId = 'cart-popup-blocker',
    cartContainerId = 'cart-container',
    popupBlocker = document.getElementById(popupBlockerId),
    cartContainer = document.getElementById(cartContainerId),
    html = [], div;

  var frmSrc;
  if (NumItemsInCart > 0) {
    frmSrc = '/KotarApp/Shop/Cart.aspx?inframe=true'
  } else {
    frmSrc = '/KotarApp/Shop/AddToCart.aspx?inframe=true'

    if (nBookID) {
      frmSrc += '&nBookID=' + nBookID
    } else {
      if (!site) {
        frmSrc += '&site=default'
      } else {
        frmSrc += '&site=' + site
      }
    }
  }
  div = document.createElement('div');

  if (!popupBlocker || !cartContainer) {
    html.push("<div id='cart-popup-blocker' style='position:fixed; top: 0; right:0; bottom:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.6);z-index:99; '>");    
    if (window.innerWidth > 1000) {
      html.push("<img style='position: absolute;z-index: 999;top: 8vh;left: 32vw;width: 50px;cursor:pointer' src='/kotarapp/resources/images/x_yellow.svg' onclick='closePopUpCart()' />")
      html.push("<iframe id='cart-container' src='");
      html.push(frmSrc)
      html.push("' style='border:none; background-image:url(/kotarapp/resources/images/ajax-loader.gif); background-repeat:no-repeat; background-position: center 20px; width: 32vw;height: 80vh;position: absolute;left: 36vw;top: 10vh;'></iframe>")
    } else if (window.innerWidth > 500) {
      html.push("<img style='position: absolute;z-index: 999;top: 8vh;left: 12vw;width: 50px;cursor:pointer' src='/kotarapp/resources/images/x_yellow.svg' onclick='closePopUpCart()' />")
      html.push("<iframe id='cart-container' src='");
      html.push(frmSrc)
      html.push("' style='border:none;width: 60vw;height: 80vh;position: absolute;left: 20vw;top: 10vh;'></iframe>")
    } else {
      html.push("<img style='position: absolute;z-index: 999;top: 0vh;left: 0vw;width: 50px;cursor:pointer' src='/kotarapp/resources/images/x_yellow.svg' onclick='closePopUpCart()' />")
      html.push("<iframe id='cart-container' src='");
      html.push(frmSrc)
      html.push("' style='border:none;width: 100vw;height: 80vh;position: absolute;left: 0vw;top: 10vh;'></iframe>")
    }
    html.push("</div>")
    div.innerHTML = html.join('')
    document.getElementsByTagName('body')[0].appendChild(div)
  } else {
    popupBlocker.style.display = 'block'
  }
}

function closePopUpCart() {
  location.reload();

  //$('#cart-popup-blocker').hide(20, function () {
  //  $(this).remove()
  //})

  //$('#cart-container').hide(20, function () {
  //  $(this).remove()
  //})

  //$('.cart.group1.toolbaricon').removeClass('on')
}

window.addEventListener('message', function (message) {
  var data = message.data;
  if (data) {
    switch (data.action) {
      case 'close_cart_popup':
        closePopUpCart();
       
        if (data.refresh) {
          //if (BV_bSomePagesAreClosed) {
          //  ReloadBookPagesInfo();
          //}

          try {
            history.go(0);
          } catch (e) {
            location.reload()
          }
        }
        break;
      default:
        break;
    }
  }
})