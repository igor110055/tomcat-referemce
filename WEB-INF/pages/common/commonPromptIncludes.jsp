<%--
  ~ Copyright (c) 2001-2013. Motio, Inc.
  ~ All Rights reserved
  --%>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-<%=authentication.getRclUser().getPreferences().getTheme()%>.css" />

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/ext-adf.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/fileuploadfield.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/MultiSelect.css"/>




<style type="text/css" xml:space="preserve">

      .dk_divListItems
      {
         display:block;
         overflow:auto;
         /*border: 1px solid gray; //I don't like this border*/
         list-style-type: none;
         padding: 2px 2px 2px 5px;
         margin: 0px;
         white-space: nowrap;		/* force one-line text */
         cursor:pointer;
      }

      .dk_divListHover
      {
         background-color:#CCCCCC;
         cursor:pointer;
      }

      .dk_emptyMessage {
         text-align:center;
         padding-top:40px;
         position:relative;
      }

   .dk_rotateRight {
      -webkit-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
   }

   .dk_rotateRightIcon {
      /*-webkit-transform: rotate(90deg);*/
      /*-moz-transform: rotate(90deg);*/
      /*filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);*/
      background-image: url(<%=request.getContextPath()%>/images/page-prev.gif.gif) !important;;
      /*background-image: url(/images/page-prev.gif) !important;*/
   }
   </style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
<%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ux-all.js"></script>--%>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
<%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all.js"></script>--%>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfFacade.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/DateParameterWidget.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/ListBoxWidget.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfExtUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/PagedListValuePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/ValuePickerListBoxWidget.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/SearchAndSelectWidget.js"></script>
