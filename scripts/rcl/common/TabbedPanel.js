/**
 * This file defines JavaScript classes which represent a tabbed panel
 * where each tab represents a separate IFrame HTML document.
 *
 * @author Lance Hankins
 *
 **/




/**
 * I represent a single tab on the tabbed panel
 * @param aTabName - the name of the tab
 * @param aUrl - the URL which should be loaded by the tab.
 *
 * @constructor
 **/
function Tab(aTabName, aUrl)
{
   this.name = aTabName;
   this.url = aUrl;

   this.parentPanel = null;
   this.isRaised = false;
}


/**
 * raise this tab (makes it the currently active tab
 **/
Tab.prototype.raise = function()
{
   if (!this.parentPanel.enabled)
      return;

   //var imgElement = document.getElementById(this.getCloseImageIdName());
   //imgElement.src = TabbedPanel.IMAGE_DIR + "/closeTab.gif";
   //imgElement.onclick = new Function( "tabbedPanel.removeCurrentTab();" );

   this.isRaised = true;
   this.changeLayers("selectedTabHeader", 1, "visible", "block");
   this.refresh();
}

/**
 * lower this tab....
 **/
Tab.prototype.lower = function ()
{
   if (!this.parentPanel.enabled)
      return;

   //var imgElement = document.getElementById(this.getCloseImageIdName());
   //imgElement.src = TabbedPanel.IMAGE_DIR + "/closeTabDisabled.gif";
   //imgElement.onclick = null;

   this.isRaised = false;
   this.changeLayers("tabHeader", 0, "hidden", "none");
}

/**
 * used to change the styles of this tab...
 * @private
 **/
Tab.prototype.changeLayers = function (aTabHeaderClass, aBodyZIndex, aVisibility, aDisplay)
{
   var tabHeaderElement = document.getElementById(this.headerId);
   tabHeaderElement.className = aTabHeaderClass;

   var tabBodyElement = document.getElementById(this.bodyId);
   tabBodyElement.style.zIndex = aBodyZIndex;
   tabBodyElement.style.visibility = aVisibility;
   tabBodyElement.style.display = aDisplay;
}


/**
 * @private
 **/
Tab.prototype.lowerBody = function ()
{
   var tabBodyElement = document.getElementById(this.bodyId);
   tabBodyElement.style.zIndex = 0;
   tabBodyElement.style.visibility = "hidden";
   tabBodyElement.style.display = "none";
}

/**
 * refreshes this tabbed panel...
 **/
Tab.prototype.refresh = function ()
{
   if (!JsUtil.isUndefined(this.parentPanel.selectionListener) &&
       !JsUtil.isNull(this.parentPanel.selectionListener))
   {
      this.parentPanel.selectionListener.tabWasSelected(this);
   }
}



/**
 * returns qualified name in the form : parentPanelName_tabName
 **/
Tab.prototype.getQualifiedName = function ()
{
   return this.parentPanel.name + "_" + this.name;
}

/**
 * @private
 **/
Tab.prototype.getLoadingImageIdName = function ()
{
   return this.getQualifiedName() + "_StatusImg";
}


/**
 * @private
 **/
Tab.prototype.getCloseImageIdName = function ()
{
   return this.getQualifiedName() + "_CloseImg";
}


/**
 * @private
 **/
Tab.prototype.getIframeId = function ()
{
   return this.getQualifiedName() + "_IFrame";
}


/**
 * called once the document displayed in this tab is fully loaded
 * @private
 **/
Tab.prototype.documentIsLoaded = function()
{
   this.toggleLoadingImage(false);

   var iframeElement = document.getElementById(this.getIframeId());
   iframeElement.style.display = "block";

   this.parentPanel.tabIsFullyLoaded(this);
}



/**
 * remove this tab from the parent tabbed panel...
 *
 **/
Tab.prototype.remove = function()
{
  this.parentPanel.removeTab( this );
}


/**
 * used to toggle on/off the "in progress" loading image
 * @private
 **/
