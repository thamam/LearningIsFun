/**  Minification & Merging Summary: 
     - 3eaa056b1604a912351fae6b0e5f6e82 Added by: CET.ClientResourcesManager.ClientResourcesModule Void BeginRequest(System.Object, System.EventArgs)
     - bf9d8da7fe29dd72a4344b7cf4c03eac Added by: KotarApp_Viewer Void OnLoad(System.EventArgs)
**/

/** ========== 3eaa056b1604a912351fae6b0e5f6e82 Added by: CET.ClientResourcesManager.ClientResourcesModule Void BeginRequest(System.Object, System.EventArgs) ========== **/
var CETHandler=new function(){var a=new Array();a.push({id:"44ecde82-9728-47b7-a808-009e8a6148be",name:"CET.ClientResourcesManager.ClientResourcesServingHandler"});a.push({id:"e1bb3c16-0e6a-49b4-a953-f8be39461b1b",name:"CET.Logger.ErrorImagesHandler"});this.BuildUrlByName=function(f,e){for(var c=0;c<a.length;c++){var d=a[c];if(d.name==f){return b(d,e);}}return null;};this.BuildUrlByID=function(f,e){for(var c=0;c<a.length;c++){var d=a[c];if(d.id==f){return b(d,e);}else{return b({id:f,name:""},e);}}return null;};function b(c,d){var e="/CETHandler.ashx?n="+c.name+"&i="+c.id;if(typeof d!="undefined"){if(d[0]=="&"||d[0]=="?"){d=d.substr(1,d.length-1);}e+=("&"+d);}return e;}};

/** ========== bf9d8da7fe29dd72a4344b7cf4c03eac Added by: KotarApp_Viewer Void OnLoad(System.EventArgs) ========== **/
function uploaderResources(){}uploaderResources.pendingUploadesMessage="מעלה {0} קובץ/קבצים...";uploaderResources.uploadingFileMessage="מעלה את {0}";uploaderResources.downloadTooltip="הורד את {0}";uploaderResources.notAllowedExtensionMessage="סיומת קובץ לא חוקית";uploaderResources.removeButtonText="הסר";uploaderResources.attach="צרף";uploaderResources.files="קבצים";uploaderResources.images="תמונות";uploaderResources.urls="קישורים";uploaderResources.videos="סרטים";uploaderResources.audios="קבצי קול";uploaderResources.audio_play="נגן";uploaderResources.audio_pause="השהה";uploaderResources.audio_stop="עצור";uploaderResources.richuploaderuploadtooltip="מסמכים, תמונות וקבצי קול";

/** Created in 109.3738 ms **/
