/**
 * This file defines a JS class which encapsulates environmental information
 * regarding the Server environment
 *
 * @author Lance Hankins
 *
 **/

function ServerEnvironment()
{
}

// these (among others) are populated at request time, by commonIncludes.jsp

ServerEnvironment.baseUrl = '';
ServerEnvironment.contextPath = '';
ServerEnvironment.crnEndPoint = '';
ServerEnvironment.crnBaseUrl = '';
ServerEnvironment.crnGateway = '';
ServerEnvironment.cookieDomain = '';
ServerEnvironment.camId = '';
ServerEnvironment.windowNamePrefix = '';
ServerEnvironment.crnVersion = '';

