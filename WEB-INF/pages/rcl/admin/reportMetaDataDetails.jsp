<%@ page import="com.focus.rcl.RclEnvironment" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   View / Edit the details on a single report's metadata

   ---------------------------
   @author : Lance Hankins

   $Id: reportMetaDataDetails.jsp 8902 2014-06-25 12:30:32Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Manage Metadata</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         td.label {
            text-align: right;
            padding-right:10px;
            background-color: #AAAAAA;
         }

         table.withBorder {
            border: 1px solid gray;
            border-collapse: collapse;
            /*width:100%;*/
         }

         table.withBorder  td {
            border: 1px solid gray;
            padding:5px;
         }

         thead td {
            background-color: #AAAAAA;
            font-weight:bold;
         }

         div.queries {
            border: 1px solid #AAAAAA;
            padding: 10px;
            margin-top:  10px;
         }
         div.query {
            border: 1px solid #AAAAAA;
            padding: 4px 10px 10px 10px;
            margin-top:  10px;
         }
         #reportCapabilities {
            border: 1px solid #AAAAAA;
            padding: 4px 10px 10px 10px;
            margin-top:  10px;
         }

         #reportCapabilities fieldset {
            padding-bottom:20px;
         }

         #outputFormats fieldset {
            /*height:100px;*/
            float:left;
            padding-bottom:20px;
         }
      </style>
      <script type="text/javascript">
      </script>
   </head>
   <body class="rclBody" style="height:100%;overflow:scroll;">
      <html:xhtml/>

      <html:form action="/secure/actions/admin/reportMd/save.do" method="post">
         <html:hidden property="reportId"/>

         <h2><c:out value="${form.report.defaultName}"/></h2>


         <table class="withBorder">
            <tr>
               <td class="label">
                  ADF Report Path:
               </td>
               <td>
                  <c:out value="${form.report.simplePath}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Cognos Report Path:
               </td>
               <td>
                  <c:out value="${form.report.contentStorePath.value}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Cognos Package:
               </td>
               <td>
                  <c:out value="${form.report.reportMetaData.packagePath}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Report Version
               </td>
               <td>
                  <c:out value="${form.report.reportMetaData.reportSpecVersion}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Package Version
               </td>
               <td>
                  <c:out value="${form.report.reportMetaData.packageVersion}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Last Cached Report Spec at:
               </td>
               <td>
                  <c:out value="${form.report.reportMetaData.cachedReportSpecAt}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Max age for cached Report Spec:
               </td>
               <td>
                  <c:out value="${form.report.reportMetaData.maxAgeForCachedReportSpecXml}"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  Number of Queries:
               </td>
               <td>
                  <c:out value="${fn:length(form.report.reportMetaData.childQueryMetadata)}"/>
               </td>
            </tr>
         </table>
         <div id="reportCapabilities">
            <h4>Report Capabilities</h4>

            <div style="float:left; margin-right:20px; ">
               <fieldset>
                  <legend>Runtime Content Adjustments</legend>

                  <table>
                     <tr>
                        <td>
                           <html:checkbox property="supportsRuntimeFilters">Runtime Filters</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsContentInsertion">Content Insertion</html:checkbox>
                        </td>
                     </tr>
                     <tr>
                        <td>
                           <html:checkbox property="supportsModifySorts">Modify Sorts</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsContentSuppression">Content Suppression</html:checkbox>

                        </td>
                     </tr>
                  </table>


               </fieldset>
            </div>

            <div id="outputFormats">
               <fieldset>
                  <legend>Supported Output Formats</legend>

                  <table>
                     <tr>
                        <td>
                           <html:checkbox property="supportsHtmlFormat">HTML</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsPagedHtml">Paged HTML</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsHtmlFragmentFormat">HTMLFragment</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsMhtFormat">MHT</html:checkbox>
                        </td>
                     </tr>
                     <tr>
                        <td>
                           <html:checkbox property="supportsPdfFormat">PDF</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsXhtmlFormat">XHTML</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsXmlFormat">XML</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsLayoutDataXmlFormat">LayoutDataXML</html:checkbox>
                        </td>
                     </tr>
                     <tr>
                        <td>
                           <html:checkbox disabled="<%=RclEnvironment.getScalarCognosVersion() >= 10%>" property="supportsSingleXlsFormat">Single Sheet Excel</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox disabled="<%=RclEnvironment.getScalarCognosVersion() >= 10%>" property="supportsXlsFormat">Excel</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsXlwaFormat">XLWA</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsXlsxDataFormat">Excel Data</html:checkbox>
                        </td>

                     </tr>
                     <tr>
                        <td>
                           <html:checkbox property="supportsSpreadsheetMLFormat">SpreadsheetML (Excel 2007)</html:checkbox>
                        </td>
                        <td>
                           <html:checkbox property="supportsCsvFormat">CSV</html:checkbox>
                        </td>
                        <td colspan="2"></td>
                     </tr>
                  </table>
               </fieldset>
            </div>

            <div style="clear:both"></div>

            <br/>
            <html:submit value="Save Changes"/>

         </div>

         <h3>Parameters</h3>
         <div class="parameters">

            <c:choose>
               <c:when test="${empty form.report.parameterInfo}">
                  This report has no parameters
               </c:when>
               <c:otherwise>
                  <table class="withBorder">
                     <thead>
                        <td>Parameter Name</td>
                        <td>Data Type</td>
                        <td>Model Filter Item</td>
                        <td>Multi Value</td>
                        <td>Required</td>
                        <td>Unbounded Range</td>
                        <td>Bounded Range</td>
                     </thead>
                     <tbody>
                        <c:forEach var="eachParam" items="${form.report.parameterInfo}">
                           <tr>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.name}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.dataType}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.modelFilterItem}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.multiValue}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.required}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.unboundedRange}"/>
                              </td>
                              <td>
                                 <c:out value="${eachParam.rawParameterInfo.boundedRange}"/>
                              </td>
                           </td>
                        </c:forEach>
                     </tbody>
                  </table>


               </c:otherwise>
            </c:choose>

         </div>



         <h3>Queries</h3>
         <div class="queries">

            <c:forEach var="eachQuery" items="${form.report.reportMetaData.childQueryMetadata}">
               <div class="query">
                  <h4>
                     <c:out value="${eachQuery.name}"/>
                  </h4>

                  <table class="withBorder">
                     <tr>
                        <td class="label">
                           Number of Visible Data Items
                        </td>
                        <td>
                           <c:out value="${eachQuery.numberOfVisibleDataItems}"/>
                        </td>
                     </tr>
                     <tr>
                        <td class="label">
                           Sub-Queries
                        </td>
                        <td>
                           <c:out value="${eachQuery.numberOfSubQueries}"/>
                        </td>
                     </tr>
                     <tr>
                        <td class="label">
                           Last Generated
                        </td>
                        <td>
                           <c:out value="${eachQuery.lastGeneratedOn}"/>
                        </td>
                     </tr>
                     <tr>
                        <td class="label">
                           Time Required to Generate
                        </td>
                        <td>
                           <c:out value="${eachQuery.timeRequiredToGenerate}"/>
                        </td>
                     </tr>
                  </table>


                  <c:choose>
                     <c:when test="${empty eachQuery.childDataItems}">
                        <h4>No Visible Data Items for <c:out value="${eachQuery.name}"/></h4>
                     </c:when>
                     <c:otherwise>
                        <h4>Data Items for <c:out value="${eachQuery.name}"/></h4>
                        <table class="withBorder">
                           <thead>
                              <td>Name</td>
                              <td>Expression</td>
                              <td>Data Type</td>
                              <td>Value Picker Hint</td>
                              <td>Row Level Security</td>
                              <td>Manually Edited</td>
                              <td>Supports Runtime Filters</td>
                              <td>Visible in Report</td>
                           </thead>
                           <tbody>
                              <c:forEach var="eachDataItem" items="${eachQuery.childDataItemsSortedByName}">
                                 <tr>
                                    <td>
                                       <a href="<%=request.getContextPath()%>/secure/actions/admin/reportMd/dataItem/edit.do?reportDataItemMetaDataId=<c:out value="${eachDataItem.id}"/>&reportId=<c:out value="${form.report.id}"/>">
                                          <c:out value="${eachDataItem.name}"/>
                                       </a>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.expression}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.dataType}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.pickValueParamHint.name}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.rowLevelSecurityApplies}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.hasBeenManuallyEdited}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.supportsRuntimeFilters}"/>
                                    </td>
                                    <td>
                                       <c:out value="${eachDataItem.visibleInReport}"/>
                                    </td>
                                 </tr>
                              </c:forEach>
                           </tbody>
                        </table>
                     </c:otherwise>
                  </c:choose>



                     

               </div>

            </c:forEach>   
         </div>
      </html:form>

      <br/>
      <a href="<%=request.getContextPath()%>/secure/actions/admin/reportMd/rescan.do?reportId=<c:out value="${form.report.id}"/>">
         Scan Cognos for Changes to This Report
      </a>
      <br/>
      <a href="<%=request.getContextPath()%>/secure/actions/admin/reportMd/menu.do">Back To Menu</a>

   </body>
</html>
