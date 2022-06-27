<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
<head>

   <title>Logging Example</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/prototype.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/log4js.js"></script>



   <style type="text/css">
      @import "<%=request.getContextPath()%>/examples/js/common/JsExamples.css";
   </style>


   <script type="text/javascript">

   function initUi()
   {
      log.trace("Sample trace message");
      log.debug("Sample debug message");
      log.info("Sample info message");
      log.warn("Sample warn message");
      log.error("Sample error message");
      log.fatal("Sample fatal message");
   }


   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Logging Example</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of logging.
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>

      <p>
         log is a global variable declared in CommonIncludes.jsp <br>

         To enable logging, set rcl.js.clientDebug=true in build.properties 
      </p>

   <textarea id="rclAlertTextArea" rows="7" cols="100">
      log.trace("Sample trace message");
      log.debug("Sample debug message");
      log.info("Sample info message");
      log.warn("Sample warn message");
      log.error("Sample error message");
      log.fatal("Sample fatal message");
      </textarea>
   <br>
   <button onclick="eval(document.getElementById('rclAlertTextArea').value);">Execute</button>


   </div>




   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
