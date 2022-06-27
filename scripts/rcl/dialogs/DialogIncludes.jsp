<%--
   This file includes all stylesheets and JS files required to use the jtDialog

   ---------------------------
   @author : Nithy Palanivelu

   $Id: DialogIncludes.jsp 2686 2006-05-30 16:53:05Z lhankins $

--%>


<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/dialogs/drag/jt_DialogBox.css";
   @import "<%=request.getContextPath()%>/styles/rcl/dialogs/drag/veils.css";

   .rclAlert
   {
      /*margin-top: 5px;*/
      text-align:center;
      width: 275px;
      min-height: 50px;
   }

</style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/drag/jt_util.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/drag/dom-drag.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/drag/jt_DialogBox.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/drag/jt_AppDialogs.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/alertDialogs.js"></script>


<script type="text/javascript">

   jt_DialogBox.imagePath = "<%=request.getContextPath()%>/images/";

</script>
