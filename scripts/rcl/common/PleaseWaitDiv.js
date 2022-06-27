function PleaseWaitDiv( aBackgroundDivId, aDisplayMessage, aDocument)
{
	this.backgroundDivId = aBackgroundDivId;
	this.displayMessage = aDisplayMessage;

   this.domElement = null;

   this.document = (aDocument ? aDocument : document);
}

/**
 * show the please wait div...
 **/
PleaseWaitDiv.prototype.begin = function()
{
   this.document.body.style.cursor = 'wait';

   var bgDiv;
   if (this.backgroundDivId == null || (bgDiv = this.document.getElementById(this.backgroundDivId)) == null)
   {
      bgDiv = this.document.body;
   }

   this.domElement = this.document.createElement("div");
   if( !is_ie )
   {
      this.domElement.className = "pleaseWaitDiv";
   }

   this.domElement.style.position = 'absolute';
   this.domElement.style.filter = 'alpha(opacity=75)';

   this.domElement.style.backgroundColor = '#E6E6FA';
   if( is_ie )
   {
      this.domElement.style.zIndex = '1200';
   }


   var msg = this.document.createElement("div");
   msg.className = "pleaseWaitMessage";
   msg.innerHTML = this.displayMessage;
   this.domElement.appendChild(msg);

   this.domElement.style.top = bgDiv.offsetTop;
   this.domElement.style.left = bgDiv.offsetLeft;

   if (is_ie)
   {
      this.domElement.style.height = bgDiv.offsetHeight;
      this.domElement.style.width = bgDiv.offsetWidth;
   }
   else
   {
      this.domElement.style.height = "100%";
      this.domElement.style.width = "100%";
   }

   bgDiv.appendChild(this.domElement);

   if( !is_ie )
   {
      this.domElement.parentElement = bgDiv;
   }
   //window.status = "threw up please wait div...";
};

/**
 * end the please wait div... 
 **/
PleaseWaitDiv.prototype.end = function()
{
   this.document.body.style.cursor = 'default';
   if (this.domElement)
   {
      this.domElement.parentElement.removeChild(this.domElement);
      this.domElement = null;
   }
};

