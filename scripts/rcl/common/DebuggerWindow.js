
/**
 * I am a "debug" window which can display debug information on the
 * four variable scopes from the Web Container.
 *
 * @author Lance Hankins
 * @since May 20th, 2002
 **/

function DebuggerWindowScope(aName, aTitleId, aBodyId)
{
   this.name = aName;
   this.titleId = aTitleId;
   this.bodyId = aBodyId;

   this.domElement = null;
   this.domParent = null;
   this.isCollapsed = false;
}

DebuggerWindowScope.prototype.collapse = function()
{
   if (this.isCollapsed)
      return;

   this.domElement = document.getElementById(this.bodyId);

   if (this.domElement == null)
   {
      alert("element [" + this.bodyId + "] not present yet...");
      return;
   }
   this.domParent = this.domElement.parentNode;
   this.domParent.removeChild(this.domElement);
   this.isCollapsed = true;
   titleElement = document.getElementById(this.titleId).innerHTML = "+ " + this.name;

}

DebuggerWindowScope.prototype.expand = function()
{
   if (this.isCollapsed == false)
      return;

   this.domParent.appendChild(this.domElement);
   this.isCollapsed = false;
   titleElement = document.getElementById(this.titleId).innerHTML = "- " + this.name;
}

DebuggerWindowScope.prototype.toggle = function()
{
   if (this.isCollapsed)
   {
      this.expand();
   }
   else
   {
      this.collapse();
   }
}







//-----------------------------------
function DebuggerWindowPanel(aBodyId)
{
   this.scopes = new Object();
   this.isMinimized = false;

   this.domBodyElement = null;
}

DebuggerWindowPanel.prototype.addScope = function(aScope)
{
   this.scopes[aScope.name] = aScope;
}

DebuggerWindowPanel.prototype.getScope = function(aScopeName)
{
   var retVal = this.scopes[aScopeName];
   if (retVal == undefined || retVal == null)
   {
      alert("DebuggerWindowPanel: warning - failed to find [" + aScopeName + "]");
   }
   return retVal;
}

DebuggerWindowPanel.prototype.collapseAll = function()
{
   for (scopeName in this.scopes)
   {
      this.scopes[scopeName].collapse();
   }
}

DebuggerWindowPanel.prototype.minimize = function()
{
   this.collapseAll();

   var bodyDiv = document.getElementById("debugWindow.bodyContainer");
   this.domBodyElement = bodyDiv.firstChild;
   bodyDiv.removeChild(this.domBodyElement);

   document.getElementById("debugWindow").className = "debugWindowMinimized";
   document.getElementById("debugWindow.minimizeOrRestoreLink").innerHTML = "restore";

   this.isMinimized = true;
}

DebuggerWindowPanel.prototype.restore = function()
{
   var bodyDiv = document.getElementById("debugWindow.bodyContainer");
   bodyDiv.appendChild(this.domBodyElement);

   document.getElementById("debugWindow").className = "debugWindowRestored";
   document.getElementById("debugWindow.minimizeOrRestoreLink").innerHTML = "minimize";

   this.isMinimized = false;
}

DebuggerWindowPanel.prototype.toggle = function()
{
   if (this.isMinimized)
   {
      this.restore();
   }
   else
   {
      this.minimize();
   }
}

DebuggerWindowPanel.prototype.close = function()
{
   var element = document.getElementById("debugWindow");
   element.parentNode.removeChild(element);
}

DebuggerWindowPanel.prototype.turnOff = function()
{
   var currentLocation = window.location.href;

   var i = currentLocation.indexOf("showDebugWindow=true");

   var newUrl;

   if (i != -1)
   {
      var preceeding = currentLocation.substr(0, i);
      var following  = currentLocation.substr(i + "showDebugWindow=true".length);

      newUrl = preceeding + "showDebugWindow=false" + following;
   }
   else
   {
      var paramSeparator = (currentLocation.indexOf("?") != -1) ? "&" : "?";
      newUrl = currentLocation + paramSeparator +  "showDebugWindow=false";
   }

   window.location = newUrl;
}








