/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: ManageUserMessagesUi.js 4534 2007-07-26 19:36:18Z lhankins $


function Message(anId, aSubject, aTextMessage, aDate, isMinimize, anAnnouncement)
{
   this.id = anId;
   this.subject = aSubject;
   this.textMessage = aTextMessage;
   this.date = aDate;
   this.minimize = isMinimize;
   this.announcement = anAnnouncement
};

Message.prototype.toDomElement = function(anId)
{
   var messageElement = document.createElement("table");
   messageElement.className = "messageHeader";
   messageElement.cellPadding = 1;
   messageElement.cellSpacing = 0;
   messageElement.border = 0;

   var subjectRow = messageElement.insertRow(0);
   var subjectCell = subjectRow.insertCell(0);
   subjectCell.className = "messageSubject";
   if(this.announcement)
      subjectCell.innerHTML = applicationResources.getPropertyWithParameters("messages.announcement.subject", new Array(this.subject));
   else
      subjectCell.innerHTML = applicationResources.getPropertyWithParameters("messages.message.subject", new Array(this.subject));

   var minButtonCell = subjectRow.insertCell(1);
   minButtonCell.className = "messageButton";
   minButtonCell.innerHTML = "<a class=\"messageLink\" href=\"javascript:messageUiController.minimizeMessage(" + anId + ")\">" + applicationResources.getProperty("messages.button.minimize") + "</a>";
   var maxButtonCell = subjectRow.insertCell(2);
   maxButtonCell.className = "messageButton";
   maxButtonCell.innerHTML = "<a class=\"messageLink\" href=\"javascript:messageUiController.maximizeMessage(" + anId + ")\">" + applicationResources.getProperty("messages.button.maximize") + "</a>";
   if(!this.announcement)
   {
      var deleteButtonCell = subjectRow.insertCell(3);
      deleteButtonCell.className = "messageButton";
      deleteButtonCell.innerHTML = "<a class=\"messageLink\" href=\"javascript:messageUiController.deleteMessage(" + anId + ")\">" + applicationResources.getProperty("messages.button.delete") + "</a>";
   }


   var messageRow = messageElement.insertRow(1);
   var messageCell = messageRow.insertCell(0);
   messageCell.colSpan = 4;
   var messageTable = document.createElement("table");
   messageTable.className = "textMessage";
   var rowIndex = 0;
   if(!this.announcement)
   {
      var messageDateRow = messageTable.insertRow(rowIndex++);
      var messageDateCell = messageDateRow.insertCell(0);
      messageDateCell.className = "messageDate";
      messageDateCell.innerHTML = applicationResources.getPropertyWithParameters("messages.date.header", new Array(this.date));
      var messageDivideRow = messageTable.insertRow(rowIndex++);
      var messageDivideCell = messageDivideRow.insertCell(0);
      messageDivideCell.innerHTML = "<hr WIDTH=\"99%\">";
   }
   var textMessageRow = messageTable.insertRow(rowIndex++);
   var textMessageCell = textMessageRow.insertCell(0);
   textMessageCell.style.nowrap = true;
   textMessageCell.innerHTML = this.textMessage;

   messageCell.appendChild(messageTable);

   if(this.minimize)
   {
      minButtonCell.style.display = "none";
      messageCell.style.display = "none";
   }
   else
      maxButtonCell.style.display = "none";
   return messageElement;
}
//-----------------------------------------------------------------------------

function UserMessagesUiController (aDocument, aMessageArray)
{
   this.document = aDocument;
   this.messages = aMessageArray;
   this.domElement = null;
};

UserMessagesUiController.prototype.refreshView = function()
{
   var insertionPoint = document.getElementById("messageContainer");

   //-- we'll remove this in a minute...
   var oldGridDiv = this.domElement;

   //--- outer div to hold the whole grid...
   this.domElement = document.createElement("div");

   for (var i = 0; i < this.messages.length; ++i)
   {
      var messageElement = this.messages[i].toDomElement(i);
      if(i%2 == 0)
         messageElement.rows[0].className = "messageTitleEven";
      else
         messageElement.rows[0].className = "messageTitleOdd";

      this.domElement.appendChild(messageElement);
   }

   //--- insert the messages div...
   if (oldGridDiv)
   {
      insertionPoint.replaceChild(this.domElement, oldGridDiv);
   }
   else
   {
      insertionPoint.appendChild(this.domElement);
   }
}

UserMessagesUiController.prototype.minimizeMessage = function(anId)
{
   //--- do async request to launch reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();
   var url = ServerEnvironment.baseUrl + "/secure/actions/minimizeUserMessage.do";
   var httpParams ="messageId=" + this.messages[anId].id;

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );

   xmlHttpRequest.send(httpParams);
   this.messages[anId].minimize = true;
   this.refreshView();
}

UserMessagesUiController.prototype.maximizeMessage = function(anId)
{
   this.messages[anId].minimize = false;
   this.refreshView();
}

UserMessagesUiController.prototype.deleteMessage = function(anId)
{
   if (confirm(applicationResources.getProperty("general.confirmDeletions")  ))
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();
      var url = ServerEnvironment.baseUrl + "/secure/actions/deleteUserMessage.do";
      var httpParams = "messageId=" + this.messages[anId].id;

      xmlHttpRequest.open("POST", url, true);

      xmlHttpRequest.setRequestHeader(
         'Content-Type',
         'application/x-www-form-urlencoded; charset=UTF-8'
      );

      xmlHttpRequest.send(httpParams);
      this.messages = JsUtil.removeElementFromArrayByIndex(this.messages, anId);
      this.refreshView();
   }
}
