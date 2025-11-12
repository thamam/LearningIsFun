(function (mybag, $, undefined) {

  mybag.groupbox = mybag.groupbox || function () {

    function postMethod(methodName, params, callback) {
      params.ticketID = mybag.groupbox.ticketID;
      $.ajax({
        type: "POST",
        //url: "//mybagui.dev.cet.ac.il/Forms/groupboxApi.aspx/" + methodName,
        url: "//MyBagGatedApi." + mybag.groupbox.apiDomain + "/membership/" + methodName,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
          callback(JSON.parse(response));
        },
        failure: function (response) {
          alert(response);
        }
      });
    }

    return {
      init: function (ticketID, apiDomain) {
        mybag.groupbox.ticketID = ticketID;
        mybag.groupbox.apiDomain = apiDomain;
      },

      getUserLoggedInSchools: function (schoolID, onSuccess) {
        postMethod("getUserLoggedInSchools", { schoolID: schoolID }, onSuccess);
      },

      getUserGroups: function (schoolID, onSuccess) {
        postMethod("getUserGroups", { schoolID: schoolID }, onSuccess);
      },

      getGroupStudents: function (groupID, onSuccess) {
        postMethod("getGroupStudents", { groupID: groupID }, onSuccess);
      },

      createGroup: function (schoolID, groupName, studentIDs, onSuccess) {
        postMethod("createGroup", { schoolID: schoolID, groupName: groupName, studentIDs: studentIDs }, onSuccess);
      },

      getGroup: function (groupID, onSucess) {
        postMethod("getGroup", { groupID: groupID }, onSucess);
      },

      getUserByID: function (otherUserID, onSucess) {
        postMethod("getUserByID", { otherUserID: otherUserID }, onSucess);
      }
    };
  }();
})(window.mybag || (window.mybag = {}), jQuery);
