<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css"/>
<%--<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-<%=userPreference.getTheme()%>.css" />--%>
<%--<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-galdaka.css" />--%>
<%--<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-slickness.css" />--%>
<%--<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-gray.css" />--%>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/ext-adf.css"/>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/scripts/rcl/ext-adf/common/ext-overrides.js"></script>

<script type="text/javascript">
   var Adf;
   Ext.namespace('Adf');

   Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/images/blank-1x1.gif';

   //this is a hack to fix a problem with IE9 range support
   //Ext 3.3+ reportedly does not have the issue, so this can be removed if or when we upgrade

   try
   {
      if(Range)
      {
         if (typeof Range.prototype.createContextualFragment == "undefined") {
          Range.prototype.createContextualFragment = function(html) {
              var startNode = this.startContainer;
              var doc = startNode.nodeType == 9 ? startNode : startNode.ownerDocument;
              var container = doc.createElement("div");
              container.innerHTML = html;
              var frag = doc.createDocumentFragment(), n;
              while ( (n = container.firstChild) ) {
                  frag.appendChild(n);
              }
              return frag;
          };
         }
      }
   }
   catch(exception)
   {
      //eat the error
   }
</script>

<script type="text/javascript" src="<%=request.getContextPath() %>/scripts/rcl/ext-adf/common/MultipleEmailValidation.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/overrides/BasicAdfForm.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/overrides/AdfFormPanel.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfFacade.js"></script>

<script type="text/javascript">
   // Listen to exception event fired by all proxies
   // handle timeouts and anything else that needs handlin'
   Ext.data.DataProxy.on('exception', RequestUtil.handleDataProxyException);
</script>

<%-- Flexpoint for Customer Projects to Inject their own stuff here --%>
<%@ include file="/WEB-INF/pages/common/customer-includes/extIncludes-fragment.jsp" %>