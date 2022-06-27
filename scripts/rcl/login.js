
function LoginUiController(aDocument, aCognosInfo, aTimeZones) {
   if (arguments.length > 0)  {
      this.document = aDocument;
      this.cognosInfo = aCognosInfo;
      this.timeZones = aTimeZones;

      //--- some clients don't want cognos instance on the login page
      if (document.getElementById("j_cognosInstance")) {
         this.cognosInstanceList = new JsListBox("j_cognosInstance", "j_cognosInstance", this.cognosInfo.cognosInstances, new SimpleFieldExtractor("id", "name"));
      }


      //--- some clients don't want namespace on the login page
      if (document.getElementById("j_namespace")) {
         this.namespaceList = new JsListBox("j_namespace", "j_namespace", [], new SimpleFieldExtractor("id", "name"));
      }

      this.timeZoneList = new JsListBox("j_timezone", "j_timezone", this.timeZones, new SimpleFieldExtractor("id", "displayName"));
   }
}

LoginUiController.prototype.initUi = function() {
   if (this.cognosInstanceList) {
      this.cognosInstanceList.sortFn = null;
      this.cognosInstanceList.refreshView();
   }

   this.timeZoneList.sortFn=null;
   this.timeZoneList.refreshView();

   var timeZone = this.readTSCookie();


   if (timeZone==null) {
      this.setTimeZoneBasedOnOffset();
   }
   else {
      this.timeZoneList.setIemAsSelectedByValue(timeZone);
   }

   this.onCognosInstanceSelectChanged();
};

LoginUiController.prototype.getSelectedCognosInstance = function() {
   var selected = this.cognosInstanceList.getSelectedSrcObjects();
   return (selected && selected.length > 0)  ? selected[0] : null;
};

LoginUiController.prototype.onCognosInstanceSelectChanged = function() {
   this.namespaceList.clearList();

   var cognosInstance = this.getSelectedCognosInstance();

   if (cognosInstance) {
      this.namespaceList.resetAvailableItems(cognosInstance.namespaces);
      this.namespaceList.refreshView();

   }
};



LoginUiController.prototype.setTimeZoneBasedOnOffset = function() {
   var summerOffset = this.getSummerOffsetInMS();
   var winterOffset = this.getWinterOffsetInMS();
   //alert("summer offset [" + summerOffset +"]"  +"winter offset [" + winterOffset +"]");
   for (i = 0; i < this.timeZones.length; i++) {
      var timeZone = this.timeZones[i];

      //if it is the time zone we are looking for (i.e. summer and winter offsets match)
      //or we have already gone past it
      if (((timeZone.summerOffset == summerOffset) && (timeZone.winterOffset == winterOffset)) || timeZone.summerOffset > summerOffset) {
         //alert ("[" + timeZone.displayName +"] [" + timeZone.summerOffset +"]" +" [" + timeZone.winterOffset +"]");
         this.timeZoneList.setIemAsSelectedByValue(timeZone.id);
         return;
      }
  }
};

LoginUiController.prototype.getSummerOffsetInMS = function() {
   var dtJul = new Date(2006, 6, 23);
   //July 23

   var offsetJul = dtJul.getTimezoneOffset();
   //getTimezoneOffset returns minutes; we need to convert to milli-seconds
   //the sign is also opposite of what Java has
   return -(offsetJul * 60 * 1000);
};

LoginUiController.prototype.getWinterOffsetInMS = function() {
   var dtJul = new Date(2006, 11, 25);
   //Decemember 25

   var offsetJul = dtJul.getTimezoneOffset();
   //getTimezoneOffset returns minutes; we need to convert to milli-seconds
   //the sign is also opposite of what Java has
   return -(offsetJul * 60 * 1000);
};

LoginUiController.prototype.createTSCookie = function() {
   var date = new Date();
   date.setTime(date.getTime()+(90*24*60*60*1000)); //90 days
	var expires = "; expires="+date.toGMTString();
   this.document.cookie = "rclTimeZone="+escape($F('j_timezone'))+expires +"; path=/";
};

LoginUiController.prototype.readTSCookie = function() {
	var nameEQ = "rclTimeZone=";
	var ca = this.document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};


