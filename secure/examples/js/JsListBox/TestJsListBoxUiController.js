
//---------------------------------------------------------------------------//
// The ui "model"
//---------------------------------------------------------------------------//
function TestUiModel(aUsers)
{
   this.leftHandList = new JsListBox("users", "leftHandList", users, new SimpleFieldExtractor("email", "name"));
   this.rightHandList = new JsListBox("users", "rightHandList", new Object(), new SimpleFieldExtractor("email", "name"));
}


//---------------------------------------------------------------------------//
// The ui "controller"
//---------------------------------------------------------------------------//
function TestUiController(aUsers)
{
   this.model = new TestUiModel(aUsers);
}



TestUiController.prototype.refreshAll = function()
{
   this.model.leftHandList.refreshView();
   this.model.rightHandList.refreshView();
}


TestUiController.prototype.deselectAll = function()
{
   this.model.leftHandList.deselectAll();
   this.model.rightHandList.deselectAll();
}


TestUiController.prototype.shiftSelectedUp = function()
{
   this.model.leftHandList.shiftSelectedUp();
   this.model.rightHandList.shiftSelectedUp();
}


TestUiController.prototype.shiftSelectedDown = function()
{
   this.model.leftHandList.shiftSelectedDown();
   this.model.rightHandList.shiftSelectedDown();
}


TestUiController.prototype.moveLeftToRight = function()
{
   this.model.leftHandList.moveSelectedToOtherList(this.model.rightHandList);
   this.refreshAll();
}


TestUiController.prototype.moveRightToLeft = function()
{
   this.model.rightHandList.moveSelectedToOtherList(this.model.leftHandList);
   this.refreshAll();
}


TestUiController.prototype.changeLeftFilter = function()
{
   var filterValue = document.getElementById("filterInput").value;

   var newFilter = new Object();
   newFilter.filterValue = new RegExp("^" + filterValue);

   newFilter.shouldDisplay = function(aListBoxItem)
   {
      return this.filterValue.test(aListBoxItem.text);
   }

   this.model.leftHandList.filter = newFilter;
   this.model.leftHandList.refreshView();
}


TestUiController.prototype.listLeftSelected = function()
{
   alert("currently selected items: \n" + this.model.leftHandList.getSelectedItems());
}



