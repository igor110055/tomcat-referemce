<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<%--
   welcome page... forwards to either login or enterApplication

   ---------------------------
   @author : Lance Hankins, Ryan Baula

   $Id: index.jsp 3439 2006-10-20 22:26:50Z lhankins $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

<logic:redirect page="/secure/actions/enterApplication.do"/>
