<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>


<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
  <head>
     <title>prompt viewer</title>

     <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
     <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>     
     <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
     <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp"%>

     <style type="text/css">
        iframe {
           width: 100%;
           height: 100%;
        }
     </style>

     <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
     <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/cognosPromptViewer/CognosPromptViewerUi.js"></script>


   <script type="text/javascript">
      var uiController = new CognosPromptViewerUiController(this);

   </script>

  </head>
  <body onload="uiController.initUi();">
     <script type="text/javascript">


   var iframePromptPanel = new Ext.Panel({
      autoScroll:true,
      title: 'Cognos Prompt'
   });

   var iframeXMLPromptPanel = new Ext.Panel({
      autoScroll:true,
      title: 'XML Prompt',
      listeners: {activate: handleLoadXmlPanel}
   });

    var tabs = new Ext.TabPanel({
        renderTo: document.body,
        frame: true,
        activeTab: 0,
//        width:'100%',
        height:500,
        plain:true,
        defaults:{autoScroll: true},
        items:[iframePromptPanel,iframeXMLPromptPanel]
    });

        Ext.DomHelper.append(iframePromptPanel.body, {
               tag: 'iframe',
               id: 'cognosPromptIframe',
               name: 'cognosPromptIframe'
//               width:'100'
            }, true);

   function handleLoadXmlPanel(tab)
   {
      if(!tab.isXmlPanelLoaded)
      {
         Ext.DomHelper.append(iframeXMLPromptPanel.body, {
               tag: 'iframe',
               src: ServerEnvironment.baseUrl + '/secure/actions/capturePromptValues/displayXmlPrompt.do',
               width:'100%'
            }, true);
      }
      tab.isXmlPanelLoaded = true;
   }

      //we post the values to the server to avoid hitting IEs url character limit
      var iframeHtml;
      iframeHtml = '<form id="capturePromptValuesForm" method="POST" target="cognosPromptIframe" action="' + ServerEnvironment.baseUrl + '/secure/actions/capturePromptValues/prompt.do' + '">';
      iframeHtml += '<input type="hidden" name="reportSearchPath" value="${form.jsUrlEncodedReportSearchPath}"/>';
      iframeHtml += '<input type="hidden" name="actionWhenDone" value="${form.actionWhenDone}"/>';
      iframeHtml += '<input type="hidden" name="actionWhenCancelled" value="${form.actionWhenCancelled}"/>';
      iframeHtml += '<input type="hidden" name="actionWhenNoReportParameters" value="${form.actionWhenNoReportParameters}"/>';
      iframeHtml += '<input type="hidden" name="crnBrowserEndPoint" value="${form.crnBrowserEndPoint}"/>';
      iframeHtml += '<input type="hidden" name="trackingInfo" value="${form.trackingInfo}"/>';
      iframeHtml += '<input type="hidden" name="reiXml" value="${form.reiXml}"/>';
      iframeHtml += '</form>';

        var div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = iframeHtml;
        document.getElementById('capturePromptValuesForm').submit();
        document.body.removeChild(div);
     </script>

  </body>
</html>