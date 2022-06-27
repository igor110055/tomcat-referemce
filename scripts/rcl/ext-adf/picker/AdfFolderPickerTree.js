/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.AdfFolderPickerTree = Ext.extend(Ext.tree.TreePanel, {
   constructor: function(aConfig)
   {

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      this.selectedNodeId = aConfig.selectedNodeId;
      this.expandToSelectedNode = true;

      aConfig = Ext.apply({
         rootVisible: false,
         loader: new Ext.tree.TreeLoader({
            dataUrl: ServerEnvironment.baseUrl + "/secure/actions/ext/fetchAdfFolders.do",
            baseParams:
            {
               preSelectedPath: this.selectedNodeId
            },
            listeners : {
               scope: this,
               "load": this.treeLoaderLoad,
               loadexception: function(aTreeLoader, aNode, aResponse)
               {
                  if(aResponse.responseText.indexOf("/scripts/rcl/login.js") > 0)
                  {
                     Ext.Msg.alert("Session Expired", "Your MotioADF session has expired.", function()
                     {
                        window.location = ServerEnvironment.contextPath + "/actions/loginPromptAction.do";
                     });
                     return;
                  }
               }

            }
         }),
         root: new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: "Root",
            id: "root",
            icon: ServerEnvironment.baseUrl + "/images/silkIcons/folder.png"
         }),
         autoScroll: true
      }, aConfig);

      Adf.AdfFolderPickerTree.superclass.constructor.call(this, aConfig);

      new Ext.tree.TreeSorter(this,
      {
         caseSensitive  : false,
         dir            : 'ASC',
         folderSort     : true
      });
   },

   isNodeSelected : function()
   {
      var node = this.getSelectionModel().getSelectedNode();
      return (JsUtil.isGood(node));
   },

   getSelectedNodeID : function()
   {
      var node = this.getSelectionModel().getSelectedNode();
      if (JsUtil.isGood(node))
      {
         return node.attributes.id;
      }
      else
      {
         return -1;
      }
   },

   getSelectedNodePath : function()
   {
      var node = this.getSelectionModel().getSelectedNode();
      if(JsUtil.isGood(node))
      {
         return node.attributes.id;
      }
      else
      {
         return '';
      }
   },

   treeLoaderLoad : function(aTreeLoader, aNode, aResponse)
   {
      this.nodeExpandCallback(aNode);
   },

   nodeExpandCallback : function(aNode)
   {
      if(!Ext.isEmpty(this.selectedNodeId) && this.expandToSelectedNode)
      {
         if(aNode.id.length >= this.selectedNodeId.length)
         {
            aNode.ensureVisible();
            aNode.select();
         }
         else
         {
            for (var count = 0; count < aNode.childNodes.length; count++)
            {
               var eachChildNode = aNode.childNodes[count];
               if(this.selectedNodeId.indexOf(eachChildNode.id) == 0)
               {
                  eachChildNode.expand(false, false, this.nodeExpandCallback, this);
               }
            }
         }
      }
   }
});