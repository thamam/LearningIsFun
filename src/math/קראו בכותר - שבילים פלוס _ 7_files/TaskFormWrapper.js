(function (mybagui, $, undefined) {

  mybagui.taskFormWrapper = mybagui.taskFormWrapper || function () {

    return {
      init: function (element, environment, options) {

        mybagui.taskFormWrapper.languageCode = options.languageCode || "he";

        if (jQuery.isFunction(options.onComplete)) {
          $(window).unbind('message').bind('message', function (e) {
            var msg = e.originalEvent.data;
            if (typeof msg == "string") {
              var args = msg.split("|");
              if (args[0] == "mybagui" && args[1] == "taskform" && args[2] == "close")
                options.onComplete("close");
              else if (args[0] == "mybagui" && args[1] == "taskform" && args[2] == "saved") {
                var savedTask = args[3];
                options.onComplete("saved", JSON.parse(savedTask));
              }
              else if (args[0] == "mybagui" && args[1] == "taskform" && args[2] == "changed") {
                if (options.onChanged)
                  options.onChanged();
              }
            }
            return true;
          });
        }


        var extraParams = {
          title: options.title,
          cetSubject: options.cetSubject,
          instructions: options.instructions,
          returnUrl: options.returnUrl,
          returnTitle: options.returnTitle
        };
        delete options["title"];
        delete options["cetSubject"];
        delete options["instructions"];
        delete options["returnUrl"];
        delete options["returnTitle"];


        var queryString = "";
        var sep = "?";
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            if (key == "languageCode" || key == "onComplete" || key == "onChanged"
              )
              continue;
            queryString += sep + key + "=" + options[key];
            sep = "&";
          }
        }

        $(element).height("100%");

        if (options.title) // is kotar copy note
        {
          queryString
        }

        $('<iframe id="taskFormIframe" src="http://' + ((options.languageCode && options.languageCode.toLowerCase() != "he") ? options.languageCode + '.' : '') + 'mybagui.' + environment + '/Forms/TaskForm/' + queryString + '" width="100%" height="100%" frameborder="0"></iframe>').appendTo(element).load(function () {
          var extraParamsString = JSON.stringify(extraParams);
          this.contentWindow.postMessage("cdn|taskformWrapper|extraParams|" + extraParamsString, "*");
        });
      },
      getClosingConfirmationMessage: function () {

        switch (mybagui.taskFormWrapper.languageCode) {
          case "he":
            return "שימו לב! המשימה לא נשמרה.";
          case "ar":
            return "انتبهوا! المهمّة لم تُحفظ.";
          case "en":
            return "Attention! The task has not been saved.";
        }
      }
    };
  }();
})(window.mybagui || (window.mybagui = {}), jQuery);
