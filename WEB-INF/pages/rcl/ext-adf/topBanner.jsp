<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div>
   <img style="margin-left:10px;" src="<%=request.getContextPath()%>/images/report-central-small.png" alt="MotioADF"/>

   <div style="position:absolute;top:0px; right: 0px; text-align:right;padding:10px 10px 0px 0px; 	font-family:Verdana, Helvetica, sans-serif;font-size:11px;">
      <fmt:message key="loggedin.header.msg">
         <fmt:param value="${userForm.logon}"/>
         <fmt:param value="<%=RclEnvironment.getEnvironmentLabel()%>"/>
      </fmt:message>
      &nbsp;&nbsp;&nbsp;&nbsp;

      
      <a href="<%=request.getContextPath()%>/logout.do"><fmt:message key="logout.link"/></a>
   </div>
</div>
