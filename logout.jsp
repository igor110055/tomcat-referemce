<%@ page import="com.focus.rcl.RclAppContext" %>
<%@ page import="com.focus.rcl.service.IStatisticsService" %>
<%@ page import="com.focus.rcl.RclConstants" %>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

<%
   IStatisticsService statsService = (IStatisticsService) RclAppContext.getAppContext().getBean(IStatisticsService.BEAN_NAME);
   statsService.sessionLoggedOff(session.getId(), RclConstants.localHostName);
   session.invalidate();
   response.sendRedirect(request.getContextPath());
%>
