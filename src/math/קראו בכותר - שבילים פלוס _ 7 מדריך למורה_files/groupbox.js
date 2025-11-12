(function (groupbox, $, undefined) {

  groupbox.showHideDuration = 400;

  //#region Methods

  // output: get users' selection: {schoolID, groups ({id, name, groupType}[]), students selected individually by user ({studentID, contextID, studentName}[])
  groupbox.getSelection = function () {
    return {
      schoolID: groupbox.schoolID,
      groups: getSelectedGroups(),
      individuals: getSelectedIndividuals()
    }
  }

  // set width of ui component, to respond to viewport resize
  groupbox.setWidth = function (width) {
    $('.groupbox').css("width", width);
  }

  // if container is shown only after initialization, call this method after it is shown.
  groupbox.pageReady = function () {
    designScrollbars();
  }

  // initialization. returns a jquery promise which is resolved when all the data is loaded to ui.
  groupbox.init = function (container, settings) {
    var defaultSettings = {
      ticketID: null, // mandatory: security ticket
      apiDomain: '', // mandatory: cet domain for web API site. e.g. "cet.ac.il"
      schoolID: null, // optional to show only this school
      readonly: false, // sets all the component readonly
      selectedGroups: [], // sets the selected groups ({id, name, groupType}[])
      selectedStudents: [], // sets selected students ({studentID, contextID, studentName}[])
      readonlyGroups: [], // sets specific selected groups as readonly ({id}[])
      readonlyStudents: [], // sets specific selected students as readonly ({studentID}[])
      onChanged: null // an event handler to be called when changes are made in the groupbox
    };
    groupbox.settings = $.extend(defaultSettings, settings);

    mybag.groupbox.init(groupbox.settings.ticketID, groupbox.settings.apiDomain);
    groupbox.schoolID = groupbox.settings.schoolID || null; // but avoid 'undefined'

    container.addClass("gb-holder");

    container.empty();

    container.append('\
    <div class="groupbox gb-roll"> \
      <div class="gb-roll-perspective"> \
        <div class="groups-selection gb-roll-side1"> \
          <div class="dropdown-holder school-dropdown-holder hide"> \
          </div> \
          <div class="clearfix"> \
            <div id="chooseGroupsBox" class="listbox groups-listbox"> \
              <div class="listbox-header"><span data-lll-key="chooseGroups">chooseGroups</span></div> \
              <div class="listbox-scroll-holder"> \
                <div class="listbox-body-holder groups-listbox-body-holder"> \
                  <div id="chooseGroupsBody" class="listbox-body groups-listbox-body"> \
                  </div> \
                </div> \
              </div> \
            </div> \
            <div class="arrow-holder"> \
              <div class="arrow"> \
                &nbsp; \
              </div> \
            </div> \
            <div id="chosenGroupsBox" class="listbox groups-listbox chosen"> \
              <div class="listbox-header"><span data-lll-key="chosenGroups">chosenGroups</span></div> \
              <div class="listbox-scroll-holder"> \
                <div class="listbox-body-holder groups-listbox-body-holder"> \
                  <div id="chosenGroupsBody" class="listbox-body groups-listbox-body"> \
                  </div> \
                </div> \
              </div> \
            </div> \
          </div> \
          <div class="add-individuals-holder"> \
            <button id="addIndividuals" class="add-individuals-btn clearfix" type="button" title="addIndividualStudents" data-lll-key="addIndividualStudents"><span class="add-individuals-btn-img"></span><span>addIndividualStudents</span></button> \
          </div> \
        </div> \
        <div class="students-selection gb-roll-side2"> \
          <div class="clearfix"> \
            <div id="chooseStudentsBox" class="listbox students-listbox"> \
              <div class="listbox-header"> \
                <div class="dropdown-holder groups-dropdown-holder"> \
                </div> \
              </div> \
              <div class="listbox-scroll-holder"> \
                <div class="listbox-body-holder students-listbox-body-holder"> \
                  <div id="chooseStudentsBody" class="listbox-body students-listbox-body"> \
                  </div> \
                </div> \
              </div> \
            </div> \
            <div class="arrow-holder"> \
              <div class="arrow"> \
                &nbsp; \
              </div> \
            </div> \
            <div id="chosenStudentsBox" class="listbox students-listbox chosen"> \
              <div class="listbox-header"><span data-lll-key="chosenStudents">chosenStudents</span></div> \
              <div class="listbox-scroll-holder"> \
                <div class="listbox-body-holder students-listbox-body-holder"> \
                  <div id="chosenStudentsBody" class="listbox-body students-listbox-body"> \
                  </div> \
                </div> \
              </div> \
            </div> \
          </div> \
          <div class="students-selection-bar"> \
            <button class="groupbox-btn add-all-btn disabled" type="button" title="add" data-lll-key="add"><span>add</span></button> \
            <button class="groupbox-cancel-btn cancel-all-btn" type="button" title="cancel" data-lll-key="cancel"><span>cancel</span></button> \
          </div> \
        </div> \
        <div class="save-as-group-holder gb-roll-side3"> \
          <div class="save-as-group"> \
            <div class="save-as-group-inner"> \
              <div class="save-as-group-inner-holder"> \
                <div class="save-as-group-msg"> \
                  <span data-lll-key="keepAsGroup">keepAsGroup</span><br/> \
                  <span data-lll-key="keepAsGroupHelp">keepAsGroupHelp</span> \
                </div> \
                <div class="group-name-input-holder"> \
                  <label for="groupName" class="groupbox-field-label" data-lll-key="groupName">groupName:</label> \
				          <span class="input--hoshi group-name-input"> \
					          <input class="groupbox-input input__field--hoshi" type="text" id="groupName" data-lll-key="groupName" title="groupName" /> \
                    <span class="hoshi-label-holder"> \
					            <span class="input__label--hoshi"></span> \
                    </span> \
				          </span> \
                  <div class="group-exists-error error undisplay" data-lll-key="groupNameExists">groupNameExists</div> \
                </div> \
                <div class="group-create-bar clear-fix"> \
                  <button class="groupbox-btn group-btn create-group-btn disabled" type="button" title="createGroup" data-lll-key="createGroup"><span class="mybagui-btn-text">createGroup</span><span class="mybagui-loader-pulse"></span></button> \
                  <button class="groupbox-btn group-btn save-individuals-btn" type="button" title="saveAsIndividuals" data-lll-key="saveAsIndividuals"><span>saveAsIndividuals</span></button> \
                  <button class="groupbox-cancel-btn group-btn cancel-group-btn" type="button" title="cancel" data-lll-key="cancel"><span>cancel</span></button> \
                </div> \
              </div> \
            </div> \
          </div> \
        </div> \
      </div> \
    </div>');
    if (groupbox.settings.readonly) {
      container.children('.groupbox').addClass('readonly')
    }

    //#region localization
    groupbox.lang = $("html").attr("lang");
    if (groupbox.lang == "he")
      groupbox.lll = groupbox.lll_he;
    else if (groupbox.lang == "ar")
      groupbox.lll = groupbox.lll_ar;
    else if (groupbox.lang == "en")
      groupbox.lll = groupbox.lll_en;
    else if (groupbox.lang == "vi")
      groupbox.lll = groupbox.lll_vi;
    else if (groupbox.lang == "zh")
      groupbox.lll = groupbox.lll_zh;

    container.find("[data-lll-key]").each(function () {
      var key = $(this).attr("data-lll-key");
      var text = groupbox.lll[key];
      if ($(this).html().indexOf(key) >= 0) {
        $(this).html($(this).html().replace(new RegExp(key), text));
      }
      if ($(this).attr("title") && $(this).attr("title").indexOf(key) >= 0) {
        $(this).attr("title", $(this).attr("title").replace(new RegExp(key), text));
      }
      if ($(this).attr("placeholder") && $(this).attr("placeholder").indexOf(key) >= 0) {
        $(this).attr("placeholder", $(this).attr("placeholder").replace(new RegExp(key), text));
      }
    });
    //#endregion


    var $createBtn = $('.create-group-btn').preloadingButton();
    selectGroupsAndIndividuals([], []);
    resetStudents();

    //#region bind events
    $('.add-individuals-btn').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      $('.gb-roll').removeClass('gb-roll-rotate1').addClass('gb-roll-rotate2');
      //$('.groups-selection').addClass('hide');
      //$('.students-selection').removeClass('hide');

      if (groupbox.settings.onChanged)
        groupbox.settings.onChanged();
    });
    $('.cancel-all-btn').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      $('.gb-roll').removeClass('gb-roll-rotate2').addClass('gb-roll-rotate1');
      //$('.groups-selection').removeClass('hide');
      //$('.students-selection').addClass('hide');
    });
    $('.cancel-group-btn').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      //$('.students-selection').removeClass('hide');
      //$('.save-as-group-holder').addClass('hide');
      clearGroupName();
      $('.gb-roll').removeClass('gb-roll-rotate3').addClass('gb-roll-rotate2');
    });
    $('.save-individuals-btn').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      //$('.groups-selection').removeClass('hide');
      //$('.save-as-group-holder').removeClass('hide');

      $('#chosenStudentsBody .listbox-item').each(function () {
        var studentID = $(this).attr('data-studentID');
        var contextID = $(this).attr('data-contextID');
        var studentName = $(this).find('span').html();

        if ($('#chosenGroupsBody').find('[data-studentID="' + studentID + '"]').length == 0) {
          // TODO: not best sorting method
          var students = getSelectedIndividuals();
          students.push({ studentID: studentID, contextID: contextID, studentName: studentName });

          var groups = getSelectedGroups();

          selectGroupsAndIndividuals(groups, students);
          // INSTEAD OF: selectIndividual(contextID, studentID, studentName);
        }
      });

      resetStudents();

      bindIndividualDelete();

      $('.gb-roll').removeClass('gb-roll-rotate3').addClass('gb-roll-rotate2');
      window.setTimeout(function () {
        $('.gb-roll').removeClass('gb-roll-rotate2').addClass('gb-roll-rotate1');
      }, 150);
    });
    $('#groupName').off('keyup').on('keyup', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      var name = $(this).val();
      if (name.length > 0) {
        $('.create-group-btn').removeClass('disabled').off('click').on('click', function () {
          if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
            return;

          $('.group-exists-error').hide();
          var groupName = $('#groupName').val();
          var students = getSelectedStudents();
          createGroup(groupName, students, $createBtn);
        });
      }
      else
        $('.create-group-btn').addClass('disabled').off('click');
    });
    //#endregion

    //#region load data
    var deferred = $.Deferred(function (dfd) {
      getAndPopulateSchools().done(function () {
        getSchoolGroups(groupbox.schoolID).done(function (data) {

          var defs = [];
          $(groupbox.settings.selectedGroups).each(function () {
            if (!this.groupType) {
              defs.push(refillGroupData(this));
            }
          });
          $(groupbox.settings.selectedStudents).each(function () {
            if (!this.studentName) {
              defs.push(refillStudentData(this));
            }
          });

          $.when.apply($, defs).then(function () {
            selectGroupsAndIndividuals(groupbox.settings.selectedGroups, groupbox.settings.selectedStudents);
            dfd.resolve();
          });
        });
      });
    });
    //#endregion
    return deferred.promise();
  };

  groupbox.setSchool = function (schoolID) {
    groupbox.schoolID = schoolID;
    getSchoolGroups(groupbox.schoolID);
  }

  groupbox.setGroup = function (groupID) {

    mybag.groupbox.getGroupStudents(groupID, function (data) {
      processResult(data);

      var students = data.value;
      populateStudents(students);
    });
  };

  //#endregion

  //#region private functions

  function getSelectedGroups() {

    var groups = new Array();
    $('#chosenGroupsBody').find('.listbox-item[data-groupID]').each(function () {
      groups.push({ id: $(this).attr('data-groupID'), name: $(this).find('span').html(), groupType: $(this).attr('data-groupType') })
    });
    return groups;
  };

  function getSelectedIndividuals() {

    var students = new Array();
    $('#chosenGroupsBody').find('.listbox-item[data-contextID]').each(function () {
      students.push({ studentID: $(this).attr('data-studentID'), contextID: $(this).attr('data-contextID'), studentName: $(this).find('span').html() })
    });
    return students;
  };

  function createGroup(groupName, students, $btn) {
    $btn.toggle();

    var studentIDs = students.map(function (student) {
      return student.studentID;
    });
    mybag.groupbox.createGroup(groupbox.schoolID, groupName, studentIDs, function (data) {
      processResult(data);

      $btn.reset();

      if (data.code == 1) // group name already exists
      {
        showGroupCreateError();
      }
      else {
        var newGroup = data.value;

        onGroupCreated(newGroup);
      }
    });
  };

  function showGroupCreateError() {
    $('.group-exists-error').show(groupbox.showHideDuration);
  };

  function onGroupCreated(newGroup) {

    var groups = getAllGroups();
    groups.push(newGroup);
    var selectedGroups = getSelectedGroups();
    selectedGroups.push(newGroup);

    var selectedIndividuals = getSelectedIndividuals();

    populateGroups(groups);
    selectGroupsAndIndividuals(selectedGroups, selectedIndividuals);

    resetStudents();

    rollback();

    clearGroupName();
  }

  function rollback() {
    //$('.groups-selection').removeClass('hide');
    //$('.save-as-group-holder').removeClass('hide');
    $('.gb-roll').removeClass('gb-roll-rotate3').addClass('gb-roll-rotate2');
    window.setTimeout(function () {
      $('.gb-roll').removeClass('gb-roll-rotate2').addClass('gb-roll-rotate1');
    }, 150);
  };

  function getSchoolGroups(schoolID) {
    return $.Deferred(function (dfd) {
      mybag.groupbox.getUserGroups(schoolID, function (data) {
        processResult(data);

        //groupbox.selectSchool(schoolID);

        var groups = data.value;
        populateGroups(groups);

        dfd.resolve();
      });
    }).promise();
  };

  function refillGroupData(group) {
    return $.Deferred(function (dfd) {
      mybag.groupbox.getGroup(group.id, function (data) {
        processResult(data);

        //groupbox.selectSchool(schoolID);

        var fullGroup = data.value;
        group.groupType = fullGroup.groupType;
        group.name = fullGroup.name;

        dfd.resolve();
      });
    }).promise();
  }

  function refillStudentData(student) {
    return $.Deferred(function (dfd) {
      mybag.groupbox.getUserByID(student.studentID, function (data) {
        processResult(data);

        //groupbox.selectSchool(schoolID);

        var user = data.value;
        student.studentName = user.fullName;

        dfd.resolve();
      });
    }).promise();
  }

  function getAndPopulateSchools() {
    return $.Deferred(function (dfd) {
      mybag.groupbox.getUserLoggedInSchools(groupbox.schoolID, function (data) {
        if (!data) {
          return;
        }
        processResult(data);

        var schools = data.value;
        groupbox.schoolID = schools[0].schoolID;
        if (schools.length > 1) {
          populateSchools(schools);
        }
        dfd.resolve();
      });
    }).promise();
  };

  function populateSchools(schools) {

    var arrSchools = [];

    var selectedItem = 0;
    for (var i = 0; i < schools.length; i++) {
      var school = schools[i];
      arrSchools.push({ text: school.schoolName, attr: { 'data-schoolID': school.schoolID } });
    }

    var $school_dropdown = mybagui.dropdown({
      container_id: 'school',
      menu_name: 'schools',
      selected_item: selectedItem,
      items: arrSchools
    })
    .on('click', 'a', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      groupbox.setSchool($(this).attr('data-schoolID'));
    });
    $('.school-dropdown-holder').html($school_dropdown);
    $('.school-dropdown-holder').removeClass('hide');
  };

  function populateGroups(groups) {

    var readonly = groupbox.settings.readonly ? " readonly" : "";

    groups.sort(groupCompare);

    $('#chooseGroupsBody').empty();

    var prevGroup;
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];

      var preselectedMatch = !!groupbox.settings.readonlyGroups && groupbox.settings.readonlyGroups.some(function (rogroup) {
        return rogroup.id == group.id;
      });

      var disabled = (preselectedMatch) ? " disabled" : "";

      if(!prevGroup || group.groupType != prevGroup.groupType) {
        $('#chooseGroupsBody').append('<div class="listbox-separator"><span>' + groupbox.lll[group.groupType + 's'] + '</span></div>')
      }

      $('#chooseGroupsBody').append('<div class="listbox-item clearfix' + disabled + '" data-groupID="' + group.id + '" data-groupType="' + group.groupType + '"><input id="cb_' + group.id + '" class="cb-item" type="checkbox"' + readonly + disabled + ' /><label for="cb_' + group.id + '"><span>' + group.name + '</span></label></div>')
      prevGroup = group;
    }

    $('.cb-item').off('click').on('click', function (e) {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly')) {
        e.stopPropagation();
        return false;
      }
    });
    $('.cb-item').off('change').on('change', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      var selectedGroupID = $(this).closest('div').attr('data-groupID');
      var selectedGroupType = $(this).closest('div').attr('data-groupType');
      if (this.checked) {
        // TODO: not best sorting method
        var groupName = $(this).next('label').find('span').html();
        var groups = getSelectedGroups();
        groups.push({ id: selectedGroupID, name: groupName, groupType: selectedGroupType });

        var students = getSelectedIndividuals();

        selectGroupsAndIndividuals(groups, students);
        // INSTEAD OF: selectGroup(selectedGroupID, $(this).parent().next('label').html());
      }
      else {
        // TODO: not best sorting method
        var groups = getSelectedGroups();
        groups = groups.filter(function (el) { return el.id != selectedGroupID });

        var students = getSelectedIndividuals();

        selectGroupsAndIndividuals(groups, students);
        // INSTEAD OF: $('#chosenGroupsBody').find('[data-groupID="' + selectedGroupID + '"]').remove();
      }
      bindGroupDelete();

      if (groupbox.settings.onChanged)
        groupbox.settings.onChanged();
    });
    //$('.groups-listbox').height(Math.min($('.groups-listbox-body').height() + 50, 210));
    //$('.groups-listbox-body-holder').height($('.groups-listbox').height() - 30);
    //$('.students-listbox').height(Math.min($('.groups-listbox-body').height() + 50, 210));
    //$('.students-listbox-body-holder').height($('.students-listbox').height() - 30);


    var arrGroups = [];

    arrGroups.push({ text: groupbox.lll["chooseGroup"], attr: { 'data-groupID': null } });

    var selectedItem = 0;
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      arrGroups.push({ text: group.name, attr: { 'data-groupID': group.id } });
    }

    var $group_dropdown = mybagui.dropdown({
      container_id: 'group',
      menu_name: 'groups',
      selected_item: selectedItem,
      items: arrGroups
    })
    .on('click', 'a', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || groupbox.settings.readonly)
        return;

      var selected = $(this).attr('data-groupID');
      if (selected != null) {
        $('#chooseStudentsBody').attr('data-selected-groupID', selected);
        groupbox.setGroup(selected);
      }
      else {
        $('#chooseStudentsBody').removeAttr('data-selected-groupID');
        resetStudents();
      }
    });
    $('.groups-dropdown-holder').html($group_dropdown);

    designScrollbars();

  };

  function populateStudents(students) {

    $('#chooseStudentsBody').empty();

    for (var i = 0; i < students.length; i++) {
      var student = students[i];
      var checkState;
      if ($('#chosenStudentsBody').find('[data-studentID="' + student.id + '"]').length > 0)
        checkState = 'checked="checked"';
      else
        checkState = '';
      $('#chooseStudentsBody').append('<div class="listbox-item clearfix" data-studentID="' + student.id + '"><input id="cb2_' + student.id + '" class="cb2-item" type="checkbox" ' + checkState + '/><label for="cb2_' + student.id + '"><span>' + student.fullName + '</span></label></div>')
    }
    $('.cb2-item').off('change').on('change', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      var selectedGroupID = $('#chooseStudentsBody').attr('data-selected-groupID');
      var selectedStudentID = $(this).closest('div').attr('data-studentID');
      if (this.checked) {
        // TODO: not best sorting method
        var studentName = $(this).next('label').find('span').html();
        var students = getSelectedStudents();
        students.push({ studentID: selectedStudentID, contextID: selectedGroupID, studentName: studentName });

        selectStudents(students);
        // INSTEAD OF: selectStudent(selectedGroupID, selectedStudentID, $(this).next('label').html());        
      }
      else {
        // TODO: not best sorting method
        var students = getSelectedStudents();
        students = students.filter(function (el) { return el.studentID != selectedStudentID });

        selectStudents(students);
        // INSTEAD OF: $('#chosenStudentsBody').find('[data-studentID="' + selectedStudentID + '"]').remove();
      }

      bindStudentDelete();

      if ($('#chosenStudentsBody').children().length == 0) {
        $('.add-all-btn').addClass('disabled');
        $('.add-all-btn').off('click');
      }
    });
    //$('.students-listbox').height(Math.min($('.students-listbox-body').height() + 50, 210));
    //$('.students-listbox-body-holder').height($('.students-listbox').height() - 30);

    designScrollbars();
  };

  function designScrollbars() {

    if ($('#chooseGroupsBox .listbox-body-holder').hasScrollBar())
      $('#chooseGroupsBox').addClass('has-scrollbar');
    else
      $('#chooseGroupsBox').removeClass('has-scrollbar');

    if ($('#chosenGroupsBox .listbox-body-holder').hasScrollBar())
      $('#chosenGroupsBox').addClass('has-scrollbar');
    else
      $('#chosenGroupsBox').removeClass('has-scrollbar');

    if ($('#chooseStudentsBox .listbox-body-holder').hasScrollBar())
      $('#chooseStudentsBox').addClass('has-scrollbar');
    else
      $('#chooseStudentsBox').removeClass('has-scrollbar');

    if ($('#chosenStudentsBox .listbox-body-holder').hasScrollBar())
      $('#chosenStudentsBox').addClass('has-scrollbar');
    else
      $('#chosenStudentsBox').removeClass('has-scrollbar');
  }

  function selectSchool(schoolID) {
    mybagui.dropdownSelect($('.school-dropdown-holder'), 'data-schoolID', schoolID);
  }

  function selectGroupsAndIndividuals(groups, students) {

    $('#chosenGroupsBody').empty();
    selectGroupsInner(groups);

    if (students.length > 0)
      $('#chosenGroupsBody').append('<div class="listbox-separator"><span>' + groupbox.lll['individualStudents'] + '</span></div>')

    selectIndividualsInner(students);

    designScrollbars();
  };

  function selectStudents(students) {

    $('#chosenStudentsBody').empty();

    students.sort(studentCompare);

    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      var studentListItem = $('#chooseStudentsBody').find('[data-studentID="' + student.studentID + '"]');
      if (studentListItem.length > 0) {
        studentListItem.find('.cb2-item').prop('checked', true);
      }
      selectStudent(student.contextID, student.studentID, student.studentName);
    }

    bindStudentDelete();

    designScrollbars();
  };

  function resetStudents() {
    mybagui.dropdownSelect('.groups-dropdown-holder', 'data-groupID');
    $('#chooseStudentsBody').empty();
    $('#chosenStudentsBody').empty();

    $('.add-all-btn').addClass('disabled');
    $('.add-all-btn').off('click');
  };

  function selectIndividuals(students) {

    $('#chosenStudentsBody').empty();

    selectIndividualsInner(students);

    designScrollbars();
  };

  function getAllGroups() {

    var groups = new Array();
    $('#chooseGroupsBody').find('.listbox-item').each(function () {
      groups.push({ id: $(this).attr('data-groupID'), name: $(this).find('span').html(), groupType: $(this).attr('data-groupType') })
    });
    return groups;
  };

  function getSelectedStudents() {

    var students = new Array();
    $('#chosenStudentsBody').find('.listbox-item').each(function () {
      students.push({ studentID: $(this).attr('data-studentID'), contextID: $(this).attr('data-contextID'), studentName: $(this).find('div').find('span').html() })
    });
    return students;
  };

  function clearGroupName() {
    $('#groupName').val('');
    $('.create-group-btn').addClass('disabled').off('click');
  };

  function groupCompare(a, b) {

    if (a.groupType == b.groupType) {
      return a.name.localeCompare(b.name);
    }
    else {
      return a.groupType.localeCompare(b.groupType);
    }
  }

  function studentCompare(a, b) {

    return a.studentName.localeCompare(b.studentName);
  }

  function selectGroup(groupID, groupName, groupType, disabled) {
    $('#chosenGroupsBody').append('<div class="listbox-item clearfix" data-groupID="' + groupID + '" data-groupType="' + groupType + '"><button type="button" class="group-delete' + disabled + '" title="' + groupbox.lll["delete"] + '"' + disabled +'/><div><span>' + groupName + '</span></div></div>');

    designScrollbars();
  }

  function selectIndividual(contextID, studentID, studentName, disabled) {
    $('#chosenGroupsBody').append('<div class="listbox-item clearfix" data-contextID="' + contextID + '" data-studentID="' + studentID + '"><button type="button" class="individual-delete' + disabled + '" title="' + groupbox.lll["delete"] + '"' + disabled + '/><div><span>' + studentName + '</span></div></div>');
  }

  function selectStudent(groupID, studentID, studentName) {
    $('#chosenStudentsBody').append('<div class="listbox-item clearfix" data-contextID="' + groupID + '" data-studentID="' + studentID + '"><button type="button" class="student-delete" title="' + groupbox.lll["delete"] + '"/><div><span>' + studentName + '</span></div></div>');

    $('.add-all-btn').removeClass('disabled');
    $('.add-all-btn').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      //$('.students-selection').addClass('hide');
      //$('.save-as-group-holder').removeClass('hide');
      $('.gb-roll').removeClass('gb-roll-rotate2').addClass('gb-roll-rotate3');
    });

    designScrollbars();
  }

  function bindStudentDelete() {

    $('.student-delete').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly'))
        return;

      var selectedStudentID = $(this).closest('div').attr('data-studentID');
      $('#chooseStudentsBody').find('[data-studentID="' + selectedStudentID + '"]').find('.cb2-item').prop('checked', false);
      $(this).closest('div').remove();
      if ($('#chosenStudentsBody').children().length == 0) {
        $('.add-all-btn').addClass('disabled');
        $('.add-all-btn').off('click');
      }
    });
  }

  function bindIndividualDelete() {

    $('.individual-delete').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly') || $(this).hasClass('disabled'))
        return;

      var selectedIndividual = $(this).closest('div').attr('data-studentID');

      // TODO: not best sorting method
      var groups = getSelectedGroups();

      var students = getSelectedIndividuals();
      students = students.filter(function (el) { return el.studentID != selectedIndividual });

      selectGroupsAndIndividuals(groups, students);
      // INSTEAD OF: $(this).closest('div').remove();

      if (groupbox.settings.onChanged)
        groupbox.settings.onChanged();
    });
  }

  function bindGroupDelete() {

    $('.group-delete').off('click').on('click', function () {
      if ($(this).closest('.groupbox').hasClass('disabled') || $(this).closest('.groupbox').hasClass('readonly') || $(this).hasClass('disabled'))
        return;

      var selectedGroupID = $(this).closest('div').attr('data-groupID');

      // TODO: not best sorting method
      var groups = getSelectedGroups();
      groups = groups.filter(function (el) { return el.id != selectedGroupID });

      var students = getSelectedIndividuals();

      selectGroupsAndIndividuals(groups, students);
      // INSTEAD OF: $(this).closest('div').remove();

      $('#chooseGroupsBody').find('[data-groupID="' + selectedGroupID + '"]').find('.cb-item').prop('checked', false);

      if (groupbox.settings.onChanged)
        groupbox.settings.onChanged();
    });
  }

  function selectGroupsInner(groups) {

    groups.sort(groupCompare);

    var prevGroup;
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];

      var preselectedMatch = !!groupbox.settings.readonlyGroups && groupbox.settings.readonlyGroups.some(function (rogroup) {
        return rogroup.id == group.id;
      });

      var disabled = (preselectedMatch) ? " disabled" : "";
      preselectedMatch = undefined;

      var groupListItem = $('#chooseGroupsBody').find('[data-groupID="' + group.id + '"]');
      if (groupListItem.length > 0) {
        groupListItem.find('.cb-item').prop('checked', true);
        var groupName = groupListItem.find('label').find('span').html();
      }
      if (!prevGroup || group.groupType != prevGroup.groupType) {
        $('#chosenGroupsBody').append('<div class="listbox-separator"><span>' + groupbox.lll[group.groupType + 's'] + '</span></div>')
      }
      selectGroup(group.id, groupName || group.name, group.groupType, disabled);
      prevGroup = group;
    }

    bindGroupDelete();
  }

  function selectIndividualsInner(students) {

    for (var i = 0; i < students.length; i++) {
      var student = students[i];
      
      var preselectedMatch = !!groupbox.settings.readonlyStudents && groupbox.settings.readonlyStudents.some(function (rostudent) {
        return student.studentID == rostudent.studentID;
      });

      var disabled = (preselectedMatch) ? " disabled" : "";
      preselectedMatch = undefined;

      selectIndividual(student.contextID, student.studentID, student.studentName, disabled);
    }

    bindIndividualDelete();
  }

  function processResult(data) {

    //if (data == null)
    //  console.log(new Error("API method returned null value!"));
    //else if (!data.ok)
    //  console.log(new Error(data.description));
  }

  //#endregion

})(window.groupbox || (window.groupbox = {}), jQuery);
