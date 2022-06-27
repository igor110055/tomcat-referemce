<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Change Owner Dialog...

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: changeOwnerDialog.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <title>Filter Selection</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/ChangeOwnerDialogUi.js"></script>


   <style type="text/css">
      @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";

      @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
      @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";

      #topPane {
         width: 100%;
         display:block;
      }

      #navTree {
         float: left;
         height: 300px;
         min-height: 300px;
         width: 100%;

         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:scroll;
      }

      #bottomPane {
         width: 100%;
         display: block;
         clear:both;

      }


      #bottomButtons {
         width: 100%;

         padding-top: 5px;

         text-align:center;
         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:auto;
      }


      *.dialogButton  {
         width: 100px;
      }


   </style>

</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded(); window.dialogUiController = uiController;"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <div id="topPane">
      <div id="navTree">
         <div id="contentShell">
            <div id="workspace">
               <div>
                  <html:form action="/secure/actions/executeChangeOwner" method="post">
                     <fieldset>
                        <legend><fmt:message key="dialogs.changeOwner.owner"/></legend>
                        <html:select property="ownerId" styleId="ownerId">
                           <c:forEach var="user" items="${form.users}" >
                              <option value="${user.id}"><c:out value="${user.logon}"/></option>
                           </c:forEach>
                        </html:select>
                     </fieldset>
                     <fieldset>
                        <legend>The current profile owners</legend>
                        <table>
                        <c:forEach var="profile" items="${form.profiles}">
                              <tr>
                                 <td><c:out value="${profile.defaultName}" /></td><td><c:out value="${profile.owner.logon}" /></td>
                              </tr>
                        </c:forEach>                           
                        </table>
                     </fieldset>
                  </html:form>
               </div>
            </div>
         </div>
      </div>
   </div>

         <div id="bottomPane">
            <div id="bottomButtons">
               <input class="dialogButton" id="FilterSubmitButton" type="button" value="OK" onclick="uiController.onOkButtonPress();" />
               <input class="dialogButton" type="button" value="Cancel" onclick="uiController.onCancelButtonPress();"/>
            </div>
         </div>


   <script type="text/javascript" xml:space="preserve">

      var uiModel = new ChangeOwnerDialogUiModel(null, null);
      var uiController = new ChangeOwnerDialogUiController(document, uiModel, false);

      //--- easier access for someone who wants to access us as an iframe...
      window.dialogUiController = uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         uiController.initUi();
      });

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         //--- clean up dialog reference...
         window.dialogUiController = null;
      });

   </script>
</body>
</html>