Tab.prototype.toggleLoadingImage = function(aShow)
{
   if (TabbedPanel.SHOW_LOADING_ICONS)
   {
      var imgElement = document.getElementById(this.getLoadingImageIdName());
      imgElement.style.display = (aShow ? "inline" : "none");
   }
}



/**
 * @private
 **/

Tab.prototype.toString = function ()
{
   return this.name;
}


/**
 * @private
 **/
Tab.prototype.getLoadingImageFragment = function ()
{
   return TabbedPanel.SHOW_LOADING_ICONS ? '<img id="' + this.getLoadingImageIdName() + '" class="tabIsLoadingImage" src="' + TabbedPanel.IMAGE_DIR + '/loading.gif"/>' : "";
}


/**
 * @private
 **/
Tab.prototype.getCloseImageFragment = function ()
{
   return '';
//   return "<img class='tabIsLoadingImage' id='" + this.getCloseImageIdName() + "' src='" + TabbedPanel.IMAGE_DIR + "/closeTabDisabled.gif'/>";
}



/**
 * change to a new url for this tab
 **/
Tab.prototype.changeUrl = function(aNewUrl)
{
   this.toggleLoadingImage(true);
   this.url = aNewUrl;
   document.getElementById(this.getIframeId()).setAttribute("src", this.url);
}


/**
 * remove this tab from the page
 * @private
 **/
Tab.prototype.removeFromPage = function()
{
   var headerElem = document.getElementById(this.headerId);
   headerElem.parentNode.removeChild(headerElem);

   var bodyElem = document.getElementById(this.bodyId);
   bodyElem.parentNode.removeChild(bodyElem);
}


/**
 * @private
 **/
Tab.prototype.insertIntoDocument = function()
{
   var tabHeaders = document.getElementById(this.parentPanel.headerDivId);
   var tabBodies  = document.getElementById(this.parentPanel.bodyDivId);

   this.headerId = this.getQualifiedName() + "Header";
   this.bodyId = this.getQualifiedName() + "Body";


   //--- insert new tab header
   var newTabHeader = document.createElement("span");
   newTabHeader.id = this.headerId;
   newTabHeader.className = "tabHeader";
   newTabHeader.innerHTML =
         this.getLoadingImageFragment() + "&nbsp;" +
         JsUtil.makeAllSpacesNonBreaking(this.name) + "&nbsp;" +
         this.getCloseImageFragment();




   //--- setup an "onclick" event for the tab header (this varies from NN to IE)...
   var fnBody = this.parentPanel.name + ".selectTab('" + this.name + "');";

   if (is_ie5up)
   {
      newTabHeader.setAttribute("onclick", new Function(fnBody));
   }
   else
   {
      newTabHeader.setAttribute("onclick", "tabbedPanel.selectTab('" + this.name + "');");
   }

   tabHeaders.appendChild(newTabHeader);



   //--- insert new tab body
   var newTabBody = document.createElement("div");

   newTabBody.id = this.bodyId;
   newTabBody.className = "tabBody";


   newTabBody.style.zIndex  = 0;
   newTabBody.style.display = "none";

   var disableRightClick = '';
   //var disableRightClick = 'oncontextmenu="return false;"';


   var debugSpan = document.getElementById("debugSpan");

   if (debugSpan)
      debugSpan.innerHTML = this.url;


   newTabBody.innerHTML = '<iframe name="' + this.getIframeId() + '" id="' + this.getIframeId() +
      '" class="tabBodyIFrame" ' + disableRightClick + ' onload="javascript:tabbedPanel.tabs[\'' + this.name + '\'].documentIsLoaded();" src="'
      + this.url + '"/>';

   tabBodies.appendChild(newTabBody);
}




/**
 * I represent a tabbed panel, each associated Tab can display its own HTML
 * document.
 *
 * @constructor
 **/
