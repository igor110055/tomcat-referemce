<%@ page import="org.apache.struts.Globals"%>
<%@ page import="java.util.Locale"%>
<%@ page import="com.focus.rclcustomer.web.js.CustomerAppResourcesAdapter"%>



<%@ include file="/WEB-INF/pages/common/cache/48Hours.jsp" %>

<%---------------------------------------------------------------------------//
// This file is dynamically generated from ApplicationResourceAdapter
//---------------------------------------------------------------------------%>


function CustomerAppResources()
{
   this.propertyMap = new Array();
}

CustomerAppResources.prototype.addProperty = function(key, value){
   this.propertyMap[key] = value;
}

CustomerAppResources.prototype.getProperty = function(key){
   var value = this.propertyMap[key];
   if(value == undefined)
   {
      value = "???"+key+"???";
   }
   return value;
}

CustomerAppResources.prototype.getPropertyWithParameters = function(key, parameters){

   if(parameters == undefined || parameters.length == 0)
   {
      return this.getProperty(key);
   }

   var value = this.getProperty(key);

   for(var i = 0; i < parameters.length; i++)
   {
      var strPattern ='\\{'+i+'\\}';
      var regExp = new RegExp(strPattern, "g");
      value = value.replace(regExp,parameters[i]);
   }

   return value;
}

var customerAppResources = new CustomerAppResources();

<%
   String jsObject = "";
   Locale locale = (Locale)request.getSession().getAttribute(Globals.LOCALE_KEY);

   //--- from login screen, the locale isn't set in the session yet...
   if (locale == null)
   {
      locale = request.getLocale();
   }
                                                   
   if (locale == null)
   {
      locale = Locale.ENGLISH;
   }


   if(locale != null)
   {
      jsObject = CustomerAppResourcesAdapter.toJsObject(locale);
   }
%>

<%= jsObject %>