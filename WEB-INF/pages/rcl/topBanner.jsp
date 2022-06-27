<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Describe Page Here...

   ---------------------------
   @author : Lance Hankins
   
   $Id: topBanner.jsp 8727 2014-03-25 19:40:27Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>banner</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         .bannerTitle {
            font-size:16pt;
            font-weight: bold;
         }
      </style>
   </head>
   <body class="rclBody">
      <html:xhtml/>
      <img src="<%=request.getContextPath()%>/images/rclBannerLogo.gif" alt="RCL"/>

      <div style="position:absolute;top:0px; right: 0px; text-align:right;padding:10px 10px 0px 0px;">
         <fmt:message key="loggedin.header.msg">
            <fmt:param value="${userForm.logon}"/>
            <%--<fmt:param value="${RclEnvironment.environmentLabel}"/>--%>
            <fmt:param value="<%=RclEnvironment.getEnvironmentLabel()%>"/>
         </fmt:message>
         <br/>

         <a href="<%=request.getContextPath()%>/logout.do"><fmt:message key="logout.link"/></a>
      </div>

   </body>
</html>
