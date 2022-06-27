<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   displays details about a report that is just a link to cognos connection...

   ---------------------------
   @author : Jonathan James (jjames@focus-technologies.com)

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
   <title></title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportInstance.js"></script>

   <style type="text/css">
      @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
      *.propertyLabel {
         display: inline;
         text-align: right;
         font-weight: bold;
         padding-right: 3px;
      }

      #topProps *.propertyLabel {
         width: 160px;
         min-width: 160px;
      }

      *.propertyValue {
         display: inline;
      }

      #parametersDiv {
         border: 0px solid black;
         margin: 5px 0px 0px 30px;
         width: 280px;
/*
         overflow: auto;
         height: 145px;
*/
      }

      thead {
         background-color: #EFEBDE;
         color: black;
         font-weight: bold;
      }

      table.paramTable {
         width: 100%;
         border-collapse: collapse;
      }

      table.paramTable td {
         border: 1px solid #777777;
      }

      td.paramName {
         text-align: right;
         padding-right: 3px;
         vertical-align: top;
      }

      td.paramValue {
         text-align: left;
         vertical-align: top;
      }

      #propertiesDiv {
         height: 100px;
         /*width: 100%;*/
      }

      #topProps {
         /*width: 100%;*/
         border: 0px solid red;
         margin-bottom: 10px;
      }

      #leftProps {
         width: 50%;
         border: 0px solid blue;
         float: left;
         margin-right: 10px;
      }

      #rightProps {

         height: 100px;
         overflow: auto;
         border: 0px solid green;
         float: left;
      }
   </style>
</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">


   <script type="text/javascript">
      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         if (!is_ie)
            window.onresize = function (anEvent) { uiController.onFrameResize(); };

         uiController.onFrameResize();
      });

      var uiController = new DefaultPropertiesUiController(document);
   </script>


   <div id="bodyDiv">
      <div id="contentShell" class="propertiesPanel"s>



         <div id="propertiesDiv">
            <div id="topProps">
               <div class="propertyLabel">Report Name:</div>

               <div class="propertyValue">${contentNodeDetailsForm.contentNodeName}</div><br/>

               <div class="propertyLabel">Report Description:</div>

               <div class="propertyValue" id="reportDescription">

                  <script type="text/javascript">
                     function trimReportDescription(reportDescription, maxLength)
                     {
                        if (reportDescription == null || reportDescription == "")
                        {
                           reportDescription = "none";
                        }
                        else if(reportDescription.length > maxLength)
                        {
                           var trimmed = reportDescription.substring(0, maxLength);
                           reportDescription = "<div style=\\\'margin-right: 10px; text-align: center;\\\'>"+ reportDescription + "</div>";
                           trimmed = trimmed + "... ";
                           trimmed = trimmed + "<a href=\"javascript:parent.workSpace.showDialog(\'"+ escape(reportDescription) +"\', \'Report Description\', \'oneByOneWhite.gif\', -1, -1);\">more</a>";
                           return trimmed;
                        }
                        return reportDescription
                     }

                     document.write(trimReportDescription('<c:out value="${contentNodeDetailsForm.reportDescription}"/>', 80));
                  </script>
               </div>
            </div>
         </div>

      </div>
   </div>






</body>
</html>
