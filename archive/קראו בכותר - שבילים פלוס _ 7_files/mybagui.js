(function (mybagui, $, undefined) {

  mybagui.dropdown = function (options) {
    var dropdownHTML = (function (options) {
      var dropdown, toggle, caret, ul, li, a,
        container_id, selected_item, menu_name,
        i, itemsLength, item,
        attrKeys, j, attrLength, attrName;

      itemsLength = options.items.length;
      container_id = options.container_id || '';

      if (typeof options.selected_item === 'number') {
        selected_item = options.selected_item;
      } else {
        selected_item = itemsLength - 1;
      }

      selected_item = options.items[selected_item];
      menu_name = options.menu_name || 'menu';

      dropdown = document.createElement('span');
      dropdown.className = 'dropdown';
      dropdown.id = container_id;

      toggle = document.createElement('button');
      toggle.className = 'dropdown-toggle';
      toggle.id = 'dropdown-' + menu_name;
      toggle.setAttribute('type', 'button');
      toggle.setAttribute('data-toggle', 'dropdown');

      //todo: remove try
      //bug: when opening the itemstore on the first time (with user with no school, no mater type) after login the text property is undefined
      try {
        toggle.textContent = selected_item.text;
      }
      catch (exception) { $o.log(exception); }

      caret = document.createElement('span');
      caret.className = 'icon-caret';

      ul = document.createElement('ul');
      ul.className = 'dropdown-menu';
      ul.setAttribute('role', 'menu');
      ul.setAttribute('aria-labelledby', 'dropdown-' + menu_name);

      // dropdown items
      for (i = 0; i < itemsLength; i++) {
        item = options.items[i];

        if (item === undefined) { continue; }

        li = document.createElement('li');
        li.setAttribute('role', 'presentation');

        if (i === options.selected_item) {
          li.classList.add('selected');
        }

        a = document.createElement('a');
        a.setAttribute('role', 'menuitem');
        a.setAttribute('tabindex', '-1');

        //attributes
        attrKeys = item.attr ? Object.keys(item.attr) : [];
        attrLength = attrKeys.length;

        for (j = 0; j < attrLength; j++) {
          attrName = attrKeys[j];
          if (item.attr[attrName] != null)
            a.setAttribute(attrName, item.attr[attrName]);
        }

        a.href = item.href || '#' + attrName + '-' + item.attr[attrName];
        //a.textContent = item.text;
        a.innerHTML = item.text;

        li.appendChild(a);
        ul.appendChild(li);
      }

      toggle.appendChild(caret);
      dropdown.appendChild(toggle);
      dropdown.appendChild(ul);

      return dropdown;
    }(options)),
    $dropdown;

    $dropdown = $(dropdownHTML);
    $dropdown.on('click', 'a', function (e) {
      var $this = $(this);
      e.preventDefault();

      $this
        .closest('.dropdown')
        .find('.dropdown-toggle')
        .text($this.text());

      $this
        .parent()
        .addClass('selected')
        .siblings()
        .removeClass('selected');
    });
    return $dropdown;
  };

  mybagui.dropdownSelect = function (holder, key, value) {

    var $selectedItem;
    if (value) {
      $selectedItem = $(holder).find("a[" + key + "='" + value + "']");
      $selectedItem.trigger('click');
    }
    else {
      $selectedItem = $(holder).find("a:not([" + key + "])");

      $selectedItem
        .closest('.dropdown')
        .find('.dropdown-toggle')
        .text($selectedItem.text());

      $selectedItem
        .parent()
        .addClass('selected')
        .siblings()
        .removeClass('selected');
    }

  }

  mybagui.dropdownGetSelected = function (holder, key) {
    var val = $(holder).find(".selected a").attr(key);
    return val;
  }

  var nLastOpened = null;
  var _playerWindow = null;
  var _playerWindowIsUnderWatch = false;

  ///forceStopEvent not in use any more
  ///with in a correct use no workoarounds required
  mybagui.openFullScreenPlayerWindow = function (targetAttr, url, forceStopEvent) {
    //PATCH Start
    //This pathc required for sites which are opening Item in new window from gallery.
    //The gallery control support different modes of item view such as new page or new window, the control must support SSO, beacuse of SSO url referer required, 
    //due to this issue in different browser referrer behaviour is differenr and window.open behaviour is different.
    //this difs cause to open twice a new window, to solve this issue code below is required
    var now = new Date().getTime();
    if (nLastOpened !== null) {
      var secondsDiffSinceLastAtemp = ((now - nLastOpened) / 100);
      if (secondsDiffSinceLastAtemp < 2) {
        return;
      }
    }
    //PATCH End
    var maxX = parseInt(screen.width) - 20;
    var maxY = parseInt(screen.height) - 105;

    var options = 'location=no,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,titlebar=no,status=yes,width=' + maxX + ',height=' + maxY + ',top=0,left=0';

    if (_playerWindow !== null && !_playerWindow.closed) {
      _playerWindow.close();
    }
    if (typeof (url) === 'undefined' || url === null) {
      _playerWindow = window.open('/PleaseWait.htm', targetAttr, options);
    } else {
      _playerWindow = window.open(url, null, options);
    }
    _playerWindow.focus();
    //TODO: return if needed
    //_watchPlayerWindowForClosing();

    nLastOpened = new Date().getTime();
    //on url open return false.
    if ((typeof (url) !== 'undefined' & url !== null) && url.length > 0) {
      return false;
    }
  }

  mybagui.getLanguage = function() {
    var server = location.hostname.toLowerCase();
    if (server.substr(0, 4) == "www.") {
      server = server.substr(4);
    }
    var firstSplit = server.split('.')[0];

    if (firstSplit == "he" || firstSplit == "ar" || firstSplit == "en" || firstSplit == "ru" || firstSplit == "vi" || firstSplit == "zh")
      return firstSplit;
    else
      return "he";
  }

  mybagui.getDirection = function() {
    var lang = mybagui.getLanguage();
    if (lang == "he" || lang == "ar")
      return "rtl";
    else
      return "ltr";
  }

  mybagui.setLanguage = function (lang) {
    $("html").attr("lang", lang);
    mybagui.lang = $("html").attr("lang");
    var direction = mybagui.lang == "he" || mybagui.lang == "ar" ? "rtl" : "ltr";;
    $("html").attr("dir", direction);
  }

  $("html").attr("lang", mybagui.getLanguage());
  $("html").attr("dir", mybagui.getDirection());

  mybagui.lang = $("html").attr("lang");

})(window.mybagui || (window.mybagui = {}), jQuery);

$.fn.preloadingButton = function ($button) {
  var $button = this;
  $button.$loading = $button.$loading || $button.find('.mybagui-loader-pulse');
  $button.$text = $button.$text || $button.find('.mybagui-btn-text');

  $button.$loading.remove();

  $button.toggle = function () {

    if ($button.$loading.is(':visible')) {
      $button.$loading.remove();
      $button.append($button.$text)
    }
    else {
      $button.$text.remove();
      $button.append($button.$loading)
    }
    return $button;
  }

  $button.isToggled = function () {
    return $button.$loading.is(':visible');
  }

  $button.reset = function () {

    //if ($button.$loading.is(':visible')) {
      $button.$loading.remove();
      $button.append($button.$text)
    //}
    return $button;
  }

  return $button;
}

$.fn.hasScrollBar = function () {

  var scrollHeight = this.get(0).scrollHeight;
  var height = this.height();

  return scrollHeight > height;
}


