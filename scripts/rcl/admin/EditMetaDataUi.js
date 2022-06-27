/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id:EditMetaDataUi.js 4256 2007-04-27 21:36:24Z lhankins $


//-----------------------------------------------------------------------------
/**
 * Edit MetaData UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function EditMetaDataUiController (aDocument, aPackagePath, aPackageRoot)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);

      this.packagePath = aPackagePath;
      this.packageRoot = (aPackageRoot ? aPackageRoot : null);


      this.rowLevelSecuritySelect = new HtmlSelect($("hasRowLevelSecurity"));
      this.valuePickerHintSelect = new HtmlSelect($("valuePickerHint"));


      //--- Md Tree...
      this.crnMdTree = new CrnMetaDataTree (this.packagePath, this.packageRoot, "mdTreeContainer");
      this.crnMdTree.tree.isMultiSelect = false;
      this.crnMdTree.querySubjectNodeType.allowNodeSelection = true;

      this.crnMdTree.tree.addObserver(this);


      this.currentNode = null;
   }
}

EditMetaDataUiController.prototype = new AbstractUiController();
EditMetaDataUiController.prototype.constructor = EditMetaDataUiController;
EditMetaDataUiController.superclass = AbstractUiController.prototype;

EditMetaDataUiController.prototype.initUi = function()
{
   this.crnMdTree.refreshView();
};



/**
 * implementation of observer interface (For tree events)
 **/
EditMetaDataUiController.prototype.processEvent = function (anEvent)
{
   if (anEvent.type.family == "tree")
   {
      if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
      {
         this.currentNode = anEvent.payload.srcObject;
         this.setCurrentSelectionDisplayInfo(this.currentNode);
      }
      else if (anEvent.type == ObservableEventType.TREE_NODE_DESELECTED)
      {
         if (this.currentNode != null)
         {
            this.savePendingEdits(this.packagePath, this.currentNode.ref);
         }
         this.currentNode = null;
         this.setCurrentSelectionDisplayInfo(null);
      }
   }
   else if (anEvent.type == ObservableEventType.COMPOUND_EVENT)
   {
      // later, for multi-select support...
   }
   else
   {
      alert("don't know how to handle event [" + anEvent + "]");
   }
};

/**
 * new item selected, show the details...
 **/
EditMetaDataUiController.prototype.setCurrentSelectionDisplayInfo = function (anObject)
{
   if (anObject)
   {
      var qimd = this.retrieveMetaData(this.packagePath, anObject.ref);

      $("selected_name").innerHTML = anObject.name;
      $("selected_ref").innerHTML = anObject.ref;
      $("selected_dataType").innerHTML = anObject.dataType;
      $("selected_displayValueRef").innerHTML = qimd.displayValueRef;

      this.rowLevelSecuritySelect.selectSingleItem("" + qimd.hasRowLevelSecurity);
      this.valuePickerHintSelect.selectSingleItem("" + qimd.paramValueHint);

      $("customerDataType").value = qimd.customerDataType != null ? qimd.customerDataType  : "";
      $("customerDataTypeModifier").value = qimd.customerDataTypeModifier != null ? qimd.customerDataTypeModifier  : "";


      $("selectedItemDetails").style.display = "block";
      $("nothingSelected").style.display = "none";
   }
   else
   {
      $("customerDataType").value = "";
      $("customerDataTypeModifier").value = "";

      this.rowLevelSecuritySelect.selectSingleItem("false");
      this.valuePickerHintSelect.selectSingleItem("0");

      $("selectedItemDetails").style.display = "none";
      $("nothingSelected").style.display = "block";
   }
};


/**
 * retrieve QIMD from server, via AJAX call...
 **/
EditMetaDataUiController.prototype.retrieveMetaData = function (aPackage, aModelRef)
{
   //--- AJAX call to get the metatdata...
   var url = ServerEnvironment.contextPath + "/secure/actions/admin/getMetaData.do?" +
           "packagePath=" + aPackage + "&modelRef=" + aModelRef;

   var ajaxCall = new Ajax.Request(url, {
      method: 'post',
      asynchronous:false,
      onFailure : function(resp)
      {
         alert(applicationResources.getProperty("general.serverError"));
      },
      onException : function(resp)
      {
         alert(applicationResources.getProperty("general.serverError"));
      }
   });


   //alert(ajaxCall.transport.responseText);
   
   //--- js will look like :
   //  var qimd = new QueryItemMetaData (...);
   eval(ajaxCall.transport.responseText)
   return qimd;
};

/**
 * save pending edits to server, via AJAX call...
 **/
EditMetaDataUiController.prototype.savePendingEdits = function (aPackage, aModelRef)
{
   var rowLevelSecurity = new HtmlSelect($("hasRowLevelSecurity")).getSelectedValues()[0];
   var valuePickerHint = new HtmlSelect($("valuePickerHint")).getSelectedValues()[0];

   var customerDataType = $("customerDataType").value;
   var customerDataTypeModifier = $("customerDataTypeModifier").value;


   //--- AJAX call to save the metatdata...
   var url = ServerEnvironment.contextPath + "/secure/actions/admin/saveMetaData.do?" +
           "packagePath=" + aPackage + "&modelRef=" + aModelRef +
           "&hasRowLevelSecurity=" + rowLevelSecurity +
           "&valuePickerHint=" + valuePickerHint +
           (customerDataType && customerDataType.length > 0 ? "&customerDataType=" + customerDataType : "") +
           (customerDataTypeModifier && customerDataTypeModifier.length > 0 ? "&customerDataTypeModifier=" + customerDataTypeModifier : "");



   var ajaxCall = new Ajax.Request(url, {
      method: 'post',
      asynchronous:false,
      onFailure : function(resp)
      {
         alert(applicationResources.getProperty("general.serverError"));
      },
      onException : function(resp)
      {
         alert(applicationResources.getProperty("general.serverError"));
      }
   });

   //--- js will look like :
   //  var result = { success: true, message : null }
   eval(ajaxCall.transport.responseText)

   if (result.success == false)
   {
      alert(applicationResources.getProperty("general.serverError"));
   }
};
