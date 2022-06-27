/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
function RequestExecutedIndicator(oCV)
{
	RequestExecutedIndicator.baseConstructor.call( this, oCV );
}

RequestExecutedIndicator.prototype = new BaseRequestExecutedIndicator();
RequestExecutedIndicator.baseConstructor = BaseRequestExecutedIndicator;
RequestExecutedIndicator.prototype.parent = BaseRequestExecutedIndicator.prototype;


RequestExecutedIndicator.prototype.show = function() {
	var oCV = this.getViewer();
	var cvid = oCV.getId();
	var executionCursor = document.getElementById("executionCursor" + cvid);
	var rvContentDiv = document.getElementById("formWarpRequest" + cvid);	
	if(!executionCursor && rvContentDiv)
	{
		executionCursor = document.createElement("span");
		executionCursor.className = "executionCursor";
		executionCursor.setAttribute("id", "executionCursor" + cvid);

		var imageSrcHtml = "<img alt=\"\" src=\"" + oCV.getWebContentRoot() + "/rv/images/action_busy_32x32.gif" + "\"/>";

		executionCursor.innerHTML = imageSrcHtml;
		
		rvContentDiv.appendChild(executionCursor);
	}
	
	this.parent.show.call(this);
};

RequestExecutedIndicator.prototype.hide = function() {
	var executionCursor = document.getElementById("executionCursor" + this.getViewer().getId());
	if(executionCursor != null)	{
		executionCursor.parentNode.removeChild(executionCursor);
	}
	
	this.parent.hide.call(this);
};




