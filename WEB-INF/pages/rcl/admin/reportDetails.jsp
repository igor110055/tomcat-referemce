<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Edit the details about a report

   ---------------------------
   @author : Lance Hankins
   
   $Id: reportDetails.jsp 6966 2009-11-05 20:33:39Z jjames $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
<title>Manage Report Details</title>
<%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>

<style type="text/css" xml:space="preserve">
   .invalidForContentNodes
   {

   }
</style>

<script type="text/javascript">


   <c:if test="${form.operation == 'edit'}">
      <c:out value="${form.jsReportSummaries}" escapeXml="false" />
   </c:if>

   var crnDialog = new CrnDialog();
   crnDialog.setDefaultPosition(10, 65);

   // pick a Cognos Report...
   function showCrnFilePicker()
   {
      var oldValue = document.forms[0].reportXpath.value; //oldValue reportXPath is used by the Report Column Definitions feature
      var dialogListener = {
         doc : document,
         dialogFinished : function (aPicker)
         {
            if (aPicker.wasCancelled == false)
            {
               var xpath = aPicker.selectedValues[0].id;

               if( !JsUtil.isEmptyString(oldValue) && checkForContentStoreNode(oldValue) != checkForContentStoreNode(xpath) )
               {
                  alert( "You cannot change the type of this object from a Report to a QueryStudio or AnalysisStudio link or vice versa.")
                  return;
               }

               this.doc.forms[0].reportXpath.value = xpath;

               var nameStart = xpath.lastIndexOf("@name='");

               if (nameStart != -1)
               {
                  var simpleName = xpath.substring(xpath.lastIndexOf("@name='") + 7, xpath.length - 2);
                  this.doc.forms[0].reportName.value = simpleName;
               }

               toggleInvalidForLinkContent( checkForContentStoreNode( xpath ) );
               checkIfValueChanged(oldValue); //for report column definintions
            }
         }
      };

      crnDialog.setDialogListener(dialogListener);

      crnDialog.showFileChooserDialog(applicationResources.getProperty("admin.reports.selectReport.title"),
              "/content",
              document.forms[0].reportXpath.value,
              true,
              ["report","query","analysis"], false);

   }

   var currentSelection = '<c:out value="${form.parentFolderId}"/>';

   // pick an RCL folder...
   function pickRclFolder()
   {
      var rclDialog = new RclDialog();

      var dialogListener = {
         thisDoc : document,
         dialogFinished : function (aPicker)
         {
            if (aPicker.wasCancelled == false)
            {
               currentSelection = aPicker.selectedValues[0].id;
               document.forms[0].parentFolderId.value = currentSelection;

               document.getElementById("displayFolderPath").value = convertToFriendlyPath(currentSelection);
            }
         }
      };

      rclDialog.setDialogListener(dialogListener);

      rclDialog.showFolderChooserDialog(applicationResources.getProperty("admin.reports.selectFolder.title"),
              "",
              document.forms[0].parentFolderId.value,
              false, "folderChooser", "", "public");
   }


   //--- chop off leading portion of a path (since we don't generally  show that to a user)...
   function convertToFriendlyPath(aFolderPath)
   {
      //--- private folder, we'll chop off the leading : root/customers/focus/users/lhankins portion...
      if (aFolderPath.indexOf("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/") != -1)
      {
         return aFolderPath.split("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>")[1];
      }
      //--- public folder, we'll chop off the leading : root/customers/focus/public/content portion...
      else
      {
         return aFolderPath.split("<c:out value="${rclUser.user.rootPublicContentFolderPath}"/>")[1];
      }
   }


   var uiController;
   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
   {
      document.getElementById("displayFolderPath").value = convertToFriendlyPath(currentSelection);

      uiController =  new DefaultWorkspaceUiController(document);
      uiController.getFrameSetUiController().hidePropertiesPanel();
      uiController.onFrameResize();

   });


   function checkIfValueChanged(oldValue)
   {
      var newValue = document.forms[0].reportXpath.value;
      if(oldValue != newValue)
      {
         closeColumnDefinitionDiv();
      }
   }

   function checkForContentStoreNode(xpath)
   {
     var queryIndex = xpath.lastIndexOf("query[@name=");
     var asIndex = xpath.lastIndexOf("analysis[@name=");

     return (queryIndex > -1 || asIndex > -1);
   }

   function toggleInvalidForLinkContent( shouldHide )
   {
      var hidableElements = document.getElementsByClassName("invalidForContentNodes");
      for( var index = 0; index < hidableElements.length; index++ )
      {
         var eachElement = hidableElements[index];
         eachElement.style.display = ( shouldHide ? "none" : "" );
      }
   }

   function closeColumnDefinitionDiv()
   {
      //close div
      var definitionsDiv = document.getElementById("reportColumnDefinitions");
      definitionsDiv.style.display = "none";

      //set the definition's radio button to "no" and disable
      document.forms[0].doAppendixDefinitions[1].checked = true;
      document.forms[0].doAppendixDefinitions[0].disabled = true;
      document.forms[0].doAppendixDefinitions[1].disabled = true;

      //set the value in the hidden field to no
      var definitionsRadioHidden = document.getElementById("doAppendixDefinitionsHidden");
      definitionsRadioHidden.value = "no";
   }


   // -------------------------------------------------------------------
   // hasOptions(obj)
   //  Utility function to determine if a select object has an options array
   // -------------------------------------------------------------------
   function hasOptions(obj)
   {
      if (obj!=null && obj.options!=null) { return true; }
      return false;
    }

   function moveFragment(aFromList, aToList)
   {
      if( !hasOptions( aFromList ) )
         return;

      for( var currentIndex = 0; currentIndex<aFromList.options.length; currentIndex++ )
      {
         var opt = aFromList.options[currentIndex];
         if(opt.selected)
         {
            if (!hasOptions(aToList))
            {
               var index = 0;
            }
            else
            {
               var index=aToList.options.length;
            }
            aToList.options[index] = new Option( opt.text, opt.value, false, false);
         }
      }

      for( var delIndex = (aFromList.options.length - 1); delIndex>=0; delIndex-- )
      {
         var opt = aFromList.options[delIndex];
         if (opt.selected)
            aFromList.options[delIndex] = null;
      }

      aFromList.selectedIndex = -1
      aToList.selectedIndex = -1
   }


   function saveFragmentsToHiddenField(aFragmentList, aCountField)
   {

      for(var fragmentIndex=0; fragmentIndex<aFragmentList.options.length; fragmentIndex++)
      {
         var opt = aFragmentList.options[fragmentIndex];

         var hiddenField = document.createElement('input');
         hiddenField.type = 'hidden';
         hiddenField.name = "reportFragmentId";
         hiddenField.id = "reportFragmentId";
         hiddenField.value = opt.value;
         document.forms[0].appendChild( hiddenField );
      }

      aCountField.value = aFragmentList.options.length;
   }

   function saveFragments()
   {
      saveFragmentsToHiddenField( document.forms[0].usedFragments, document.forms[0].fragmentCount);
   }
   // -------------------------------------------------------------------
   // swapOptions(select_object,option1,option2)
   //  Swap positions of two options in a select list
   // -------------------------------------------------------------------
   function swapOptions(aFragmentList,aFirstIndex,aSecondIndex)
   {
      if( aFirstIndex < 0 || aSecondIndex < 0 || aFirstIndex >= aFragmentList.options.length || aSecondIndex >= aFragmentList.options.length )
         return;
      var opt = aFragmentList.options;
      var first_selected = opt[aFirstIndex].selected;
      var second_selected = opt[aSecondIndex].selected;
      var temp = new Option(opt[aFirstIndex].text, opt[aFirstIndex].value, opt[aFirstIndex].defaultSelected, opt[aFirstIndex].selected);
      var temp2= new Option(opt[aSecondIndex].text, opt[aSecondIndex].value, opt[aSecondIndex].defaultSelected, opt[aSecondIndex].selected);
      opt[aFirstIndex] = temp2;
      opt[aSecondIndex] = temp;
      opt[aFirstIndex].selected = second_selected;
      opt[aSecondIndex].selected = first_selected;
   }

   function moveFragmentUp( aFragmentList )
   {
      var index = aFragmentList.selectedIndex;

      if( index > 0 )
         swapOptions( aFragmentList, index, index - 1 );
   }

   function moveFragmentDown( aFragmentList )
   {
      var index = aFragmentList.selectedIndex;

      if( index < aFragmentList.options.length - 1 )
         swapOptions( aFragmentList, index, index + 1 )
   }

