<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.focus.rcl.core.IDashboardModule" %>
<%@ page import="java.util.HashMap" %>
<?xml version="1.0" encoding="UTF-8"?>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
   <title>Dashboard Tab</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>
   <!-- includes for nifty corners -->
   <link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/styles/rcl/niftyCorners/niftyCorners.css">
   <link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/styles/rcl/rcl/niftyCorners/niftyPrint.css" media="print">
   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/niftyCorners/nifty.js"></script>

   <!-- conditional stylesheet... -->
   <script type="text/javascript">
      var browserDir = (is_ie ? 'ie' : 'moz');
      document.write('<style type="text/css">\n' +
                     '@import "<%=request.getContextPath()%>/styles/rcl/' + browserDir + '/workspace.css";\n' +
                     '</style>\n');
      document.write('<style type="text/css">\n' +
                     '@import "<%=request.getContextPath()%>/styles/rcl/' + browserDir + '/dashboard.css";\n' +
                     '</style>\n');
      document.write('<style type="text/css">\n' +
                     '@import "<%=request.getContextPath()%>/styles/rcl/' + browserDir + '/dashboardModule.css";\n' +
                     '</style>\n');

      function initUi()
      {
         Rounded("form", "#FFF", "#BBD8FF");
      }

      function maximizeModule(aModuleDivId, aMaxUrl)
      {
         var bodyDiv = document.getElementById('bodyTabDiv');
         var moduleDiv = document.getElementById('moduleDiv' + aModuleDivId);

         bodyDiv.innerHTML = moduleDiv.innerHTML;

         document.getElementById('iframe' + aModuleDivId).src = aMaxUrl;

         var img = document.getElementById('moduleDiv' + aModuleDivId + '_Maximize');
         img.src = ServerEnvironment.baseUrl + "/images/triangleDown.gif";
         img.onclick = restoreModuleSize;
         img.alt = "Restore Size"
      }

      function restoreModuleSize()
      {
         window.location.href = window.location.href;
      }

      function toggleEditDisplay(aModuleEditDivId)
      {
         /*var editDiv = document.getElementById('moduleEditDiv' + aModuleEditDivId);

         if (editDiv.style.display == 'none')
         {
            editDiv.style.display = '';
            document.getElementById("iframe" + aModuleEditDivId).style.height = "80%";
         }
         else
         {
            editDiv.style.display = 'none';
            document.getElementById("iframe" + aModuleEditDivId).style.height = "92%";
         }*/

//         alert( document.getElementById("iframe" + aModuleEditDivId).Document.getElementsByTagName('table')[0].innerHTML);
         document.getElementById("iframe" + aModuleEditDivId).contentWindow.document.getElementsByTagName('img')[0].style.height = 100;

         var x = document.getElementById('moduleDiv' + aModuleEditDivId + '_Maximize');
//         x.style.height = "300";
//         for (var i = 0; i < array.length; i++)
//         {
//            alert(array[i].name);
//         }
      }

      function refreshDisplay(aModuleDivId)
      {
         pleaseWaitDiv = new PleaseWaitDiv('moduleDiv' + aModuleDivId, 'Refreshing...');
         pleaseWaitDiv.begin();
      }

      function saveModuleSettings(aIFrameId)
      {
         var xmlHttpRequest = JsUtil.createXmlHttpRequest();
         var url = ServerEnvironment.baseUrl + "/secure/actions/editDashboardModule.do?";

         var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
         {
            try
            {
               eval(anXmlHttpRequest.responseText);
            }
            catch (e)
            {
               var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); <\/script>";
               var writeString = anXmlHttpRequest.responseText;
               writeString = serverEnv + writeString;

               if (writeString.indexOf("<html>") == -1)
               {
                  alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
               }
               else
               {
                  window.document.write(writeString);
               }
            }
         });

         xmlHttpRequest.open("POST", url, true);

         xmlHttpRequest.setRequestHeader(
                 'Content-Type',
                 'application/x-www-form-urlencoded; charset=UTF-8'
                 );

         xmlHttpRequest.send("editModule=" + aIFrameId + "&selectionId=" + document.getElementById("select" + aIFrameId).value);
      }

      function dummysaveModuleSettings(aIFrameId)
      {
         document.getElementById("iframe" + aIFrameId).src = '/rcl/secure/reportOutputs/6.HTML';
//         alert(document.getElementById("select" + aIFrameId).value)
      }

   </script>
</head>

<body class="rclBody dashboardBody" id="bodyTabDiv" style="overflow:auto;" onload="initUi();">
<table style="width:100%; height:100%; vertical-align:top; ">
   <tr style="width:100%; height:100%;">

      <c:if test="${not empty columns}">
         <c:set var="columnNumberStyle" value="Column${columnSize}"/>

         <c:forEach items="${columns}" var="eachColumn" varStatus="columnStatus">
             <td class="<c:out value="${columnNumberStyle}"/>">
               <c:if test="${not empty eachColumn.modules}">
               <c:forEach items="${eachColumn.modules}" var="eachModule" varStatus="moduleStatus">
                  <%
                     //String maxUrlValue = ((IDashboardModule)pageContext.getAttribute("eachModule")).getMaximizedUrl(null, null);
                     pageContext.setAttribute("maxUrlValue", ((IDashboardModule)pageContext.getAttribute("eachModule")).getMaximizedUrl().build().getHref());
                  %>
                  <div id="moduleDiv<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>" class="module reportModule<c:out value="${eachColumn.moduleSize}"/>">
                     <fieldset class="tall">
                        <legend>
                           <form class="label" action="">
                              <div class="menuBar">
                                 <img class="resizeImage" id="moduleDiv<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>_Maximize"
                                      src="<%=request.getContextPath()%>/images/triangleUp.gif" alt="Maximize"
                                      onclick="maximizeModule('<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>',
                                      '<c:out value="${maxUrlValue}"/>');"/>

                                 <span class="menuBarText">
                                     <!--<a class="editLink" onclick="refreshDisplay('<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>')">
                                        Refresh
                                     </a>-->
                                    &nbsp;
                                     <a class="editLink" onclick="toggleEditDisplay('<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>')">
                                        Edit
                                     </a>
                                 </span>
                                 <c:out value="${eachModule.name}"/>

                              </div>
                              <%--Inline display none so toggleEditDisplay can work correctly--%>
                              <div style="display:none;" class="editBar" id="moduleEditDiv<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>">
                                 Properties:
                                 <br>
                                 Source Report:
                                 <select style="font:7pt" name="srcselection" id="select<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>">
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                 </select>
                                 <input name="Save" value="Save" type="button"
                                        onclick="saveModuleSettings('<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>')"/>
                              </div>
                           </form>
                        </legend>

                        <%
                           //String maxUrlValue = ((IDashboardModule)pageContext.getAttribute("eachModule")).getMaximizedUrl(null, null);
                           pageContext.setAttribute ("urlValue", ((IDashboardModule)pageContext.getAttribute("eachModule")).getUrl().build().getHref());
                        %>

                        <iframe id="iframe<c:out value="${columnStatus.count}"/><c:out value="${moduleStatus.count}"/>"
                                  scrolling="no" class="reportModuleIframe" style="width:100%;height:92%;"
                                src="<c:out value="${urlValue}"/>"></iframe>
                     </fieldset>

                  </div>
               </c:forEach>
               </c:if>
              </td>
         </c:forEach>
      </c:if>

   </tr>
</table>
</body>
</html>