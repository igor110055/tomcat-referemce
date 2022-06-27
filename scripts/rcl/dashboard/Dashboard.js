/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/



/**
 * @fileoverview
 * @author Lance Hankins
 * @version $Id: Dashboard.js 7504 2011-05-31 22:51:33Z sallman $
 *
 * This file defines a Dashboard widget related classes
 *
 **/


//-----------------------------------------------------------------------------
/**
 * A value object which holds the geometry of a widget
 * @constructor
 * @class
 **/
function DashboardWidgetGeometry(aTop, aLeft, aWidth, aHeight, aIsMinimized, aIsMaximized)
{
   // if constructed from the object itself, these will be values like "155px"
   this.top = parseFloat(aTop);
   this.left = parseFloat(aLeft);
   this.width = parseFloat(aWidth);
   this.height = parseFloat(aHeight);
   this.isMinimized = aIsMinimized == undefined ? false : aIsMinimized;
   this.isMaximized = aIsMaximized; 
}


DashboardWidgetGeometry.prototype.toString = function()
{
   return "top = [" + this.top + "], left = [" + this.left + "], width = [" + this.width + "], height = [" + this.height + "], minimized = [" + this.isMinimized + "], maximized = [" + this.isMaximized + "]";
}



//-----------------------------------------------------------------------------
/**
 * Dashboard Widget - this extends Window from the "prototype window" package,
 * adding ADF behavior where appropriate (e.g. the edit button in the upper
 * left hand corner).
 *
 * We're using a slightly different syntax here since "prototype window" does
 * a different type of class declaration than we typically use.
 *
 * BaseWindow acts as an intermediate bridge between "prototype window" and
 * our class.
 * 
 * @constructor
 * @class
 **/

var BaseWindow = Base.extend(new Window());


var DashboardWidget = BaseWindow.extend ({
   constructor : function(aOptions) {
      this.initialize(aOptions);
   },

   getGeometry : function() {
      var location = this.getLocation();
      var size = this.getSize();

      return new DashboardWidgetGeometry (location.top, location.left, size.width, size.height, this.isMinimized(), this.isMaximized());
   },

   setGeometry : function (aGeometry) {
      this.setLocation(aGeometry.top, aGeometry.left);
      this.setSize(aGeometry.width, aGeometry.height, true);

      if (aGeometry.isMinimized)
      {
         this.minimize();
      }

      if (aGeometry.isMaximized)
      {
         this.maximize();
      }
   },
   
   _createWindow: function(id) {
        //alert("derived create window!!!");
        var className = this.options.className;
        var win = document.createElement("div");
        win.setAttribute('id', id);
        win.className = "dialog";

        var content;
        if (this.options.url)
          content= "<iframe frameborder=\"0\" name=\"" + id + "_content\"  id=\"" + id + "_content\" src=\"" + this.options.url + "\"> </iframe>";
        else
          content ="<div id=\"" + id + "_content\" class=\"" +className + "_content\"> </div>";

        var closeDiv = this.options.closable ? "<div class='"+ className +"_close' id='"+ id +"_close' onclick='Windows.close(\""+ id +"\", event)'> </div>" : "";
        var minDiv = this.options.minimizable ? "<div class='"+ className + "_minimize' id='"+ id +"_minimize' onclick='Windows.minimize(\""+ id +"\", event)'> </div>" : "";
        var maxDiv = this.options.maximizable ? "<div class='"+ className + "_maximize' id='"+ id +"_maximize' onclick='Windows.maximize(\""+ id +"\", event)'> </div>" : "";
        var seAttributes = this.options.resizable ? "class='" + className + "_sizer' id='" + id + "_sizer'" : "class='"  + className + "_se'";
        var blank = ServerEnvironment.baseUrl + "/scripts/rcl/window_js/themes/default/blank.gif";



        win.innerHTML = closeDiv + minDiv + maxDiv + "\
          <table id='"+ id +"_row1' class=\"top table_window\">\
            <tr>\
              <td class='"+ className +"_nw'></td>\
              <td class='"+ className +"_n'>\
                <div id='"+ id +"_editLink' class='"+ className +"_editLink title_window'>Edit</div>\
                <div id='"+ id +"_top' class='"+ className +"_title title_window'>\
                   <div id='" + id + "_titleText'>" + this.options.title + "</div>\
                </div>\
                </td>\
              <td class='"+ className +"_ne'></td>\
            </tr>\
          </table>\
          <table id='"+ id +"_row2' class=\"mid table_window\">\
            <tr>\
              <td class='"+ className +"_w'></td>\
                <td id='"+ id +"_table_content' class='"+ className +"_content' valign='top'>" + content + "</td>\
              <td class='"+ className +"_e'></td>\
            </tr>\
          </table>\
            <table id='"+ id +"_row3' class=\"bot table_window\">\
            <tr>\
              <td class='"+ className +"_sw'></td>\
                <td class='"+ className +"_s'><div id='"+ id +"_bottom' class='status_bar'><span style='float:left; width:1px; height:1px'></span></div></td>\
                <td " + seAttributes + "></td>\
            </tr>\
          </table>\
        ";

        Element.hide(win);
        this.options.parent.insertBefore(win, this.options.parent.firstChild);
        Event.observe($(id + "_content"), "load", this.options.onload);
        Event.observe($(id + "_editLink"), "click", function (anEvent) { this.edit(anEvent); }.bind(this), false);

        return win;
      },

      edit: function(anEvent) {
         alert("ADF - edit widget preferences goes here");
      }
});