</script>
</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

<html:xhtml/>

<html:form action="/secure/actions/admin/saveReport">
   <html:hidden property="reportId" styleId="reportId"/>
   <html:hidden property="operation"/>


   <div id="bodyDiv">
      <%--<div style="border: 3px solid rgb(64,85,128); padding:4px; background-color: #EEEEEE;height:680px;">--%>
      <div id="contentShell">
         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <c:if test="${form.operation == 'edit'}">
               <div class="pageTraverseButtons">
                  <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.reports.button.nav.next.title" altKey="admin.reports.button.nav.next.alt"
                               onclick="saveFragments(); checkNameAndGetAdjacentObject(document.forms[0].parentFolderId.value, document.forms[0].reportName.value, -1, reportSummaries, document.forms[0].reportId.value, '/secure/actions/admin/saveReport.do?reportId=');">
                     <fmt:message key="admin.reports.button.nav.next"/>
                  </html:button>
                  <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.reports.button.nav.previous.title" altKey="admin.reports.button.nav.next.alt"
                               onclick="saveFragments(); checkNameAndGetAdjacentObject(document.forms[0].parentFolderId.value, document.forms[0].reportName.value, 1, reportSummaries, document.forms[0].reportId.value, '/secure/actions/admin/saveReport.do?reportId=');">
                     <fmt:message key="admin.reports.button.nav.previous"/>
                  </html:button>
               </div>
            </c:if>
         </div>
         <div class="pageBody">
            <table>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.contentStorePath"/> </span>
                  </td>
                  <td>
                     <html:text property="reportXpath" size="90" onchange="javascript:closeColumnDefinitionDiv();"/>
                     <input type="button" value="..." onclick="javascript:showCrnFilePicker();"/>
                     <br/>
                     <span style="color:red;">
                        <html:errors bundle="rcl" property="reportXpath"/>
                     </span>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.reportName"/> </span>
                  </td>
                  <td>
                     <html:text property="reportName" size="90"/>

                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.rclFolder"/> </span>
                  </td>
                  <td>
                     <html:hidden property="parentFolderId"/>
                     <input type="text" name="displayFolderPath" id="displayFolderPath"
                            style="width:405px; background-color:gainsboro;" readonly="readonly"/>

                     <c:choose>
                        <c:when test="${form.operation == 'edit'}">
                           <!--Previously disabled on edit-->
                           <html:button property="" value="..." onclick="pickRclFolder();"/>
                        </c:when>
                        <c:otherwise>
                           <html:button property="" value="..." onclick="pickRclFolder();"/>
                        </c:otherwise>
                     </c:choose>
                  </td>
               </tr>
               <tr class="invalidForContentNodes">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.customPromptScreen"/> </span>
                  </td>
                  <td>
                     <html:select property="customPromptId">
                        <html:optionsCollection property="customPrompts"/>
                     </html:select>
                  </td>
               </tr>
               <tr class="invalidForContentNodes">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.extraPromptParams"/> </span>
                  </td>
                  <td>
                     <html:text property="extraPromptParams" size="90"/>

                  </td>
               </tr>
               <tr class="invalidForContentNodes">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.maxExecutionTime"/>  </span>
                  </td>
                  <td>
                     <html:text property="maxExecutionTime" size="10"/> secs
                     <br>  (For no set max execution time please enter 0)

                  </td>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.hideReport"/> </span>
                  </td>
                  <td>
                     <html:checkbox property="hidden"/>

                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.offlineReport"/></span>
                  </td>
                  <td>
                     <html:checkbox property="offline"/>
                  </td>
               </tr>
               <tr class="invalidForContentNodes">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.drillInFrame"/></span>
                  </td>
                  <td>
                     <html:checkbox property="drillInFrame"/>
                  </td>
               </tr>

               <tr class="invalidForContentNodes">
                  <td class="label" valign="top">
      <script type="text/javascript">
         function toggleReadonly(isModify, definitionIndex)
         {
            definitionElem = document.getElementById("definition"+definitionIndex);
            definitionElem.readOnly=!isModify;

            if (isModify == false)
            {
      //         alert("set to FM definition");
               definitionFromFMElem = document.getElementById("definitionFromFM"+definitionIndex);
               definitionElem.value = definitionFromFMElem.value;
            }

         }
      </script>
                     <html:hidden property="reportColumnDefinitionsSize"/>
                     <fmt:message key="admin.reports.columnDefinitions"/>
                  </td>
                  <td>
                     <script type="text/javascript">
                        function toggleColumnDefinitions(isShowDefinitions)
                        {
                           if(isShowDefinitions == "yes")
                           {
                              document.getElementById('reportColumnDefinitions').style.display = "";
                           }
                           else if(isShowDefinitions == "no")
                           {
                              document.getElementById('reportColumnDefinitions').style.display = "none";
                           }
                        }
                     </script>
                     <fmt:message key="admin.reports.showColumnDefsInReport"/>
                     <c:choose>
                     <c:when test="${form.operation == 'edit'}">
                        <html:radio property="doAppendixDefinitions" value="yes" onclick="javascript:toggleColumnDefinitions(this.value)" styleId="doAppendixDefinitions"/><fmt:message key="admin.reports.showColumnDefsInReport.yes"/>
                        <html:radio property="doAppendixDefinitions" value="no"  onclick="javascript:toggleColumnDefinitions(this.value)" styleId="doAppendixDefinitions"/><fmt:message key="admin.reports.showColumnDefsInReport.no"/>
                     </c:when>
                     <c:otherwise>
                        <html:radio property="doAppendixDefinitions" value="yes" onclick="javascript:toggleColumnDefinitions(this.value)" disabled="true" styleId="doAppendixDefinitions"/><fmt:message key="admin.reports.showColumnDefsInReport.yes"/>
                        <html:radio property="doAppendixDefinitions" value="no"  onclick="javascript:toggleColumnDefinitions(this.value)" disabled="true" styleId="doAppendixDefinitions"/><fmt:message key="admin.reports.showColumnDefsInReport.no"/>
                     </c:otherwise>
                     </c:choose>
                     <html:hidden property="doAppendixDefinitions" styleId="doAppendixDefinitionsHidden"/>
                     <html:hidden property="isDefinitionsUnavailable"/>
                     <div style="border:0px; overflow:auto; height:250px" id="reportColumnDefinitions">
                     <table class="columnDefinitions">
                        <c:choose>
                        <c:when test="${form.isDefinitionsUnavailable}">
                           <tr><td><fmt:message key="admin.reports.columnDefinitionsUnavailable"/> </td></tr>
                        </c:when>
                        <c:otherwise>
                              <tr><th><fmt:message key="admin.reports.columnDefinitions.column"/> </th><th><fmt:message key="admin.reports.columnDefinitions.override"/></th><th><fmt:message key="admin.reports.columnDefinitions.definition"/> </th></tr>
                              <c:forEach items="${form.reportColumnDefinitions}"
                                         var="currentReportColumnDefinitionForm"
                                         varStatus="reportColumnDefinitionStatus">
                                 <tr valign="top">
                                    <td>
                                       <c:set var="reportColumnDefinitionArrayIndex" scope="page" value="${reportColumnDefinitionStatus.index}"/>

                        <span id="<c:out value='reportColumnDefinition${pageScope.reportColumnDefinitionArrayIndex}DivSummary'/>"
                              style="display:none">&nbsp;-&nbsp;
                            <input type="text"
                                   id="<c:out value='reportColumnDefinition${pageScope.reportColumnDefinitionArrayIndex}DivSummaryOutput'/>"
                                   readonly="true"/>
                        </span>
                                       <html:hidden property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].ref"/>
                                       <html:hidden property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].reportColumnDefinitionId"/>
                                       <html:hidden property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].reportColumn"/>
                                       <c:out value="${currentReportColumnDefinitionForm.reportColumn}"/>
                                          <%--<html:text property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].reportColumn" readonly="true"/>--%>
                                    </td>
                                    <td align="center">
                                       <c:choose>
                                          <c:when test="${currentReportColumnDefinitionForm.isCalculatedColumn}">
                                             <html:hidden property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].isCalculatedColumn"/>
                                             <html:checkbox property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].isFMOverriden"
                                                               styleId="checkBox${pageScope.reportColumnDefinitionArrayIndex}"
                                                               disabled="true"/>
                                          </c:when>
                                          <c:otherwise>
                                             <html:checkbox property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].isFMOverriden"
                                                               onclick="javascript:toggleReadonly(this.checked, '${pageScope.reportColumnDefinitionArrayIndex}');"
                                                               styleId="checkBox${pageScope.reportColumnDefinitionArrayIndex}"/>
                                          </c:otherwise>
                                       </c:choose>

                                    </td>
                                    <td>


                                       <html:textarea rows="3" cols="60" property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].definition" readonly="true" styleId="definition${pageScope.reportColumnDefinitionArrayIndex}"/>
                                       <html:hidden property="reportColumnDefinitions[${pageScope.reportColumnDefinitionArrayIndex}].definitionFromFM" styleId="definitionFromFM${pageScope.reportColumnDefinitionArrayIndex}"/>
                                       <script type="text/javascript">
                                          var definition = document.getElementById('definition<c:out value="${pageScope.reportColumnDefinitionArrayIndex}"/>');
                                          definition.readOnly = !document.getElementById('checkBox<c:out value="${pageScope.reportColumnDefinitionArrayIndex}"/>').checked
                                       </script>
                                    </td>
                                    <!--</div>-->
                                 </tr>
                              </c:forEach>
                        </c:otherwise>
                     </c:choose>
                     </table>
                     </div>
                     <script type="text/javascript">
                        if(document.forms[0].doAppendixDefinitions[0].checked == true)
                        {
                           toggleColumnDefinitions("yes");
                        }
                        else
                        {
                           toggleColumnDefinitions("no");
                        }
                     </script>

                  </td>
               </tr>

               <tr>
                  <td class="label" valign="top">
                     <fmt:message key="admin.reports.reUseAlgorithmClass"/>
                  </td>
                  <td>
                     <html:text property="reUseAlgorithm" size="90"/>
                  </td>
               </tr>
               <tr>
                  <td class="label" valign="top">
                     <fmt:message key="admin.reports.reUseAlgorithmParameters"/>
                  </td>
                  <td>
                     <html:text property="reUseAlgorithmParameters" size="90"/>
                  </td>
               </tr>

               <tr class="invalidForContentNodes">
                  <td class="label" valign="top">
                     <fmt:message key="admin.reports.fragmentHeader"/>
                  </td>
                  <td>
                     <div style="border:0px; overflow:auto; height:250px" id="reportFragmentSelection">
                        <!--fragment id array and array size fields (actual array size may be larger than count in action)-->
                        <html:hidden property="fragmentCount"/>

                        <!--todo this is the fragment selection div-->
                        <table>
                           <tr>
                              <td>
                                 <fmt:message key="admin.reports.availableFragments"/>
                              </td>
                              <td></td>
                              <td>
                                 <fmt:message key="admin.reports.usedFragments"/>
                              </td>
                              <td></td>
                           </tr>
                           <tr>
                              <td>
                                 <select id="availableFragments" size="10" style="width:250px">
                                    <c:forEach items="${form.availableFragments}" var="currentFragment">
                                       <option value="<c:out value='${currentFragment.id}'/>"><c:out value='${currentFragment.name}'/></option>
                                    </c:forEach>
                                 </select>
                              </td>
                              <td>
                                 <input type="button"
                                        onclick="moveFragment( document.forms[0].availableFragments, document.forms[0].usedFragments )"
                                        value=">>"/><br/>
                                 <input type="button"
                                        onclick="moveFragment( document.forms[0].usedFragments, document.forms[0].availableFragments )"
                                        value="<<"/><br/>
                              </td>
                              <td>
                                 <select id="usedFragments" size="10" style="width:250px">
                                    <c:forEach items="${form.reportFragments}" var="currentFragment">
                                       <option value="<c:out value='${currentFragment.id}'/>"><c:out value='${currentFragment.name}'/></option>
                                    </c:forEach>
                                 </select>
                              </td>
                              <td>
                                 <!--order fragments-->
                                 <!--todo: string value should be replaced by up and down arrow images-->
                                 <input type="button" onclick="moveFragmentUp( document.forms[0].usedFragments );" value="up"/><br/>
                                 <input type="button" onclick="moveFragmentDown( document.forms[0].usedFragments );" value="down"/><br/>
                              </td>
                           </tr>
                        </table>
                     </div>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.preProcessorName"/></span>
                  </td>
                  <td>
                     <html:select property="preProcessorChainId" style="width:250px">
                        <option value="0"/>
                        <html:optionsCollection property="preProcessorChainList" label="name" value="id"/>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.outputProcessorName"/></span>
                  </td>
                  <td>
                     <html:select property="outputProcessorChainId" style="width:250px">
                        <option value="0"/>
                        <html:optionsCollection property="outputProcessorChainList" label="name" value="id"/>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.reports.postProcessorName"/></span>
                  </td>
                  <td>
                     <html:select property="postProcessorChainId" style="width:250px">
                        <option value="0"/>
                        <html:optionsCollection property="postProcessorChainList" label="name" value="id"/>
                     </html:select>
                  </td>
               </tr>

               <%@ include file="/WEB-INF/pages/rcl/admin/managePermissions.jsp"%>
               <tr>
                  <td colspan="2">
                     <html:hidden property="viewGesture"/>
                     <html:button property="" bundle="rcl" altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" onclick="setViewGesture('OK'); saveFragments(); checkNameAndSubmitReport(document.forms[0].parentFolderId.value, document.forms[0].reportName.value, document.forms[0].reportId.value, document.forms[0].reportXpath.value,document.forms[0].maxExecutionTime.value);">
                        <fmt:message key="admin.button.ok"/>
                     </html:button>
                     <html:submit onclick="setViewGesture('Cancel');" bundle="rcl" altKey="admin.button.cancel.alt" titleKey="admin.button.cancel.title">
                        <fmt:message key="admin.button.cancel"/>
                     </html:submit>
                     <script type="text/javascript">
                        function setViewGesture(gesture)
                        {
                           document.forms[0].viewGesture.value = gesture;
                        }
                        toggleInvalidForLinkContent( checkForContentStoreNode( document.forms[0].reportXpath.value) );
                     </script>

                  </td>
               </tr>
            </table>
         </div>
      </div>
   </div>
</html:form>
</body>
</html>
