/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: ManageConfigPropertiesUi.js 9309 2015-08-28 19:52:43Z sallman $


/**
 * save current properties to the server... 
 */
function saveProperties()
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/saveConfigProperties.do";

   var httpParams = '';
   var inputs = document.getElementsByTagName("input");
   for (var i = 0; i < inputs.length; ++i)
   {
      if (inputs[i].type == "checkbox" && inputs[i].checked || inputs[i].type != "checkbox")
      {
         httpParams += inputs[i].name + "=" + inputs[i].value + "&";
      }
   }

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
         window.location.reload();
   });

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );
   xmlHttpRequest.send(httpParams);
}

/**
 * delete properties that have been selected...
 */
function deleteProperties()
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/deleteConfigProperties.do";

   var httpParams = '';
   var deleteCbs = document.getElementsByName("deleteCb");

   for (var i = 0; i < deleteCbs.length; ++i)
   {
      if (deleteCbs[i].checked)
      {
         httpParams += "deleteTarget=" + deleteCbs[i].value + "&";
      }
   }
   
   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
         window.location.reload();
   });

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );
   xmlHttpRequest.send(httpParams);
   


}


/**
 * add a new property to the table...
 */
function addNewProperty()
{
   var propertyTable = document.getElementById("propertyTable");
   var index = propertyTable.rows.length;

   var newRow = propertyTable.insertRow(index);
   var deleteCell = newRow.insertCell(0);
   deleteCell.innerHTML = '<input type="checkbox" name="deleteCb" value="<new>"/>';

   var nameCell = newRow.insertCell(1);
   nameCell.innerHTML = '<input type="hidden" name="propertyId" value="<new>"/>\n' +
                        '<input type="text" size="50" name="propertyName"/>';

   var valueCell = newRow.insertCell(2);
   valueCell.innerHTML = '<input type="text" size="50" name="propertyValue"/>';

   var familyCell = newRow.insertCell(3);
   familyCell.innerHTML = '<input type="text" size="20" name="propertyFamily">';
   
   var encryptCell = newRow.insertCell(4);
   encryptCell.innerHTML = '<input type="checkbox" size="20" name="propertyEncryptions">';
}
