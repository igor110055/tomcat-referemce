<%@ page import="com.focus.rclcustomer.core.RclCustomerConstants" %>

<%@ page contentType="text/javascript;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/cache/24Hours.jsp" %>


var RclCustomerConstants = {};

RclCustomerConstants.DEFAULT_MODEL_PATH = "<%=RclCustomerConstants.DEFAULT_MODEL_PATH%>";

RclCustomerConstants.ParameterNames = {
};


RclCustomerConstants.Db = {
   CATEGORY_ID : "<%=RclCustomerConstants.Db.CATEGORY_ID.getExpression()%>",
   CATEGORY_NAME : "<%=RclCustomerConstants.Db.CATEGORY_NAME.getExpression()%>"
};

RclCustomerConstants.Product = {
   PRODUCT_LINE : "<%=RclCustomerConstants.Product.PRODUCT_LINE.getExpression()%>",
   PRODUCT_LINE_CODE : "<%=RclCustomerConstants.Product.PRODUCT_LINE_CODE.getExpression()%>"
};
