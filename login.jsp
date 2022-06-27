<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
   This is a default login page...

   ---------------------------
   @author : Lance Hankins, Ryan Baula

   $Id: login.jsp 7393 2011-03-23 19:41:00Z lhankins $

--%>
<html>
<head>


   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/TimeZone.js" language="JavaScript"></script>
   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/login.js" language="JavaScript"></script>

   <title><fmt:message key="login.pageTitle"/></title>

   <style type="text/css">

      body {
         background-image: url('<%=request.getContextPath()%>/images/motio-swoop-bg.png');
         background-color: #214478;
         background-repeat: no-repeat;
      }
      fieldset {
         border: 0px solid #000
      }

      *.error{
         color: red;
      }

      td.label {
         text-align:left;
         padding-right:5px;
         padding-left:10px;
      }

      *.title {
         font-size:12pt;
         font-weight:bold;
         color:#27518A;
         text-align:center;
      }

      td.input input {
         width:200px;
      }

      .centeredMessage {
         position:absolute !important;
         left:35%;
         top: 60%;
      }

   </style>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>


   <script type="text/javascript">
      var uiController;


      // this allows you to close this window via javascript without IE 5.5+ prompting for confirmation
      window.opener = top;

      // Bust out of any frames...
      if (top.frames.length > 0)
      {
         top.location.href = location.href;
      }

      function initUi ()
      {
         <c:if test="${loginPromptForm == null}">
            <!-- old bookmarks point directly to this jsp (but we want them to go through the action) -->
            window.location = ServerEnvironment.baseUrl + "/actions/loginPromptAction.do";
            return;
         </c:if>

         uiController = new LoginUiController (window.document, cognosInfo, timeZones);
         uiController.initUi();

         document.forms[0].j_username.focus();
      }

      //    generated via JS, see ticket #591
      ImageHelper.registerForPreLoad([
         ServerEnvironment.baseUrl + "/images/softlink.gif",                  // <-- Nav Menu
         ServerEnvironment.baseUrl + "/images/folderYellowOpen.gif",
         ServerEnvironment.baseUrl + "/images/folderYellowClosed.gif",
         ServerEnvironment.baseUrl + "/images/minus.gif",
         ServerEnvironment.baseUrl + "/images/plus.gif",
         ServerEnvironment.baseUrl + "/images/noPlusOrMinus.gif",
         ServerEnvironment.baseUrl + "/images/triangleDown.gif",
         ServerEnvironment.baseUrl + "/images/triangleRight.gif",
         ServerEnvironment.baseUrl + "/images/menuDown.gif",
         ServerEnvironment.baseUrl + "/images/menuRight.gif",
         ServerEnvironment.baseUrl + "/images/menuBarBackground.gif",
         ServerEnvironment.baseUrl + "/images/report-public.gif",             // <-- Folder Contents...
         ServerEnvironment.baseUrl + "/images/report-private.gif",
         ServerEnvironment.baseUrl + "/images/reportProfile-public.gif",
         ServerEnvironment.baseUrl + "/images/reportProfile-private.gif",
         ServerEnvironment.baseUrl + "/images/arrow_down_black.gif",
         ServerEnvironment.baseUrl + "/images/button3.gif",
         ServerEnvironment.baseUrl + "/images/buttonBarBackground.gif",
         ServerEnvironment.baseUrl + "/images/plus.gif",
         ServerEnvironment.baseUrl + "/images/sortDescending.gif",            // <-- Browse Outputs...
         ServerEnvironment.baseUrl + "/images/arrow_down_trans.gif",
         ServerEnvironment.baseUrl + "/images/arrow_down_grey.gif",
         ServerEnvironment.baseUrl + "/images/report-finished.gif",
         ServerEnvironment.baseUrl + "/images/report-failed.gif",
         ServerEnvironment.baseUrl + "/images/md/namespace.gif",              // <-- Md Tree...
         ServerEnvironment.baseUrl + "/images/md/querySubject.gif",
         ServerEnvironment.baseUrl + "/images/md/folder.gif",
         ServerEnvironment.baseUrl + "/images/md/folderOpen.gif",
         ServerEnvironment.baseUrl + "/images/md/queryItemAttribute.gif",
         ServerEnvironment.baseUrl + "/images/md/queryItemMeasure.gif",
         ServerEnvironment.baseUrl + "/images/md/function.gif",
         ServerEnvironment.baseUrl + "/images/md/filter.gif",
         ServerEnvironment.baseUrl + "/images/md/literal.gif",
         ServerEnvironment.baseUrl + "/images/md/operator.gif",
         ServerEnvironment.baseUrl + "/images/md/summary.gif",
         ServerEnvironment.baseUrl + "/images/bbar_icons/blank.gif"
      ]);



      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         initUi();
      });


   </script>


</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">




<div id="dummyLoginDiv" style="margin-top:100px">
   <form method="post" style="width:310px" action="<%=request.getContextPath()%>/j_security_check">

      <script type="text/javascript">
         <c:out value="${loginPromptForm.cognosInfoJs}" escapeXml="false"/>
      </script>
      <script type="text/javascript">
         <c:out value="${loginPromptForm.timeZonesJs}" escapeXml="false"/>
      </script>
         <table>
            <tr>
               <td colspan="2" align="left">
                  <span class="title"><fmt:message key="login.pageTitle"/></span>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <fmt:message key="login.cognosInstance"/>
               </td>
               <td class="input">
                  <select id="j_cognosInstance" name="j_cognosInstance"  style="width:207px;" onchange="uiController.onCognosInstanceSelectChanged();">
                  </select>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <fmt:message key="login.namespace"/>
               </td>
               <td class="input">
                  <select id="j_namespace" name="j_namespace"  style="width:207px;">
                  </select>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <fmt:message key="login.userId"/>
               </td>
               <td class="input">
                  <input type="text" name="j_username" style="width:200px;"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <fmt:message key="login.password"/>
               </td>
               <td class="input">
                  <input type="password" name="j_password" style="width:200px;"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <fmt:message key="login.timezone"/>
               </td>
               <td class="input">
                  <select id="j_timezone" name="j_timezone"  style="width:207px;"  >
                  </select>
               </td>

            </tr>

            <tr>
               <td colspan="2" align="right">
                  <html:submit property="" altKey="login.button.login.alt" titleKey="login.button.login.title" bundle="rcl" onclick="javascript:uiController.createTSCookie()" style="margin-right:4px">
                     <fmt:message key="login.button.login"/>
                  </html:submit>
               </td>
            </tr>
            <tr>
               <td colspan="2" align="center">
                  <span class="error">
                     <logic:equal value="true" parameter="error">
                        <fmt:message key="login.badLogin"/>
                     </logic:equal>
                     <logic:notEqual value="true" parameter="error"> <!-- do not show session expired messages on errors -->
                       <logic:equal value="true" parameter="sessionExpired">
                         <fmt:message key="login.sessionExpired"/>
                       </logic:equal>
                     </logic:notEqual>
                  </span>
               </td>
            </tr>

         </table>

   </form>
</div>

<%--
<c:if test="${loginPromptForm.cognosInstance != null}">
   <div id="cognosDownDiv"  style="position:absolute; left:37%; top: 30%;">
      <fmt:message key="login.cognosIsDown"/><br/>
      <c:out value="${loginPromptForm.cognosInstance}"/>
   </div>
</c:if>
--%>

</body>
</html>
