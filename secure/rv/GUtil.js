/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/*******************************************
		Common Utility Functions
*******************************************/
var GUtil = {};

GUtil.createHiddenForm = function(name, method, viewerId, target) {
	var form = document.getElementById(name);
	if(form) {
		document.body.removeChild(form);
	}

	form = document.createElement("form");
	form.id = name;
	form.name = name;
	form.method = method;
	form.style.display = "none";
	form.action = document.forms["formWarpRequest" + viewerId].action;
	form.target = target + (new Date()).getTime();

	document.body.appendChild(form);
	return form;
};


GUtil.createFormField = function(el, name, value) {
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = name;
	input.value = value;

	el.appendChild(input);
};

/*----------------------------------------------------------
GenerateCallback:
	func:		Function object to use. To call foo.test() pass in foo.test.
	aParams:	Array of parameters to pass to func.
	oContext:	Calling context. If "foo" in foo.test is and instance of "Foo" object, then you need
				to pass the instance as a context. This is this difference between calling Foo.test() and
				foo.test(), where foo = new Foo();

	Returns:	A function object that can be used as a callback, but allows for the passing of stored parameters.

	Example:	var foo = new Foo();
				var func1 = GUtil.generateCallback(alert, ["Hello World"]);
				var func2 = GUtil.generateCallback(window.alert, ["Hi there"], window);

				//alert "Hello World" after 5 seconds.
				setTimeout(func1, 5000);

				//alert "Hi there" after 10 seconds.
				setTimeout(func2, 10000);
------------------------------------------------------------*/
GUtil.generateCallback = function(func, aParams, oContext){
	//normally "this" is probably the window object, but
	//we can pass in a different context object if we need to.
	if (func) {
		var funcContext = oContext || this;
		aParams = (aParams instanceof Array)? aParams : [];
		return (function(response){
			if(typeof response != "undefined" && aParams.length == 0) {
				aParams.push(response);
			}
			return func.apply(funcContext,aParams);
		});
	} else {
		//do nothing
		return (function() {});
	}
};

/*----------------------------------------------------------
destroyProperties:
	inParam:				an Object or Array
	bDestroyCognosViewer:	if a property is an instance of CCognsoViewer object,
	*						delete the properties of CV object
	*						only if this parameter is true
------------------------------------------------------------*/
GUtil.destroyProperties = function(inParam, bDestroyCognosViewer){
	var property;
	if (inParam instanceof Array) {
		for(var i=0; i<inParam.length; i++) {
			property = inParam[i];
			if (property instanceof String) {
				property = null;
			} else {
				if (property && property.destroy && !property._beingDestroyed) {
					property.destroy();
				}
				GUtil.destroyProperties(property);
			}
		}
	} else if (inParam instanceof Object){
		if (inParam._beingDestroyed) {
			return;
		}

		var obj = inParam;
		obj._beingDestroyed = true;
		for (var field in obj) {
			property = obj[field];

			if (field === "_beingDestroyed" || field === "m_destroyed" || field === "_destroyed" || typeof property == "function") {
				// skip - don't want to remove these
				continue;
			}

			if (property instanceof Array) {
				GUtil.destroyProperties(property);
			} else if (property instanceof Object) {
				if (typeof property.destroy == "function" && !property._destroyed && (property!==CCognosViewer || bDestroyCognosViewer)) {
					property.destroy();
				}
			}
			delete obj[field];
		}
	}
};


