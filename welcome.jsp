<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<%--
   welcome page... forwards to login action (we don't want people to hit the login.jsp
   directly, they need to go through the action...)

   ---------------------------
   @author : Lance Hankins

   $Id: welcome.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

<logic:redirect page="/actions/loginPromptAction.do"/>
