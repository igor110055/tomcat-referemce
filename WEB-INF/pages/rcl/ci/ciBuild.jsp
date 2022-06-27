<%@ page import="com.focus.rcl.RclEnvironment" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <title>campaigntrac</title>

      <%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

      <script type="text/javascript">
         function buildCrnCredentialsString()
         {
            var credentialXML = "";

            credentialXML += "<credential>"
            credentialXML += "<namespace>" + document.forms[0].namespace.value + "</namespace>";
            credentialXML += "<username>" + document.forms[0].username.value + "</username>";
            credentialXML += "<password>" + document.forms[0].password.value + "</password>";
            credentialXML += "</credential>";

            document.forms[0].crnCredentials.value = credentialXML;
            document.forms[0].submit();
         }


      </script>
   </head>

   <body>
      <form action="/rcl/actions/ci/ciBuild.do">
         <input type="hidden" name="crnCredentials"/>
                    Fred
         Namespace: <input name="namespace" value="NTLM"/><br/>
         Username: <input name="username"/><br/>   
         Password: <input type="password" name="password"/><br/>
         Build ID: <input name="buildId" value="Build-32"/><br/>   
         Project Path: <input style="width:450px" name="projectPath" value="/content/folder[@name='ADF generated content']"/><br/>
         <input type="button" value="Submit" onclick="javascript:buildCrnCredentialsString();"/>
      </form>
   </body>
</html>