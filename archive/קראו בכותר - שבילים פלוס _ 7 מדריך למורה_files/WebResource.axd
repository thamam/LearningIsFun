/*
CetClientScript utill
Ver 1.0
*/

var cet = cet || {};
cet.clientScriptManager = function ()
{
  var ver = '1.0.0';
  var jsType = 'text/javascript';
  var cssRelative = 'stylesheet';
  var cssLinkType = 'text/css';
  var scriptIdInHtmlBody = 'CetClientResourceScript';
  var existingJsCollection = null;
  var existingCssCollection = null;


  function loadJavaScriptInHead(url)
  {
    if (typeof (url) == 'undefined' || url.length <= 0)
      return;

    var jsLinks = getExistingJSReference();
    if (jsLinks != null && jsLinks.length > 0)
    {
      //Check if current JS url exists in head
      //If exists skeep
      for (var i = 0; i < jsLinks.length; i++)
      {
        var jsEl = jsLinks[i];
        if (jsEl.getAttribute('src') != null && jsEl.getAttribute('src') == url)
          return;
      }
    }

    //debugger;
    //Create JS script tag dom
    var scriptReff = document.createElement("script")
    scriptReff.setAttribute('src', url)
    scriptReff.setAttribute('type', jsType);

    //Append head collection
    if (typeof (scriptReff) != "undefined")
      getHeadObj().appendChild(scriptReff)
  }

  function loadCssInHead(url)
  {
    if (typeof (url) == 'undefined' || url.length <= 0)
      return;

    var cssLinks = getExistingCssLinks();
    if (cssLinks != null && cssLinks.length > 0)
    {
      for (var i = 0; i < cssLinks.length; i++)
      {
        var linkEl = cssLinks[i];
        if (linkEl.getAttribute('href') == url)
          return;
      }
    }

    //debugger;
    var cssLinkRef = document.createElement("link");
    cssLinkRef.setAttribute('href', url);
    cssLinkRef.setAttribute('rel', cssRelative);
    cssLinkRef.setAttribute('type', cssLinkType);

    if (typeof (cssLinkRef) != "undefined")
      getHeadObj().appendChild(cssLinkRef)
  }

  function getExistingCssLinks()
  {
    if (existingCssCollection != null)
      return existingCssCollection;

    //get existing css registrations
    var headObj = document.getElementsByTagName("head")[0];
    if (typeof (headObj) == 'undefined')
      return null;

    //    var cssLinks = headObj.getElementsByTagName('link');
    //    return cssLinks;
    existingCssCollection = headObj.getElementsByTagName('link');
    return existingCssCollection;
  }


  function getExistingJSReference()
  {
    if (existingJsCollection != null)
      return existingJsCollection;

    var headObj = document.getElementsByTagName("head")[0];
    if (typeof (headObj) == 'undefined')
      return null;

    var jsLinks = headObj.getElementsByTagName('script');
    if (jsLinks != null)
    {
      var aJsLinks = new Array();
      for (var i = 0; i < jsLinks.length; i++)
      {
        aJsLinks.push(jsLinks[i]);
      }
      jsLinks = new Array()
      jsLinks = aJsLinks;
    }
    else
      jsLinks = new Array();

    //get script inside html body
    var scriptCollectionInHtml = document.getElementsByTagName('script');
    if (scriptCollectionInHtml != null)
    {
      for (var i = 0; i < scriptCollectionInHtml.length; i++)
      {
        var el = scriptCollectionInHtml[i];
        var id = el.getAttribute('id');
        var src = el.getAttribute('src');
        if (id == scriptIdInHtmlBody && (typeof (src) != 'undefined' && src != null))
          jsLinks.push(el);
      }
    }
    existingJsCollection = jsLinks;
    return existingJsCollection;
    //return jsLinks;
  }

  function getHeadObj()
  {
    return document.getElementsByTagName("head")[0];
  }


  //public methods
  return {
    loadCss: function (urlCollection)
    {
      if (typeof (urlCollection) != 'undefined')
      {
        if (urlCollection.length > 0)
        {
          for (var i = 0; i < urlCollection.length; i++)
            loadCssInHead(urlCollection[i]);
        }
      }
    },

    loadJs: function (urlCollection)
    {

      if (typeof (urlCollection) != 'undefined')
      {
        if (urlCollection.length > 0)
        {
          for (var i = 0; i < urlCollection.length; i++)
          {
            loadJavaScriptInHead(urlCollection[i]);
          }
        }
      }
    }
  };

} ();