function TabbedPanel(aPanelName, aPanelDivId, aSelectionListener)
{

   this.name = aPanelName;
   this.selectionListener = aSelectionListener;
   this.currentTab = null;

   //--- sometimes its useful to grab these tabs by name, other times by index,
   //    we'll one collection indexed by name, and another Array with the Tabs
   //    present in the order in which they appear.

   this.tabs = new Object();
   this.tabsByOrder = new Array();

   this.oneTabHasLoaded = false;
   this.enabled = true;


   this.containerDivId = aPanelDivId;
   this.headerDivId = this.containerDivId + "_Header";
   this.bodyDivId = this.containerDivId + "_Body";

   var containerElement = document.getElementById(this.containerDivId);

   //--- insert the header div...
   var headerDivElement = document.createElement("div");
   headerDivElement.id = this.headerDivId;
   headerDivElement.className = "tabHeadersContainer";

   containerElement.appendChild(headerDivElement);

   //--- insert the body div...
   var bodyDivElement = document.createElement("div");
   bodyDivElement.id = this.bodyDivId;
   bodyDivElement.className = "tabBodiesContainer";

   containerElement.appendChild(bodyDivElement);
}




/**
 * add a new tab to this tabbed panel
 **/
TabbedPanel.prototype.addTab = function(aTabName,aUrl)
{
   var tab = new Tab(aTabName,aUrl);
   tab.parentPanel = this;

   this.tabs[tab.name] = tab;
   this.tabsByOrder[this.tabsByOrder.length] = tab;


   //--- now add the tab to the document...
   tab.insertIntoDocument();

   return tab;
}


/**
 * select the designated tab (bring it to the top)
 *
 **/
TabbedPanel.prototype.selectTab = function(aTabName)
{
   if (this.currentTab != null)
   {
      this.currentTab.lower();
   }

   this.currentTab = this.tabs[aTabName];
   this.currentTab.raise();
}

/**
 * select the first tab...
 *
 **/
TabbedPanel.prototype.selectFirstTab = function()
{

   this.selectTab(this.tabsByOrder[0]);
}



/**
 * disable
 **/
TabbedPanel.prototype.disable = function()
{
   this.enabled = false;
}

/**
 * enable
 **/
TabbedPanel.prototype.enable = function()
{
   this.enabled = true;
}


/**
 * @private
 **/
TabbedPanel.prototype.toString = function ()
{
   return this.name;
}


/**
 * @private
 **/
TabbedPanel.prototype.tabIsFullyLoaded = function (aTab)
{
   if (!this.oneTabHasLoaded)
   {
      this.oneTabHasLoaded = true;

      if (this.currentTab == null)
      {
         aTab.raise();
         this.currentTab = aTab;
      }
   }
}


/**
 * @private
 **/
TabbedPanel.prototype.getTabIndex = function(aTab)
{
   for (var i = 0; i < this.tabsByOrder.length; ++i)
   {
      if (this.tabsByOrder[i] == aTab)
      {
         return i;
      }
   }

   return -1;
}


/**
 * removes the currently focused tab
 **/
TabbedPanel.prototype.removeCurrentTab = function()
{
   if (this.currentTab == null)
   {
      return;
   }

   var targetTabIndex = this.getTabIndex(this.currentTab);

   this.tabsByOrder = JsUtil.removeElementFromArrayByIndex(this.tabsByOrder, targetTabIndex);
   delete this.tabs[this.currentTab.name];

   this.currentTab.removeFromPage();
   this.currentTab = null;

   if (this.tabsByOrder.length > 0)
   {
      var newSelectionIndex = (targetTabIndex < this.tabsByOrder.length) ? targetTabIndex : targetTabIndex-1;
      this.selectTab(this.tabsByOrder[newSelectionIndex].name);
   }
}


/**
 * returns the total number of tabs
 **/
TabbedPanel.prototype.getNumberOfTabs = function()
{
   return this.tabsByOrder.length;
}




///////// CONFIGURATION OPTIONS /////////////////////////////////////////////

TabbedPanel.IMAGE_DIR = ServerEnvironment.contextPath + "/images";
TabbedPanel.SHOW_LOADING_ICONS = true;


