<%@ page import="com.focus.rcl.RclEnvironment,
                 com.focus.rcl.web.app.RclWebtierController" %>
<%--
  Created by IntelliJ IDEA.
  User: Administrator

--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>

<html>
<title>Expired Password</title>

<body>
<%
   String redirectURL = RclEnvironment.getCrnBrowserEndPoint() + "?CAMUsername=" + request.getUserPrincipal().getName() + "&CAMPassword=&b_action=xts.run&m=portal/bridge.xts&c_mode=get&c_cmd=" + RclEnvironment.getRclBaseUrl() + "/secure/actions/changeExpired.do";
   response.sendRedirect(redirectURL);
%>

</body>
</html>
</html>