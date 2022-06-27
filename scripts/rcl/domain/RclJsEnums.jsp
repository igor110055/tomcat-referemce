<%@ page import="com.focus.rcl.core.ContentNodeTypeEnum,
                 com.focus.rcl.core.DeliveryTypeEnum,
                 com.focus.rcl.core.ModifiableContentTypeEnum,
                 com.focus.rcl.crn.reportspec.CrnChartTypeEnum,
                 com.focus.rcl.crn.reportspec.RelationalInsertionPointEnum,
                 com.focus.rcl.reportservice.ReportExecutionStatusEnum,
                 com.focus.rcl.scheduler.ScheduleStatusEnum,
                 com.focus.rcl.scheduler.ScheduleTypeEnum"%><%@ page import="com.focus.rcl.reportservice.ReportExecutionPagingStatusEnum"%><%@ page import="com.focus.rcl.crn.*"%>
      <%--
        This JSP dynamically generates a .JS file which contains javascript
        representations of frequently used enums...

        ---------------------------
        @author : Lance Hankins (lhankins@focus-technologies.com)

        $Id: RclJsEnums.jsp 8282 2013-04-26 23:30:49Z lhankins $

     --%>

<%@ page contentType="text/javascript;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/cache/24Hours.jsp" %>



//---------------------------------------------------------------------------//
// This file is dynamically generated from RclJsEnums.jsp
//---------------------------------------------------------------------------//

<%= OutputFormatEnum.toJsObject() %>
<%= DeliveryTypeEnum.toJsObject() %>
<%= ReportExecutionStatusEnum.toJsObject() %>
<%= ContentNodeTypeEnum.toJsObject() %>
<%= AggregateFunctionEnum.toJsObject() %>
<%= SortEnum.toJsObject() %>
<%= RegularAggregateEnum.toJsObject() %>
<%= RelationalInsertionPointEnum.toJsObject() %>
<%= ScheduleStatusEnum.toJsObject() %>
<%= ScheduleTypeEnum.toJsObject() %>
<%= ModifiableContentTypeEnum.toJsObject() %>
<%= CrnChartTypeEnum.toJsObject() %>
<%= ReportExecutionPagingStatusEnum.toJsObject()%>
<%= ReportExecutionStyleEnum.toJsObject()%>
