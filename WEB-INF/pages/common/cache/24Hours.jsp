<%@ page import="com.focus.ftl.util.TimeLength"%>

<%
   response.addDateHeader("Expires", System.currentTimeMillis() + TimeLength.MILLI_SECONDS_PER_DAY);
   response.addHeader("Cache-Control", "private");
   response.addHeader("Pragma", "private");
%>

