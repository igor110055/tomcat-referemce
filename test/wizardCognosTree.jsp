<!-- Do NOT put any DOCTYPE here unless you want problems in IEs. -->
<html>

<!-- Each valid html page must have a head; let's create one. -->
<head>
   <!-- The following line defines content type and utf-8 as character set. -->
   <!-- If you want your application to work flawlessly with various local -->
   <!-- characters, just make ALL strings, on the page, json and database utf-8. -->
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

   <!-- Ext relies on its default css so include it here. -->
   <!-- This must come BEFORE javascript includes! -->
   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css">
   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-gray.css" />

   <!-- Include here your own css files if you have them. -->

   <!-- First of javascript includes must be an adapter... -->
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base-debug.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>--%>

   <!-- ...then you need the Ext itself, either debug or production version. -->
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all.js"></script>--%>

   <!-- Include here your extended classes if you have some. -->
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <style type="text/css">
      .wizard-icon-namespace { background-image: url('<%=request.getContextPath()%>/images/md/namespace.gif') !important; }
      .wizard-icon-querySubject { background-image: url('<%=request.getContextPath()%>/images/md/querySubject.gif') !important; }
      .wizard-icon-queryItemMeasure { background-image: url('<%=request.getContextPath()%>/images/md/queryItemMeasure.gif') !important; }
      .wizard-icon-queryItemAttribute { background-image: url('<%=request.getContextPath()%>/images/md/queryItemAttribute.gif') !important; }
      .wizard-icon-calculation { background-image: url('<%=request.getContextPath()%>/images/md/calculation.gif') !important; }
      .wizard-icon-filter { background-image: url('<%=request.getContextPath()%>/images/md/filter.gif') !important; }
      .wizard-icon-dimension { background-image: url('<%=request.getContextPath()%>/images/md/dimension.gif') !important; }
      .wizard-icon-hierarchy { background-image: url('<%=request.getContextPath()%>/images/md/hierarchy.gif') !important; }
      .wizard-icon-level { background-image: url('<%=request.getContextPath()%>/images/md/level.gif') !important; }
      .wizard-icon-queryItemMeasure { background-image: url('<%=request.getContextPath()%>/images/md/queryItemMeasure.gif') !important; }
      .wizard-icon-member { background-image: url('<%=request.getContextPath()%>/images/md/member.gif') !important; }
   </style>

   <!-- Include here you application javascript file if you have it. -->
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/test/wizardCognosTree.js"></script>

   <!-- Set a title for the page (id is not necessary). -->
   <title id="page-title">Title001</title>

   <!-- You can have onReady function here or in your application file. -->
   <!-- If you have it in your application file delete the whole -->
   <!-- following script tag as we must have only one onReady. -->
   <script type="text/javascript">

   // Path to the blank image must point to a valid location on your server
   Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/scripts/lib/ext/resources/images/default/s.gif';

   // Main application entry point
//   Ext.onReady(function() {
//      // write your application here
//   });
   </script>

<!-- Close the head -->
</head>

<!-- You can leave the body empty in many cases, or you write your content in it. -->
<body id='docBody'></body>

<!-- Close html tag at last -->
</html>
