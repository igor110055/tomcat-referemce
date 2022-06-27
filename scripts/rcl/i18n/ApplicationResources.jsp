<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.springframework.context.support.ApplicationResourceAdapter"%>
<%@ page import="org.apache.struts.Globals"%>
<%@ page import="java.util.Locale"%>
<%@ page import="com.focus.rcl.web.util.RclWebUtil" %>


<%@ include file="/WEB-INF/pages/common/cache/48Hours.jsp" %>

<%---------------------------------------------------------------------------//
// This file is dynamically generated from ApplicationResourceAdapter
//---------------------------------------------------------------------------%>


function ApplicationResources()
{
   this.propertyMap = new Array();
}

ApplicationResources.prototype.addProperty = function(key, value){
   this.propertyMap[key] = value;
};

ApplicationResources.prototype.getProperty = function(key){
   var value = this.propertyMap[key];
   if(value == undefined)
   {
      value = "???"+key+"???";
   }
   return value;
};

ApplicationResources.prototype.getPropertyWithParameters = function(key, parameters){

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
};

var applicationResources = new ApplicationResources();

<%
   String jsObject = "";
   Locale locale = RclWebUtil.getUserJavaLocale(request);


   if (locale != null)
   {
      jsObject = ApplicationResourceAdapter.toJsObject(locale);
   }
%>

<%= jsObject %>