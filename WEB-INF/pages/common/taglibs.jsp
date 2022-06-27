<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>

<%--
NOTE: after upgrading struts, jakarta-taglibs, and servletspec, we no
longer need two separate verisons of each taglib (EL and non-EL).
--%>
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-nested" prefix="nested" %>

<%--<%@ taglib uri="http://struts-menu.sf.net/tag-el" prefix="menu" %>--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>



<%@ taglib uri="/WEB-INF/rcl.tld" prefix="rcl" %>

<%-- Set all pages that include this page (particularly tiles) to use XHTML --%>
<html:xhtml />