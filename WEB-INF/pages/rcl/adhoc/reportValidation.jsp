<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <title><fmt:message key="reportWizard.validation.title"/></title>

      <style type="text/css">
         @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
      </style>
   </head>
   <body class="rclBody">
      <div class="pageBanner">
         <span id="rwStageName"><fmt:message key="reportWizard.validation.title"/></span>
      </div>


      <div>
         <c:out value="${validationSummary}"/><br/>
      </div>
      <br/>
      
      <div class="label"><fmt:message key="reportWizard.validation.layoutTitle"/></div>
      <div>
         <c:forEach items="${layoutErrors}" var="eachLayoutError">
            <c:out value="${eachLayoutError}"/><br/>
         </c:forEach>
      </div><br/>

      <div class="label"><fmt:message key="reportWizard.calculatedFields.title"/></div>
      <div>
         <c:forEach items="${calculatedErrors}" var="eachCalError">
            <c:out value="${eachCalError}"/><br/>
         </c:forEach>
      </div><br/>

      <div class="label"><fmt:message key="reportWizard.filters.title"/></div>
      <div>
         <c:forEach items="${filterErrors}" var="eachFilterError">
            <c:out value="${eachFilterError}"/><br/>
         </c:forEach>
      </div><br/>

      <div class="label"><fmt:message key="reportWizard.validation.otherTitle"/></div>
      <div>
         <c:forEach items="${otherErrors}" var="eachOtherError">
            <c:out value="${eachOtherError}"/><br/>
         </c:forEach>
      </div>

   </body>
</html>