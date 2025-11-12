///#source 1 1 /libs/cet.editorManager/1.0/editorManager.js
var cet = cet || {};
cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.fileManagerMsg = cet.cetEditor.plugins.fileManagerMsg || {};
cet.cetEditor.audioConverter = cet.cetEditor.audioConverter || {};
cet.cetEditor.commomn = cet.cetEditor.commomn || {};
//rach text editor that has the ability to convert HTML TEXTAREA fields or other HTML elements to editor instances.
//holds TinyMCE instance
// plugins behavior: there is default plugin. client of cetEditor can choose or add plugin list for default one, or override it.
//toolbar behavior: the plugin that will add here will shown on editor toolbar (those who want added, will be hidden). If toolbarList is init the default one will be overriden  
cet.editorMananger = (function () {
  "use strict";
  var translates = [];
  var addTransaltion = function (lang, translationObj) {
    translates[lang] = translationObj;
  }
  var getTranslation = function () {
    return translates;
  }
  // Create a new instance of cetEditor, holds the options settings of the editor (merging default options setting with client option)
  var builder = (function () {

    var defaultPlugins = '';
    var defaultToolbar = 'bold italic underline | alignleft aligncenter alignright | bullist numlist | forecolor backcolor ';

    //Default editor settings 
    var defultOptions = {
      language: 'he',
      pluginList: '',
      toolbarList: '',
      defaultPlugins: defaultPlugins,
      defaultToolbar: defaultToolbar,
      addDefaultPlugins: true,
      autoFocus: true,
      readonly: 0, //false
      menubar: false,
      objectResizing: false,
      statusbar: false,
      height: '',
      width: '',
      directionality: 'rtl',
      inline: false,
      contentCss: '',
      disableToolbar: false,
      hide_plugins: '',
    }

    //Merge the contents of two objects together into the first object.
    function merge_options(obj1, obj2) {
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }

    /**
  * Returns CetEditor instance.
  *
  * @method getEditor
  * @param {Object} options= {
  *   editorElement:'textarea'
  *   language:'he_IL',
  *   pluginList:'image example TestPlugin cetPlugin -externalPlugin',
  *   toolbarList:'',
  *   defaultPlugins: true,
  *   autoFocus: false,
  *   readonly: 1 // 1- true , 0 - false
  *   menubar: false//empty
  *   objectResizing: false,
  *   statusbar: false,
  *   height: '',
  *   width: '',
  *   directionality: 'rtl',
  *   inline: false,
  *   contentCss: '',
  *   readyHandler: callback, //when you can access the DOM  ,   var cEditor = e.detail.cetEditor;
  *   disableToolbar: false
  * @return {CetEditor} instance.
  */
    function getEditor(options) {
      try {
        if (!options || !options.editorElement) throw ("The getEditor(options) method: missing options.editorElement parameter");
        var newOptions = merge_options(defultOptions, options);
        var cetEditor = new CetEditor(newOptions);
        return cetEditor;
      }
      catch (err) {
        // console.error(err);
      }

    }

    // Register plugin - it specified in the plugin.js, that gets loaded as a part of the load process of plugin.js
    function initPlugin(data) {
      try {
        if (!data) throw ("The initPlugin(data) method: missing data object parameter");
        if (!data.plginId) throw ("The initPlugin(data) method: missing data.plginId parameter");
        if (!data.pluginObj) throw ("The initPlugin(data) method: missing data.pluginObj parameter");
        tinymce.PluginManager.add(data.plginId, data.pluginObj);

      }
      catch (err) {
        //console.error(err);
      }

    }




    return {
      getEditor: getEditor,
      initPlugin: initPlugin,
    }

  })();

  var getBasicFormat = {
    //remain only src/href and data-name
    all: function (doc, pluginList) {
      if (!doc) {
        return doc;
      }
      if (pluginList.indexOf('cetKotarImg') > -1) {
        getBasicFormat.image(doc);
      }
      if (pluginList.indexOf('cetAudio') > -1) {
        getBasicFormat.audio(doc);
      }
      if (pluginList.indexOf('cetVideo') > -1) {
        getBasicFormat.video(doc);
      }
      if (pluginList.indexOf('cetFile') > -1) {
        getBasicFormat.file(doc);
      }
    
      return doc ? cet.cetEditor.commomn.domElement2string(doc) : doc;
    },
    video: function (doc) {
      var videoConverter = cet.cetEditor.videoConverter;
      var BASIC_PLAYER_STYLE = 'display: inline-block;width: 409px; height: 279px;background-repeat: no-repeat;';
      var args = { doc: doc, style: BASIC_PLAYER_STYLE };
      cet.cetEditor.commomn.iterateAllElement('iframe', videoConverter.cleanVideo, args);
    },//render to iframe from image and remain src and data-name
    image: function (doc) {
      //imageElements to zoom onklick
      var imageElements = doc.querySelectorAll('[data-name="cet_cetEditor_zoomImgPlugin"]');
      if (!imageElements || imageElements.length === 0) {//case sensitive

        return;
      }
      for (var i = 0; i < imageElements.length; i++) {
        var element = imageElements[i];
        var commonFuncs = cet.cetEditor.plugins.img.common.private;
        var src = element.getAttribute('src');
        var originalwidth = Number(element.getAttribute('data-originalwidth'));
        var originalHeight = Number(element.getAttribute('data-originalHeight'));
        var newSrc = commonFuncs.getSrc(src, { width: originalwidth, height: originalHeight });

        element.setAttribute('src', newSrc);

      }
      //return cet.pluginsViewManager.domElement2string(doc);

    },// remain img with src- original src
    audio: function (doc) {//TODO replace style with BASIC_PLAYER_STYLE
      var PLAYER_WIDTH = 315;//IMAGE PX
      var PLAYER_HEIGHT = 37;//61;//IMAGE PX
      var BASIC_PLAYER_STYLE = 'display: block;  margin-bottom: 20px;';
      var elementSelector = 'audio';
      var elements = doc.querySelectorAll(elementSelector);
      if (elements && elements.length > 0) {
        var args = { doc: doc, style: BASIC_PLAYER_STYLE };
        var audioConverter = cet.cetEditor.audioConverter;
        cet.cetEditor.commomn.iterateAllElement(elementSelector, audioConverter.cleanAudio, args);

      }

    },// render to audio with src ,alt,title
    link: function (doc) { },// remain href,rel,title,data-name
    file: function (doc) {
      var BASIC_FILE_STYLE = 'cursor: default;';
      var elementSelector = '[data-name="cet_cetEditor_filePlugin"]';
      var elements = doc.querySelectorAll(elementSelector);
      if (elements && elements.length > 0) {
        var args = { doc: doc, style: BASIC_FILE_STYLE };
        var fileConverter = cet.cetEditor.fileConverter;
        cet.cetEditor.commomn.iterateAllElement(elementSelector, fileConverter.fileStyle, args);
  
      }
    },// render to anchor remain href and data-name
  }
  var setRenderdFormat = {
    //calculate then add all attributes

    all: function (doc, pluginList, setContent) {//all plugin
      if (!doc) {
        setContent(doc);
        return;
      }
      //test :  '<img src="https://9to5google.files.wordpress.com/2013/12/google2.jpg">';
      //var imageTest=doc.createElement('img');
      //imageTest.src = "https://9to5google.files.wordpress.com/2013/12/google2.jpg";
      //doc.querySelector('img').appendChild(imageTest);
      // end test
      if (pluginList.indexOf('cetKotarImg') > -1) {
        var setCallback = function (src, element, newEditSize, originalSize, doc, setContent) {
          var commonFuncs = cet.cetEditor.plugins.img.common.private;
          element.setAttribute('data-originalwidth', originalSize.width);
          element.setAttribute('data-originalHeight', originalSize.height);
          element.setAttribute('width', newEditSize.width);
          element.setAttribute('height', newEditSize.height);
          element.setAttribute('title', "תמונה");//TODO translate("Image")
          var newSrc = commonFuncs.getSrc(src, {
            width: originalSize.width, height: originalSize.height
          });
          element.setAttribute('src', newSrc);
          // setContent(cet.pluginsViewManager.domElement2string(doc));
        }
        setRenderdFormat.image(doc, setCallback, setContent);
      }
      if (pluginList.indexOf('cetAudio') > -1) {

        setRenderdFormat.audio(doc, setCallback, setContent);
        // setContent(cet.pluginsViewManager.domElement2string(doc));
      }
      if (pluginList.indexOf('cetVideo') > -1) {
        setRenderdFormat.video(doc, setCallback, setContent);

      }
      doc = doc ? cet.cetEditor.commomn.domElement2string(doc) : doc;
      setContent(doc);
    },
    video: function (doc) {//render to image and calculate Thumbnail and add it 
      //test:
      //var iframetest = doc.createElement('iframe');
      //iframetest.src = "www.youtube.com/embed/uI2cwfluyNo";
      //doc.querySelector('body').appendChild(iframetest);

      var videoConverter = cet.cetEditor.videoConverter;
      var args = { doc: doc };
      cet.cetEditor.commomn.iterateAllElement('iframe', videoConverter.createThumbnail, args);

    },
    image: function (doc, setCallback, setContent) {

      //imageElements to zoom onklick
      var imageElements = doc.querySelectorAll('img:not([data-name="cet-cetEditor-audioPlugin"]):not([data-name="cet_cetEditor_videoPlugin"]):not([data-name="cet-cetEditor-linkPlugin-image"])');
      var commonFuncs = cet.cetEditor.plugins.img.common.private;

      for (var i = 0; i < imageElements.length; i++) {
        var element = imageElements[i];
        var dataName = element.getAttribute('data-name');
        if (dataName === "cet_cetEditor_zoomImgPlugin") {
          var src = element.getAttribute('src');
          var width = Number(element.getAttribute('width'));
          var height = Number(element.getAttribute('height'));
          var newSrc = commonFuncs.getSrc(src, { width: width, height: height });

          element.setAttribute('src', newSrc);
          var style = element.getAttribute('style');
          element.setAttribute('style', style + ';max-width: 315px;max-height: 215px');

          //setContent(cet.pluginsViewManager.domElement2string(doc));

        }
        else if (!dataName) {
          element.setAttribute('data-name', 'cet_cetEditor_zoomImgPlugin');
          var commonFuncs = cet.cetEditor.plugins.img.common.private;
          var src = element.getAttribute('src');
          var image = document.createElement('img');
          //loading the image for original width and height and then excute callback: addImageWithCalcAttr
          image.onload = function () {
            var newEditSize = commonFuncs.recalcSize(this.width, this.height, "edit");
            var newEditSrc = commonFuncs.getSrc(src, newEditSize);
            var originalSize = { width: this.width, height: this.height };
            setCallback(src, element, newEditSize, originalSize, doc, setContent);//TODO


          };
          image.onerror = function () {
            //  console.log("image without data-name fail onloading ");
          }
          image.src = src;
        }
      }
    }, //render to image with clculate size
    audio: function (doc) {
      var audioConverter = cet.cetEditor.audioConverter;
      var common = cet.cetEditor.commomn;
      //test:
      //var audioTest = doc.createElement('audio');
      //audioTest.src = "http://storage.cet.ac.il/assets.api/uploads/201507/ed9a791221b7459bae6fd9b41dfd3d06.mp3";
      //doc.querySelector('audio').parentNode.appendChild(audioTest);

      var elementSelector = 'audio';
      var elements = doc.querySelectorAll(elementSelector);
      if (elements && elements.length > 0) {
        var args = { doc: doc };

        cet.cetEditor.commomn.iterateAllElement(elementSelector, audioConverter.createAudioImage, args);

      }


    },// render to image  no need to calculate.
    link: function (doc) { },// render href,rel,title,data-name and add trget
    file: function (doc) { },//render to an image caclculate which file is it (word,ppt...)

  };


  /**
  * CetEditor holds tinyMCE instance and reveals methods that interested CET.
  *
  * @class CetEditor 
  */
  var cdnpath;//TODO delete afrte cdn on prodaction not nesesery (it for:cdn.dev/testing/prod) '//CDN.dev.cet.ac.il/libs/tinymce/4.1.10/plugins/'

  function CetEditor(options) {
    var editorElement = options.editorElement = getElement(options);
    this.id = editorElement;
    this.isReady = false;
    var fileManagerMsg = cet.cetEditor.plugins.fileManagerMsg;

    //Gets content with view scripts injuction

    this.getFileManagerMsg = function () {
      return fileManagerMsg;
    }

    //CONTENT WITHOUT ALL ATTRIBUTES AND STYLE. ONLY WITH DATA-NAME AND SRC

    //@return {String} HTML contents that got written down after render cetPlugin. 
    this.getCetEditorContent = function () {
      var doc = cet.cetEditor.commomn.string2xml(this.getContent());

      return getBasicFormat.all(doc, getPluginList());
      //return getBasicFormat.image(doc);
    }

    this.setCetEditorContent = function (html) {
      var doc = cet.cetEditor.commomn.string2xml(html);
      setRenderdFormat.all(doc, getPluginList(), this.setContent);
    }

    //@return {String} HTML contents that got written down. 
    this.getContent = function () {
      if (tinyMCE.activeEditor.id === tinyEditor.id) {
        return tinyMCE.activeEditor.getContent()
      }
      return tinyEditor.getContent();
    }

    this.getInnerText = function () {
      if (tinyMCE.activeEditor.id === tinyEditor.id) {
        return tinyMCE.activeEditor.getContent({ format: 'text' })
      }
      return tinyEditor.getContent({ format: 'text' });
    }

    this.setContent = function (data) {
      tinyEditor.setContent(data);
    }

    //destroys the editor instance by removing all events
    this.remove = function (removeHandler) {
      tinyEditor.remove();
    }

    this.addClass = function (className) {
      this.addClassToElement('body', className);
    }

    this.addClassToElement = function (element, className) {
      tinyEditor.dom.addClass(tinyEditor.dom.select(element), className);
    }


    this.focusHandler = function (callbak) {
      if (!callbak) {
        // console.error("focusHandler callback is undefined");
        return false;
      }
      tinyEditor.on('focus', callbak);
    }

    this.blurHandler = function (callbak) {
      if (!callbak) {
        //  console.error("blurHandler callback is undefined");
        return false;
      }
      tinyEditor.on('blur', callbak);
    }



    this.onResize = function (callback) {
      var resizeListener = function (callback) {
        var iframe = tinyEditor.id.parentNode.querySelector('iframe').contentWindow;
        iframe.addEventListener("resize", callback);
      }
      tinyEditor.on('init', function (callback) { resizeListener(callback) });

    }

    this.getEditorElement = function () {
      return tinyEditor.getElement();
    }
    //cetEditor private functions:

    function getElement(options) {
      if (isElement(options.editorElement)) {
        return options.editorElement;
      }
      else {
        return document.querySelector(options.editorElement);
      }
    }
    //Returns true if it is a DOM element    
    function isElement(o) {
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
    }

    function translate(text) {
      var lang = tinyOptions.language || 'en', translates = cet.editorMananger.getTranslation();

      if (!text) {
        return '';
      }

      return translates[lang][text];

    }

    function getToolbarSetting(options) {
      if (options.disableToolbar) {
        return false;
      }
      else {
        return options.toolbarList;
        //if (options.addDefaultPlugins) {
        //  return getCleanToolbarList(options) + ' ' + options.toolbarList + '| ' + options.defaultToolbar;
        //}
        //else {
        // return getCleanToolbarList(options) + ' ' + options.toolbarList;
        //}
      }
    }

    //Toolbar list clean from plugins that should not appear ( according to options.hide_plugins)
    function getCleanToolbarList(options) {
      var toolbarNewList = options.pluginList;
      var hidePlugins = options.hide_plugins.replace(/ +(?= )/g, '').split(" ");
      for (var i = 0; i < hidePlugins.length; i++) {
        toolbarNewList = toolbarNewList.replace(hidePlugins[i], '');
      }
      return toolbarNewList;
    }

    function getPlugins(options) {

      options.pluginList = options.pluginList;
      return (options.addDefaultPlugins) ? options.pluginList + ' ' + options.defaultPlugins : options.pluginList;
    }

    var readyHandler = function (cetEditor) {
      return function (e) {
        if (!options || !options.readyHandler) {
          return;
        }
        cetEditor.isReady = true;
        e.cetEditor = cetEditor;
        options.readyHandler(e);
      }
    };
    function getPluginList() {
      return tinyOptions.plugins;
    }

    var tinyOptions = {
      language: options.language,
      plugins: getPlugins(options),//options.defaultPlugins by default is true
      toolbar: getToolbarSetting(options),//options.defaultToolbar by default is true
      object_resizing: options.objectResizing,
      menubar: options.menubar,
      statusbar: options.statusbar,
      auto_focus: (options.autoFocus) ? options.editorElement : '',
      readonly: options.readonly,
      height: options.height,
      width: options.width,
      directionality: options.directionality,
      inline: options.inline,
      media_strict: false,
      //forced_root_block: 'p',
      default_link_target: "_blank",
      //noneditable_leave_contenteditable: true,
      force_p_newlines: true,
      paste_data_images: true,
      // paste_as_text: true,
      // paste_word_valid_elements: "b,strong,i,em,h1,h2",
      paste_retain_style_properties: "color font-size background-image background-size background-position",
      fullpage_default_encoding: "UTF-8",
      formats: {
        'alignleft': { 'selector': 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio', attributes: { "align": 'left' } },
        'aligncenter': { 'selector': 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio', attributes: { "align": 'center' } },
        'alignright': { 'selector': 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio', attributes: { "align": 'right' } },
        'alignfull': {
          'selector': 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio', attributes: {
            "align": 'justify'
          }
        }
      },
      file_browser_callback: function (field_name, url, pluginType, win) {
        // fileManagerMsg.setPreloader();
        fileManagerMsg.hideErrorMsg();

        if (pluginType === 'cetFile') {
          var fileSize = "9000000";

          fileManagerMsg.showDialogComment(translate("* accepted files (word, pdf, excel, power point) "));

          //cet.uploadfileapi.init(fileSize, 'xls');
          //cet.uploadfileapi.init(fileSize, 'pdf');
          //cet.uploadfileapi.init(fileSize, 'ppt');
          cet.uploadfileapi.init(fileSize, 'docx', 'text/plain');
          cet.uploadfileapi.uploadfile(
     function (data) {
       fileManagerMsg.removePreloader();
       if (data.code === 0) {//"Success"
         var src = data.value;
         if (document.getElementById(field_name)) {
           // put the url in the fild
           document.getElementById(field_name).value = src;

         }
       }
       else {
         // console.error(data.description);
         var errorMsg = translate("File exceeds 9 MB");
         if (!data.description) {
           var errorMsg = '';
         }
         fileManagerMsg.errorMsg(errorMsg)
       }
     });
        }


          //all file size <= 9MB  except image with 5120k 
        else if (pluginType === 'cetAudio') {
          var fileSize = "9000000";
          cet.uploadfileapi.init(fileSize, 'mp3', 'audio');
          cet.uploadfileapi.init(fileSize, 'mp4', 'audio');
          cet.uploadfileapi.init(fileSize, 'wav', 'audio');
          cet.uploadfileapi.uploadfile(
     function (data) {
       fileManagerMsg.removePreloader();
       if (data.code === 0) {//"Success"
         var src = data.value;
         if (document.getElementById(field_name)) {
           // put the url in the fild
           document.getElementById(field_name).value = src;

         }
       }
       else {
         // console.error(data.description);
         var errorMsg = translate("File exceeds 9 MB");
         if (!data.description) {
           var errorMsg = '';
         }
         fileManagerMsg.errorMsg(errorMsg)
       }
     });
        }

        else if (pluginType === 'cetKotarImg') {
          var fileSize = "5120000";//image :5120k 
          cet.uploadfileapi.init(fileSize, 'image', 'image');

          cet.uploadfileapi.uploadfile(
            function (data) {
              fileManagerMsg.removePreloader();
              if (data.code === 0) {//"Success"
                var src = data.value;
                if (document.getElementById(field_name)) {
                  // put the url in the fild
                  document.getElementById(field_name).value = src;

                }
              }
              else {
                // var errorMsg = data.description;
                var errorMsg = translate("File exceeds 5 MB");
                fileManagerMsg.errorMsg(errorMsg)
                //console.error(data.description);
              }
            });
        }
        else {
          fileManagerMsg.removePreloader();
        }
      },

      content_css: options.contentCss,//content_css
      init_instance_callback: readyHandler(this)
    };
    var tinyEditor = new tinymce.Editor(options.editorElement, tinyOptions, tinymce.EditorManager);

    tinyEditor.render();

  };


  return {
    getEditor: builder.getEditor,
    initPlugin: builder.initPlugin,
    addTransaltion: addTransaltion,
    getTranslation: getTranslation

  };



})();







cet.cetEditor.videoConverter = (function () {
  var EDIT_WIDTH = 409;//IMAGE PX
  var EDIT_HEIGHT = 279;//IMAGE PX
  var defaultThumbnail = "http://img.youtube.com/vi.jpg";


  function cleanVideo(args) {
    var element = args.element;
    var style = args.style;
    element.setAttribute('style', style);

  }

  function createThumbnail(args) {
    var element = args.element;
    var doc = args.doc;
    var videosrc = element.attributes.src.value;
    var videoType = getSite(videosrc);
    var image = document.createElement('img');
    image.style.height = EDIT_HEIGHT + "px";
    image.style.width = EDIT_WIDTH + "px";
    var dataStyle = getImageStyle(videosrc, videoType)+";cursor:pointer;";
    image.setAttribute('class', "mceNonEditable");
    image.setAttribute('height', EDIT_HEIGHT + "px");
    image.setAttribute('width', EDIT_WIDTH + "px");
    image.setAttribute('style', dataStyle);
    image.setAttribute('data-style', dataStyle);
    image.setAttribute('data-videosrc', videosrc);
    image.setAttribute('data-type', "iframe");
    image.setAttribute('data-name', 'cet_cetEditor_videoPlugin');
    image.setAttribute('data-mce-style', dataStyle);
    image.setAttribute('data-mce-object', "iframe");
    image.setAttribute('data-mce-p-src', videosrc);
    image.setAttribute('onclick', 'cet.cetEditor.plugins.video.play(this)', false);

    cet.cetEditor.commomn.replaceElement(args.doc, element, image);
    //removeAllAttrs(element);
    //var node = element;
    //if (node.tagName.toLowerCase() === 'iframe') {
    //  node = element.parentNode;
    //}
    //if (!node.childNodes[0]) {
    //  node.appendChild(document.createElement('p'));
    //}
    //node.replaceChild(image, node.childNodes[0]);
    //if (node.childNodes[1].tagName.toLowerCase() === 'iframe') {
    //  node.removeChild(node.childNodes[1]);
    //}
  }
  function getImageStyle(videosrc, videoType) {
    var style;
    var backgroundImg = 'background-image: url(http://cdn.cet.ac.il/libs/tinymce/4.1.10/plugins/cetVideo/image/playTransp45X45.svg),url(' + getThumbnail(videoType, videosrc) + ');';

    if (videoType === 'video.cet') {//cet thumbnail has play image so dont show the play extra btn imge
      backgroundImg += 'background-size: 0px 0px,' + EDIT_WIDTH + 'px ' + EDIT_HEIGHT + 'px;background-position: 0 0, 0 0;';
    }
    else {
      backgroundImg += 'background-size: 45px 45px,' + EDIT_WIDTH + 'px ' + EDIT_HEIGHT + 'px;background-position: 181px 118px, 0 0;';
    }

    style = "display: inline-block;background-repeat: no-repeat; " + backgroundImg + " width: " + EDIT_WIDTH + "px;height:" + EDIT_HEIGHT + "px;";

    return style;
  }

  //create image start

  function getYoutubeThumbnail(videoUrl) {

    var videoIdArr = videoUrl.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (!videoIdArr) {
      return defaultThumbnail;
    }
    var videoId = videoIdArr[1].replace("embed/", "");
    return "http://img.youtube.com/vi/" + videoId + "/0.jpg";
  }

  function getCetPlayerThumbnail(videoUrl) {
    if (videoUrl.indexOf('mediaserver') > -1) {    //'mediaserver.cet.ac.il'
      var imagUrl = videoUrl.replace("mediaserver", "storage");
      imagUrl = imagUrl.replace("videocontent", "VideoImages");
      imagUrl = imagUrl.replace(".mp4", ".jpg");


    }
    else {//'video.cet.ac.il'
      videoUrl = decodeURIComponent(videoUrl).toLowerCase();
      videoUrl = videoUrl.replace(/\\/g, "/");
      var xmlUrl = videoUrl.split("xmlconfigpath=")[1];
      var imagUrl = xmlUrl.split(".xml")[0];
      imagUrl = "http://storage.cet.ac.il/VideoImages/" + imagUrl + ".jpg";
      imagUrl = imagUrl.replace("_auto", "");

    }
    return imagUrl;
    return defaultThumbnail;// file was found

  }

  function getVimeoThumbnail(videoUrl) {
    var videoIdArr = videoUrl.match(/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
    if (!videoIdArr || videoIdArr.length < 2) {
      return defaultThumbnail;//return default grey image
    }
    return "https://i.vimeocdn.com/video/" + videoIdArr[videoIdArr.length - 1] + ".jpg";
  }


  function getThumbnail(videoType, videoUrl) {
    if (!videoType) {
      // fileManagerMsg.errorMsg(tinymce.translate("Invalid source, please replace it"))//defualt msg
      //  console.error("mutch video type didn't find")
      return false;
    }

    if (videoType === 'youtube') {
      return getYoutubeThumbnail(videoUrl);
    }
    else if (videoType === 'video.cet') {
      return getCetPlayerThumbnail(videoUrl);

    }
    else if (videoType === 'vimeo') {
      return getVimeoThumbnail(videoUrl);

    }
  }


  function getSite(str) {
    var siteName = "";
    if ((str.indexOf('video') > -1 || str.indexOf('mediaserver') > -1) && str.indexOf('cet') > -1) {
      siteName = "video.cet";
    }
    else if (str.indexOf('vimeo') > -1) {
      siteName = "vimeo";
    }
    else if (str.indexOf('youtu') > -1 || str.indexOf('youtube') > -1) {
      siteName = "youtube";
    }
    return siteName;
  }

  return {
    createThumbnail: createThumbnail,
    cleanVideo: cleanVideo,
  }
})();
cet.cetEditor.fileConverter = (function () {

  function fileStyle(args) {
    var element = args.element;
    element.setAttribute('style', args.style);
    element.firstChild.setAttribute('style', 'cursor: pointer; border: 0;');
    element.parentElement.setAttribute('style', 'display:block');
   
  }

  return {
    fileStyle: fileStyle,
  }

})();
cet.cetEditor.audioConverter = (function () {
  var PLAYER_WIDTH = 315;//IMAGE PX
  var PLAYER_HEIGHT = 37;//61;//IMAGE PX
  var PLAYER_STYLE = 'display: block;  margin-bottom: 20px;  height: ' + PLAYER_HEIGHT + 'px;  width: ' + PLAYER_WIDTH + 'px;  margin-right: 2px;border: solid transparent;border-width: 0 5px;';


  function createAudioImage(args) {
    var element = args.element;
    //var doc = args.doc;
    //var e = args.event;
    var DATA_UMAGE_PLACEHOLDER = "http://cdn.cet.ac.il/libs/cet.editorManager/1.0/images/soundPlayer_dis.png";
    var style = "display: block; margin-bottom: 20px; height: 37px; width: 315px; margin-right: 2px; border: solid transparent; border-width: 0 5px;";
    var image = args.doc.createElement('img');
    image.style.height = PLAYER_HEIGHT + "px";
    image.style.width = PLAYER_WIDTH + "px";
    var dataAudioSrc = element.attributes['data-src'] ? element.attributes['data-src'].value : element.attributes['src'].value;

    image.setAttribute('data-name', 'cet-cetEditor-audioPlugin');
    image.setAttribute('style', style);
    image.setAttribute('class', 'mceNonEditable');
    image.setAttribute('data-mce-style', style);
    image.setAttribute('data-mce-src', DATA_UMAGE_PLACEHOLDER);
    image.setAttribute('data-placeholder-src', DATA_UMAGE_PLACEHOLDER);
    image.setAttribute('data-src', dataAudioSrc);
    image.setAttribute('data-mce-p-src', dataAudioSrc);
    image.setAttribute('data-mce-p-controls', 'controls');
    image.setAttribute('data-mce-object', "audio");
    image.src = DATA_UMAGE_PLACEHOLDER;
    cet.cetEditor.commomn.replaceElement(args.doc, element, image);
    //cet.cetEditor.commomn.removeAllElement(doc, "cet-ui-soundplayer-controls");
    //cet.cetEditor.commomn.removeAllElement(doc, "cet-ui-timing");

  }
  function pasteHandler(args) {
    var element = args.element;
    var doc = args.doc;
    var e = args.event;
    createAudioImage(args);
    // var paragraph=document.createElement('p');

    removeAllAttrs(element);
    if (!element.childNodes[0]) {
      element.appendChild(document.createElement('p'));
    }
    element.replaceChild(image, element.childNodes[0]);
    e.content = domElement2string(doc);

  }
  function cleanAudio(args) {
    var element = args.element;
    var style = args.style;

    element.setAttribute('style', style);

  }

  return {
    pasteHandler: pasteHandler,
    createAudioImage: createAudioImage,
    cleanAudio: cleanAudio,
  }

})();


///#source 1 1 /libs/cet.editorManager/1.0/common.js
var cet = cet || {};
cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.commomn = cet.cetEditor.commomn || {};
cet.cetEditor.commomn = (function () {

  function iterateAllElement(elementSelector, handler, args) {//elementSelector='[data-name="cet-cetEditor-audioPlugin"]'
    var elements = args.doc.querySelectorAll(elementSelector);
    if (!elements || elements.length === 0) {
      return;
    }
    for (var i = 0; i < elements.length; i++) {
      args.element = elements[i];
      handler(args);
    }
  }

  function string2xml(html) {
    if (!html) {
      return "";
    }
    var doc;
    if (String(html) == "[object HTMLDocument]") {
      doc = html;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(html, "text/html");

    }
    return doc;
  }
  function removeAllAttrs(element) {
    for (var i = element.attributes.length; i-- > 0;)
      element.removeAttributeNode(element.attributes[i]);
  }

  function removeAllElement(doc, className) {
    var child = doc.getElementsByClassName(className);
    for (var i = 0; i < child.length; i++) {

      child[i].parentNode.removeChild(child[i]);
    }
  }

  function domElement2string(node) {
    if (typeof node === "string") {
      return node;
    }
    return node.body.innerHTML;
  }

  function replaceElement(doc, beforeElement, aftrElement) {
    var parentElement = beforeElement.parentNode;
    newElement = doc.createElement('p');
    parentElement.insertBefore(newElement, (parentElement.hasChildNodes()) ? beforeElement : null);
    newElement.appendChild(aftrElement);
    parentElement.removeChild(beforeElement);
  }

  return {
    iterateAllElement: iterateAllElement,
    string2xml: string2xml,
    removeAllAttrs: removeAllAttrs,
    removeAllElement: removeAllElement,
    domElement2string: domElement2string,
    replaceElement: replaceElement,
  }
})();
///#source 1 1 /libs/cet.editorManager/1.0/fileManagerMsg.js
var cet = cet || {};
cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.fileManagerMsg = cet.cetEditor.plugins.fileManagerMsg || {};

cet.cetEditor.plugins.fileManagerMsg = (function () {

  function setInvalidInputMsg(msg) {
    var errorMsg = "הקישור לא תקין, נא להזין קישור אחר";
    var dialogFooter = document.querySelector(".mce-foot");
    var dialogFooterHeight = dialogFooter.style.height
    var errorMsgDiv = document.querySelector("#errorMsgDiv");
    if (!errorMsgDiv) {
      var errorMsgDiv = document.createElement("div");
      errorMsgDiv.id = "errorMsgDiv";
      if (!msg) {
        msg = errorMsg;
      }
      errorMsgDiv.innerText = msg;//msg;TODO UTF-8

      dialogFooter.appendChild(errorMsgDiv);
      errorMsgDiv.style.cssText = 'height:' + dialogFooterHeight;
      errorMsgDiv.style.cssText = 'position: absolute;width: 57%;right: 20px;color: red;text-align: right;bottom: 1px;  line-height: 46px;';//TODO:put in css

    }
    else {//errorMsgDiv element exist
      var errorMsgDiv = document.querySelector("#errorMsgDiv");
      errorMsgDiv.style.visibility = "visible";
      if (!msg) {
        msg = errorMsg;
      }
      errorMsgDiv.innerText = msg;
    }

  }

  function hideInvalidInputMsg() {
    var errorMsgDiv = document.querySelector("#errorMsgDiv");
    if (errorMsgDiv) {

      errorMsgDiv.style.visibility = "hidden";
    }
  }

  function setPreloader() {
    var insertButton = document.querySelector("#cet__cetEditor-insertButton");
    if (!insertButton) {
      return;
    }
    insertButton.setAttribute('style', insertButton.getAttribute('style') + 'width:57.25px');
    var insertButtonchild = insertButton.querySelector("#cet__cetEditor-insertButton >button");
    insertButtonchild.className = 'cet_cetEditor_preloder';//cet__cetEditor-hideText
    insertButtonchild.firstChild.data = '';

  }


  function removeDialogPreloader(textInsertCallback) {
    var insertButton = document.querySelector("#cet__cetEditor-insertButton");
    if (!insertButton) {
      return;
    }
    var insertButtonchild = insertButton.querySelector("#cet__cetEditor-insertButton >button");
    insertButtonchild.classList.remove("cet_cetEditor_preloder");
    // insertButtonchild.classList.remove("cet__cetEditor-hideText");
    //  textInsertCallback(insertButtonchild.firstChild.data)
    insertButtonchild.firstChild.data = tinymce.translate('Insert');

  }

  function showDialogComment(msg) {
    var dialog = document.querySelector('[role="dialog"].mce-window');
    if (document.querySelector('.dialogComment')) {
      return;
    }
    var dialogComment = document.createElement("span");
    dialogComment.className = "dialogComment";
    dialogComment.style.cssText = "position: absolute;  right: 6px;  bottom: 53px;  font-size: 11px; color: rgb(143, 149, 154);";
    dialogComment.innerHTML = msg;
    dialog.insertBefore(dialogComment, (dialog.hasChildNodes()) ? dialog.childNodes[0] : null);

  }

  return {
    errorMsg: setInvalidInputMsg,
    hideErrorMsg: hideInvalidInputMsg,
    setPreloader: setPreloader,
    removePreloader: removeDialogPreloader,
    showDialogComment: showDialogComment,

  }


})();
///#source 1 1 /libs/cet.editorManager/1.0/pluginsViewManager.js
var cet = cet || {};

cet.pluginsViewManager = (function () {
  "use strict";

  var pluginRenderList = [];

  function onRender(func) {
    pluginRenderList.push(func);
  }

  //param string represent html 
  function render(_html) {
    if (!_html) {
      return "";
    }
    if(!pluginRenderList){
      return "";
    }
    for (var i = 0; i < pluginRenderList.length; i++) {
      _html = pluginRenderList[i](_html);
    }
    return cet.cetEditor.commomn.domElement2string(_html);//return renderd html
  }


  //function domElement2string(node) {//TODO: duplacate function.....
  //  cet.cetEditor.commomn.domElement2string(node);
  //}
  return {
    onRender: onRender,
    render: render,
   // domElement2string:domElement2string,
  }

})(); 
///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/audio.js
var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.audio = cet.cetEditor.plugins.audio || {};


cet.cetEditor.plugins.audio.view = (function () {

  "use strict";

  var PLAYER_WIDTH = 315;
  var PLAYER_HEIGHT = 61;//IMAGE PX
  function render(htmlString) {

    if (!htmlString) {
      return "";
    }
    var doc;
    if (String(htmlString) == "[object HTMLDocument]") {
      doc = htmlString;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(htmlString, "text/html");

    }

    // var imageElements = doc.querySelectorAll('[data-name="cet-cetEditor-audioPlugin"]');
    var imageElements = doc.querySelectorAll('audio');

    for (var i = 0; i < imageElements.length; i++) {
      //imageElements[i].style.opacity = 0;
      //  imageElements[i].removeAttribute('controls');
      imageElements[i].style.width = PLAYER_WIDTH + "px";
      imageElements[i].style.height = PLAYER_HEIGHT + "px";
      imageElements[i].setAttribute('width', PLAYER_WIDTH + "px");
      imageElements[i].setAttribute('height', PLAYER_HEIGHT + "px");
      //imageElements[i].setAttribute('onloadeddata', 'cet.cetEditor.plugins.audio.view.set(this)');
      //imageElements[i].setAttribute('onerror', 'cet.cetEditor.plugins.audio.view.error("error")');
      //imageElements[i].setAttribute('onabort', 'cet.cetEditor.plugins.audio.view.error("abrot")');
      //imageElements[i].setAttribute('onsuspend', 'cet.cetEditor.plugins.audio.view.error("suspend")');
      //imageElements[i].setAttribute('onstalled', 'cet.cetEditor.plugins.audio.view.error("stalled")');


    }
    return doc;
  }

  function setCetSoundplayer(element) {
    var parentElement = element.parentNode;
    if (parentElement) {

      parentElement.style.width = PLAYER_WIDTH + "px";
      parentElement.style.marginBottom = "6px";
      parentElement.style.marginRight = "5px";
      parentElement.setAttribute("data-name", "cet-cetEditor-audioPlugin");
      copyElementAttributes(element, parentElement);
      var myplayer = new cet.ui.soundplayer.soundplayer({ url: encodeURI(element.attributes["src"].value), autoplay: false }, $(parentElement));
      parentElement.removeChild(element);
    }
    else {
      console.error('parentElement null')
    }

  }

  function copyElementAttributes(originalElement, newElement) {

    for (var i = 0; i < originalElement.attributes.length; i++) {
      var attr = originalElement.attributes.item(i);
      newElement.setAttribute(attr.nodeName, attr.nodeValue);
    }
  }


  function errorLoading(e) {

    console.log(e)
  }

  cet.pluginsViewManager.onRender(render);

  return {
    set: setCetSoundplayer,
    error: errorLoading,
  }
})();

///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/file.js


var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.commomn = cet.cetEditor.commomn || {};
cet.cetEditor.plugins.file = cet.cetEditor.plugins.file || {};
cet.cetEditor.plugins.file.common = cet.cetEditor.plugins.file.common || {};
cet.cetEditor.plugins.file.common.private = cet.cetEditor.plugins.file.common.private || {};



cet.cetEditor.plugins.file.view = (function () {

  "use strict";

  function render(htmlString) {
    if (!htmlString) { 
      return "";
    }
    var doc;
    if (String(htmlString) == "[object HTMLDocument]") {
      doc = htmlString;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(htmlString, "text/html");

    }
    var BASIC_FILE_STYLE = 'cursor: default;';
    var elementSelector = '[data-name="cet_cetEditor_filePlugin"]';
    var elements = doc.querySelectorAll(elementSelector);
    if (elements && elements.length > 0) {
      var args = { doc: doc, style: BASIC_FILE_STYLE };
      var fileConverter = cet.cetEditor.fileConverter;
      cet.cetEditor.commomn.iterateAllElement(elementSelector, fileConverter.fileStyle, args);

    }

    return doc;
  }



  cet.pluginsViewManager.onRender(render);


})();

///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/image.js
var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.img = cet.cetEditor.plugins.img || {};
cet.cetEditor.plugins.img.common = cet.cetEditor.plugins.img.common || {};
cet.cetEditor.plugins.img.common.private = cet.cetEditor.plugins.img.common.private || {};



cet.cetEditor.plugins.img.view = (function () {

  "use strict";

  function render(htmlString) {
    if (!htmlString) {
      return "";
    }
    var doc;
    if (String(htmlString) == "[object HTMLDocument]") {
      doc = htmlString;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(htmlString, "text/html");

    }
    //imageElements to zoom onklick
    var imageElements = doc.querySelectorAll('[data-name="cet_cetEditor_zoomImgPlugin"]');
    //if (!imageElements || imageElements.length === 0) {//case sensitive

    //  var imageElements = doc.querySelectorAll('[data-name="cet_ceteditor_zoomimgplugin"]');
    //}
    for (var i = 0; i < imageElements.length; i++) {
      if (!imageElements[i].hasAttribute('onclick')) {

        imageElements[i].setAttribute('onclick', 'cet.cetEditor.plugins.img.view.zoom(this)');//TODO function(this){zoom(this)}
        imageElements[i].setAttribute('style', ' cursor: pointer;max-width:315px;max-height:215px;');

      }
    }
    return doc;
  }

  function imageClickHandler(element) {
    var commonFuncs = cet.cetEditor.plugins.img.common.private;
    //  var zoomId = element.getAttribute('id');
    var imgDetail = getImageDetails(element)
    addZoomModeScreen();
    var body = document.querySelector("body");//TODO not working!!!!!
    body.onresize = function () {
      if (document.querySelector('.cet_cetEditor_centerZoomImg')) {

        var newSize = commonFuncs.recalcSize(imgDetail.width, imgDetail.height, "view");
        commonFuncs.showImgNewSize(imgDetail.src, newSize, '.cet-cetEditor-darkScreen');
      }
    };
    var newSize = commonFuncs.recalcSize(imgDetail.width, imgDetail.height, "view");
    commonFuncs.showImgNewSize(imgDetail.src, newSize, '.cet-cetEditor-darkScreen', removePreloder);
  }

  function getImageDetails(element) {
    // var src = element.getAttribute('data-originalSrc');
    var src = element.getAttribute('src');
    var originalwidth = Number(element.getAttribute('data-originalwidth'));
    var originalHeight = Number(element.getAttribute('data-originalHeight'));
    var imgDetail = { element: element, src: src, width: originalwidth, height: originalHeight };
    return imgDetail;
  }

  //adding dark screen, that the image will shown on it.
  function addZoomModeScreen() {
    var body = document.querySelector("body");
    var bodyChild = body.firstChild
    if (body.firstChild.className !== "cet-cetEditor-darkScreen") {
      var darkScreen = document.createElement("div");
      darkScreen.className = "cet-cetEditor-darkScreen";
      body.insertBefore(darkScreen, (body.hasChildNodes()) ? bodyChild : null);
      darkScreen.style.cssText = 'position: fixed;width: 100%;height: 100%;background-color: #000;z-index: 6000;opacity: 0.75;border-radius: 4px;';
      darkScreen.style.cssText += 'top:0;  left: 0;';
      addPreloder(darkScreen);
    }
    else {
      var darkScreen = document.getElementsByClassName("cet-cetEditor-darkScreen")[0];
    }
    darkScreen.onclick = function () {
      var closeZoomImg = document.getElementsByClassName("cet_cetEditor_closeZoomImg")[0];
      closeZoomImg.click();
    }
  }

  function addPreloder(element) {
    var preloder = document.createElement("div");
    preloder.className = 'cet_cetEditor_preloder_view';
    element.appendChild(preloder);
    preloder.style.cssText += 'position: fixed;z-index: 6001;';
    preloder.style.cssText += '   margin:auto;left: 0;right: 0;  top: 0;bottom: 0;';


  }

  function removePreloder() {
    var preloder = document.getElementsByClassName("cet_cetEditor_preloder_view");
    preloder[0].style.visibility = 'hidden';
  }

  cet.pluginsViewManager.onRender(render);

  return {
    zoom: imageClickHandler

  }
})();

///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/imageViewAndEditCommon.js
var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.img = cet.cetEditor.plugins.img || {};
cet.cetEditor.plugins.img.common = cet.cetEditor.plugins.img.common || {};

cet.cetEditor.plugins.img.common.private = (function () {
  var VIEW_HEIGHT = 768;//IMAGE PX  
  var VIEW_WIDTH = 1024;//IMAGE PX
  var EDIT_WIDTH = 315;//IMAGE PX
  var EDIT_HEIGHT = 215;//IMAGE PX
  var VIEW_LIMITS = 70;

  function showImgNewSize(src, newSize, elementClass, removePreloader) {
    var image = document.createElement('img');

    var element = document.querySelector('body');
    var elementChild = element.firstChild

    //create center div that contain the image

    if (!elementChild || element.firstChild.className !== "cet_cetEditor_centerZoomImg") {
      var centerZoomImg = document.createElement("div");
      centerZoomImg.className = "cet_cetEditor_centerZoomImg";
      element.insertBefore(centerZoomImg, elementChild);
      if (newSize) {
        centerZoomImg.style.cssText = 'position: fixed;width:' + newSize.width + 'px ;height:' + newSize.height + 'px;z-index: 6002;';

      }
      else {
        centerZoomImg.style.cssText = 'position: fixed;z-index: 6002;';
      }
      centerZoomImg.style.cssText += '   margin:auto;left: 0;right: 0;  top: 0;bottom: 0;';//make it center css
      centerZoomImg.appendChild(image);
      image.onload = function () {
        if (!newSize) {
          newSize = recalcSize(this.width, this.height, 'view');
          centerZoomImg.style.height = newSize.height + "px";
          centerZoomImg.style.width = newSize.width + "px";
          centerZoomImg.setAttribute('width', newSize.width + "px");
          centerZoomImg.setAttribute('height', newSize.height + "px");
          image.src = getSrc(image.src, newSize);
        //  elementChild.firstChild.src = image.src;
        }

        if (removePreloader && newSize) {

          removePreloader();
        }
      }
      //creat close img button
      //if (!document.querySelector('.cet_cetEditor_centerZoomImg')) {

      //}
      var closeButton = document.createElement("div");
      closeButton.className = "cet_cetEditor_closeZoomImg";
      centerZoomImg.appendChild(closeButton);

      // centerZoomImg.style.cssText += 'color: #fff;cursor: pointer;display: block;float: none;height: 100px;position: fixed;right: 0px;top: 0px;width: 100px;z-index: 6086;';

      //close zooming img and remove basckgrond and img elements 
      closeButton.onclick = (function (element, centerZoomImg, image) {
        return function () {
          element.style.cssText = 'overflow:visible';
          centerZoomImg.removeChild(image);
          element.removeChild(centerZoomImg);
          var darkScreen = document.querySelector('.cet-cetEditor-darkScreen');
          element.removeChild(darkScreen);
        }
      })(element, centerZoomImg, image);



    }
    else {//replace src of exist image with new one
      image.onload = function () {
        var centerZoomImg = document.querySelector('.cet_cetEditor_centerZoomImg');

        if (!newSize) {
          newSize = recalcSize(this.width, this.height, 'view');
        }
        //centerZoomImg.style.height = newSize.height + "px";
        //centerZoomImg.style.width = newSize.width + "px"
        centerZoomImg.setAttribute('width', newSize.width + "px");
        centerZoomImg.setAttribute('height', newSize.height + "px");
        image.src = getSrc(image.src, newSize);
        elementChild.firstChild.src = image.src;

      }
    }
    image.src = getSrc(src, newSize);
  }

  function getSrc(src, newSize) {
    //if the image is from imageResize db so only change the height and width
    if (String(src).indexOf("api.assets.cet.ac.il/imageResize") > -1) {
      var regexWidth = new RegExp(/\b&w\S+?&/);
      var regexHeight = new RegExp(/\b&h\S+?&/);
      if (newSize) {
        src = String(src).replace(regexWidth, "&w=" + newSize.width + "&");
        src = String(src).replace(regexHeight, "&h=" + newSize.height + "&");
      }
      return src;
    }

    if (src.indexOf(location.protocol) < 0)
    {
        src = location.protocol + src;
    }

    if (!newSize) {
        return "https://api.assets.cet.ac.il/imageResize.ashx?p=1&url=" + src
    }
    //else create new imageResize src and returns it.
    return "https://api.assets.cet.ac.il/imageResize.ashx?p=1&url=" + src + "&w=" + newSize.width + "&h=" + newSize.height + "&m=crop";//USING IMAGE RESIZE API
  }

  function calcViewMaxLimits(clientScreenSize, originalSize) {
    var newSize = Number(clientScreenSize) - 2 * Number(VIEW_LIMITS);
    return newSize;

  }

  function recalcSize(width, height, mode) {
    var maxWidth, maxHeight, newWidth, newHeight;
    if (!width || !height) {
      return;
    }
    width = Number(width);
    height = Number(height);
    newHeight = height;
    newWidth = width;

    var body = document.body,
    html = document.documentElement;

    maxWidth = (mode === 'edit') ? EDIT_WIDTH : calcViewMaxLimits(html.clientWidth, width);
    maxHeight = (mode === 'edit') ? EDIT_HEIGHT : calcViewMaxLimits(html.clientHeight, height);

    //if (mode === 'view') {
    //  console.log("maxWidth: ", maxWidth);
    //  console.log("maxHeight: ", maxHeight);

    //}

    if (width && height && maxWidth && maxHeight) {
      if (width > maxWidth) {
        newHeight = Math.round((maxWidth / width) * height);
        height = newHeight;
        newWidth = maxWidth;

      } if (height > maxHeight) {
        newWidth = Math.round((maxHeight / height) * newWidth);
        newHeight = maxHeight;
      }

    }

    var size = { width: newWidth, height: newHeight };
    return size;
  }
  return {
    showImgNewSize: showImgNewSize,
    getSrc: getSrc,
    recalcSize: recalcSize

  }
})();
///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/link.js
var a;
var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.link = cet.cetEditor.plugins.link || {};
cet.cetEditor.plugins.link.common = cet.cetEditor.plugins.link.common || {};
cet.cetEditor.plugins.link.common.private = cet.cetEditor.plugins.link.common.private || {};



cet.cetEditor.plugins.link.view = (function () {

  "use strict";

  var PLAYER_WIDTH = 315;

  function render(htmlString) {

    if (!htmlString) {
      return "";
    }
    var doc;
    if (String(htmlString) == "[object HTMLDocument]") {
      doc = htmlString;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(htmlString, "text/html");

    }
    var imageElements = doc.querySelectorAll('[data-name="cet-cetEditor-linkPlugin"]');

    for (var i = 0; i < imageElements.length; i++) {
      imageElements[i].setAttribute('target', 'blank');


    }
    return doc;
  }


  cet.pluginsViewManager.onRender(render);


})();

///#source 1 1 /libs/cet.editorManager/1.0/kotarPluginsView/video.js
var cet = cet || {};

cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};
cet.cetEditor.plugins.video = cet.cetEditor.plugins.video || {};
cet.cetEditor.videoConverter = cet.cetEditor.videoConverter || {};
cet.cetEditor.commomn = cet.cetEditor.commomn || {};


cet.cetEditor.plugins.video = (function () {

  "use strict";

  var videoConverter = cet.cetEditor.videoConverter;
  function render(htmlString) {
    if (!htmlString) {
      return "";
    }


    var doc;
    if (String(htmlString) == "[object HTMLDocument]") {
      doc = htmlString;
    }
    else {
      var parser = new DOMParser();
      doc = parser.parseFromString(htmlString, "text/html");

    }


    //var doc = cet.cetEditor.commomn.string2xml(htmlString);
    var videoConverter = cet.cetEditor.videoConverter;
    var args = { doc: doc };
    cet.cetEditor.commomn.iterateAllElement('iframe', videoConverter.createThumbnail, args);

    return doc;
  }

  //create image end



  function videoClickHandler(element) {
    element.style.cursor = 'wait';
    var videoDetails = getVideoDetails(element);
    var iframe = getIframe(videoDetails);
    if (!iframe) {
      console.error("ifram creation failes!! ")
      return;
    }
    // Replaces placeholder images with real elements for video, object, iframe etc
    var parentDiv = element.parentNode;
    cloneComputedStyle(element, iframe)
    parentDiv.replaceChild(iframe, element);

  }

  //set style of one element to another
  function cloneComputedStyle(from, to) {
    var cs = false;
    if (from.currentStyle)
      cs = from.currentStyle;
    else if (window.getComputedStyle)
      cs = document.defaultView.getComputedStyle(from, null);
    if (!cs)
      return null;
    for (var prop in cs) {
      if (cs[prop] != undefined && cs[prop].length > 0 && typeof cs[prop] !== 'object' && typeof cs[prop] !== 'function' && prop != parseInt(prop)) {
        to.style[prop] = cs[prop];

      }
    }
  }

  function getVideoDetails(videoElement) {
    var src = videoElement.getAttribute('data-videoSrc');
    if (!src) {
      var src = videoElement.getAttribute('data-videosrc');
    }
    var originalwidth = Number(videoElement.getAttribute('width'));
    var originalHeight = Number(videoElement.getAttribute('height'));
    var type = videoElement.getAttribute('data-type');

    var imgStyle = videoElement.getAttribute('style');
    var videoDetails = {
      src: src,
      type: type,
      width: originalwidth,
      height: originalHeight,
      dataStyle: imgStyle
    };
    return videoDetails;
  }

  //adding dark screen, that the image will shown on it.
  function getIframe(video) {
    console.log("view.js video")
    if (video.type == "iframe") {
      var iframe = document.createElement("IFRAME");
      //video.src in vimeo gets more param: so cleaning them
      if (video.src.indexOf("?") > -1 && video.src.indexOf("video.cet.ac.il") === -1) {
        video.src = video.src.split("?")[0];
      }
      iframe.setAttribute("src", video.src + "?autoplay=1&wmode=transparent");
      iframe.setAttribute("width", video.width);
      iframe.setAttribute("height", video.height);
      iframe.setAttribute('allowfullscreen', '1');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('data-name', 'cet_cetEditor_videoPlugin');

      iframe.setAttribute('data-style', video.dataStyle);
      iframe.setAttribute('data-videosrc', video.src);

      return iframe;
    }
    return false;

  }

  cet.pluginsViewManager.onRender(render);

  return {
    play: videoClickHandler

  }
})();







///#source 1 1 /libs/cet.editorManager/1.0/uploadFile.js
var cet = cet || {};

cet.uploadfileapi = cet.uploadfileapi || {};
cet.cetEditor = cet.cetEditor || {};
cet.cetEditor.plugins = cet.cetEditor.plugins || {};


(function (uploadfileapi) {

  var onSuccess = null;


  function init(maxFileSize, callBackID, acceptedFileType) {
    // removeElement(document.getElementsByClassName('file-upload-input-class'));
   

    removeElement(document.getElementsByClassName('iFrame_fileUpload-class'));
    removeElement(document.getElementsByClassName('file-upload-form-class'));
    var form = document.createElement("form");
    form.setAttribute("id", "file-upload-form");
    form.setAttribute("class", "file-upload-form-class");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://api.assets.cet.ac.il/filesUpload.ashx?" + "maxfilesize=" + maxFileSize + "&callbackid=" + callBackID);
    form.setAttribute("target", "iFrame_fileUpload");

    var input = document.createElement("input");
    input.setAttribute("id", "inputImage");
    input.setAttribute("class", "file-upload-input-class");
    input.setAttribute("name", "file");
    input.setAttribute("type", "file");
    input.setAttribute("accept", acceptedFileType + "/*");
    // input.setAttribute("accept", "*");
    input.setAttribute("style", "visibility: hidden; width:0; height:0;");

    form.appendChild(input);

    var iframe = document.createElement("iframe");
    iframe.setAttribute("name", "iFrame_fileUpload");
    iframe.setAttribute("class", "iFrame_fileUpload-class");
    iframe.setAttribute("style", "visibility: hidden; width:0; height:0;");


    document.body.appendChild(form);
    document.body.appendChild(iframe);

    document.addEventListener("change", _onFileChanged);
    window.addEventListener('message', _onMessage);

  }

  function removeElement(fileUpload) {
    if (fileUpload) {
      while (fileUpload[0])
        fileUpload[0].parentNode.removeChild(fileUpload[0]);
    }
  }

  function uploadfile(callback) {
    onSuccess = callback;
    var inputElem = document.getElementById("inputImage");
    inputElem.click();
  }

  function _onFileChanged(e) {
    var fileManagerMsg = cet.cetEditor.plugins.fileManagerMsg;
    fileManagerMsg.setPreloader();
    document.getElementById("file-upload-form").submit();
  }

  function _onMessage(e) {
    var data = null;
    var resultJSON = new Object();

    if ((typeof (e.data) === 'string') && (e.data.substring(0, 11) === 'file-upload')) {

      var json = e.data.substring(e.data.indexOf(':') + 1);
      var fileInfo = JSON.parse(json);

      if (fileInfo.files[0] !== undefined) {
        if (fileInfo.files[0].errorCode === 'file_too_big') {
          resultJSON.ok = false;
          resultJSON.code = 1;
          resultJSON.description = "File is too big";
          resultJSON.value = null;

        }
        else {
          var fileType = fileInfo.files[0].type.substring(0, 5);
          if (e.data.search("\"type\":\"" + fileType) == -1) {
            resultJSON.ok = false;
            resultJSON.code = 2;
            resultJSON.description = "Wrong file type";
            resultJSON.value = null;

          } else {
            var value = "\"value\":" + "\"" + fileInfo.files[0].url + "\"";
            resultJSON.ok = true;
            resultJSON.code = 0;
            resultJSON.description = "Success";
            resultJSON.value = fileInfo.files[0].url;
          }
        }
      }

      data = resultJSON;

      if (onSuccess != null) {
        onSuccess(data);
      }
    }
  }

  uploadfileapi.init = init;
  uploadfileapi.uploadfile = uploadfile;

})(cet.uploadfileapi || (cet.uploadfileapi = {}));

///#source 1 1 /libs/cet.editorManager/1.0/langs/ar.js
cet.editorMananger.addTransaltion('ar', {
  "Image": "Image",
  "File exceeds 9 MB": "حجم الملف أكبر من 9 ميغا",
  "File exceeds 5 MB": "حجم الملف أكبر من 5 ميغا"
});

///#source 1 1 /libs/cet.editorManager/1.0/langs/en.js
cet.editorMananger.addTransaltion('en', {
  "Image":"Image",
  "File exceeds 9 MB": "File exceeds 9 MB",
  "File exceeds 5 MB": "File exceeds 5 MB",
  "* accepted files (word, pdf, excel, power point) ": "* accepted files (word, pdf, excel, power point) ",


});
///#source 1 1 /libs/cet.editorManager/1.0/langs/he.js
cet.editorMananger.addTransaltion('he', {
  "Image": "תמונה",
  "File exceeds 9 MB": "הקובץ חורג מ- 9 מגה",
  "File exceeds 5 MB": "הקובץ חורג מ- 5 מגה",
  "* accepted files (word, pdf, excel, power point) ": "(word, pdf, excel, power point) העלאת קבצי*"

});

///#source 1 1 /libs/cet.editorManager/1.0/langs/zh.js
cet.editorMananger.addTransaltion('zh', {
  "Image":"Image",
  "File exceeds 9 MB": "File exceeds 9 MB",
  "File exceeds 5 MB": "File exceeds 5 MB",
  "* accepted files (word, pdf, excel, power point) ": "* accepted files (word, pdf, excel, power point) ",


});
