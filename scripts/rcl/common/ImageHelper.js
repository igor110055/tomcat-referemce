/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

/**
* @fileoverview
* @author Lance Hankins
* @version $Id: $
*
* Helper class for wokring with images
*
**/


//-----------------------------------------------------------------------------
/**
* Helper class for wokring with images (e.g. preload certain images)
* @constructor
* @class
**/
function ImageHelper()
{
   this.imagesToPreLoad = new Object();
}

ImageHelper.instance = new ImageHelper();



/**
 * @param aImages - a single URL or array of URL's for images to pre-load
 **/
ImageHelper.registerForPreLoad = function (aImages)
{
   var imagesToAdd = JsUtil.isArray(aImages) ? aImages : $A(aImages);

   imagesToAdd.each(function (anImageUrl) {
      ImageHelper.instance.imagesToPreLoad[anImageUrl] = true;
   });
};

/**
 * @private inserts hidden div with refs to all images that
 * need to be pre-loaded...
 **/
ImageHelper._preLoadRegisteredImages = function ()
{
   var id = 'ImageHelper_preLoadImagesDiv';

   if (!$(id))
   {
      var div = document.createElement("div");
      div.id = id;
      div.style.display = 'none';


      var html = '';
      var key;

      for (key in ImageHelper.instance.imagesToPreLoad)
      {
         html += '<img alt="preload" src="' + key + '"/>';
      }

      div.innerHTML = html;
      document.body.appendChild(div);
   }
};



//--- pre-load images at document load time...
DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
   ImageHelper._preLoadRegisteredImages();
});
