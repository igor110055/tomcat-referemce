/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

var xhrMultiPart = {};

xhrMultiPart.Boundary = "{part}";
xhrMultiPart.Queue = null;
xhrMultiPart.QueueMaximum = 3;
xhrMultiPart.TimerId = null;
xhrMultiPart.TimeSlice = 500;

//TODO: Might want to put this in the viewerconfig file so the user can turn it on/off
xhrMultiPart.active = false;

/*
 * At the moment, this function supports all of the members of dojo.__XhrArgs except:
 *		- form
 *		- handleAs
 *		- timeout
 *		- user
 *		- password
 *		- failOk
 *
 * See http://docs.dojocampus.org/dojo/xhrPost for details
 */

xhrMultiPart.Post = function(/*dojo.__XhrArgs*/args) {

	var dfd = null;

	if (xhrMultiPart.active)
	{
		if (args instanceof Object)
		{
			if (xhrMultiPart.Queue === null) {
				xhrMultiPart.Queue = [];
				if (xhrMultiPart.TimeSlice > 0) {
					xhrMultiPart.TimerId = setTimeout(xhrMultiPart.Send, xhrMultiPart.TimeSlice);
				}
			}

	if (typeof bux !== "undefined" && bux && bux._prepareArgs) {
				args = bux._prepareArgs(args);
			}

			xhrMultiPart.Queue.push(args);

			if (args.sync || xhrMultiPart.Queue.length >= xhrMultiPart.QueueMaximum) {
				dfd = xhrMultiPart.Send();
			}
		}
	}

	return dfd;
};


xhrMultiPart.Send = function () {
	var dfd = null;

	if (xhrMultiPart.TimerId) {
		clearTimeout(xhrMultiPart.TimerId);
		xhrMultiPart.TimerId = null;
	}

	var requests = null;
	var len = 0;
	if (xhrMultiPart.Queue) {
		requests = xhrMultiPart.Queue;
		len = requests.length;
		xhrMultiPart.Queue = null;
	}

	if (len > 0 && requests !== null) {

		var boundary = xhrMultiPart.Boundary;
		var newLine = "\r\n";
		var separator = "--";
		var partStart = newLine + separator + boundary + newLine;
		var partEnd = newLine + newLine;
		var requestEnd = newLine + separator + boundary + separator + newLine;
		var headerEnd = newLine + newLine;

		var postUrl;
		
		if (typeof bux !== "undefined" && bux && bux._base) {
			dojo["require"]("bux.Services"); //@lazyload
			postUrl = bux.Services.getGateway();
		}
		else {
			postUrl = requests[0].url;
		}
		postUrl += "/batchviewer";

		var request = "";

		for (var i = 0; i < len; i++) {
			var currentRequest = requests[i];
			request += partStart;

			request += "Content-disposition: form-data; name=\"field" + (i + 1) + "\"";
			if (currentRequest.headers) {
				for (var item in currentRequest.headers) {
					request += newLine + item + ": " + currentRequest.headers[item];
				}
			}
			request += headerEnd;

			if (currentRequest.content) {
				for (var iContent in currentRequest.content) {
					request += iContent + "=" + encodeURIComponent(currentRequest.content[iContent]) + "&";
				}
			}

			request += partEnd;

		}
		request += requestEnd;

		var args = {
			url: postUrl,
			postData: request,
			sync: len === 1 && requests[0].sync ? true: false, //Do it asynch unless there is only one request and it is flagged as synchronous
			preventCache: true,
			headers: {"Content-Type": "multipart/form-data; charset=UTF-8; boundary=\"" + xhrMultiPart.Boundary +"\""}
		};

		dfd = xhrMultiPart.SetupResponseHandler(args, requests);
	}

	return dfd;
};

xhrMultiPart.SetupResponseHandler = function(args, requests) {
	var dfdpromise = dojo.xhrPost(args).promise;

	var len = requests.length;
	for (var i = 0; i < len; i++) {
		var currentRequest = requests[i];
		currentRequest.currentHandler = dfd;

		if (currentRequest.load) {
			dfdpromise = dfdpromise.then(
				/*callback*/ dojo.hitch(currentRequest, function(response){
					var parsedResponse = xhrMultiPart.GetResponsePart(response, this);
					this.load(parsedResponse.currentPart ? parsedResponse.currentPart : parsedResponse);
					return parsedResponse;
				})
			);
		}

		if (currentRequest.error) {
			dfdpromise = dfdpromise.then(
				/*callback*/ null,
				/* errback*/ dojo.hitch(currentRequest, function(response){
								var parsedResponse = xhrMultiPart.GetResponsePart(response, this);
								this.error(parsedResponse.currentPart ? parsedResponse.currentPart : parsedResponse);
								return parsedResponse;
				})
			);
		}

		var fResponseParser = null;
		if (currentRequest.handle) {
			fResponseParser = dojo.hitch(currentRequest, function(response){
				var parsedResponse = xhrMultiPart.GetResponsePart(response, this);
				this.handle(parsedResponse.currentPart ? parsedResponse.currentPart : parsedResponse);
				return parsedResponse;
			});
			dfdpromise = dfdpromise.then(
					/*callback*/ fResponseParser,
					/* errback*/ fResponseParser
			);

		}

		//Ok, we are done with this part...shift out it's result and move it on down the line!

		fResponseParser = dojo.hitch(currentRequest, function(response){
			var result = {
					currentPart: {},
					otherParts: {}
				};
				var parsedResponse = xhrMultiPart.GetResponsePart(response, this);

				if (parsedResponse instanceof Error) {
					result = parsedResponse;
				}
				else if (parsedResponse && parsedResponse.otherParts) {
					result.currentPart = parsedResponse.otherParts.shift();
					result.otherParts = parsedResponse.otherParts;
				}

				return result;
		});
		dfdpromise = dfdpromise.then(
				/*callback*/ fResponseParser,
				/* errback*/ fResponseParser
		);
	}

	return dfdpromise;
};

xhrMultiPart.GetResponsePart = function(response, request) {

	var result;

	if (dojo.isString(response)) {
		result = xhrMultiPart.ParseResponse(response, request);
	}
	else {
		result = response;
	}

	return result;
};

xhrMultiPart.ParseResponse = function(response, request){
	var boundaryRegx = /boundary\s*=\s*\"?([^\"]*)\"?/;
		var boundMatch = request.currentHandler.ioArgs.xhr.getResponseHeader("X-C").match(boundaryRegx);
		if (!boundMatch) {
		//TODO: Localize
		throw new Error("No boundary specified in Content-Type response header");
	}
		var boundary = boundMatch[1];

	var newLine = "\r\n";
	var separator = "--";

	var splitterRegx = new RegExp(separator + boundary + "(" + newLine + "|" + separator + ")", "mg");
	var respParts = response.split(splitterRegx);

		if (respParts && respParts.length === 1) {
		//TODO: Localize
		throw new Error("Boundary specified in Content-Type response header is not found in response body");
	}

	var parts = [];

	var len = respParts.length;
	for (var i = 0; i < len; i++) {
		var part = respParts[i];
		if (part.length > 0 && part !== separator && part !== newLine) {
			part = dojo.trim(part);
			var partObj = xhrMultiPart.BuildPartObject(part);
			parts.push(partObj);
		}
	}

	return {
		currentPart: parts.shift(),
		otherParts: parts
	};

};

xhrMultiPart.BuildPartObject = function(part) {
	var newLine = "\r\n";

	var partPieces = part.split(newLine + newLine, 2);
	var headers = null;
	var content = null;
	if (partPieces.length == 1) {
		content = partPieces[0];
	} else {
		headers = partPieces[0];
		content = partPieces[1];
	}

	var headerObj = xhrMultiPart.ParseHeaders(headers);

	var status;
	if (headerObj["X-Status-Code"]) {
		status = parseInt(headerObj["X-Status-Code"], 10);
	} else {
		//TODO: Assume failure or assume success?
		status = 200;
	}

	var partObj = {
		status: status,
		responseText: dojo.trim(content),
		headers: headerObj,
		getResponseHeader: function(header) { return this.headers[header.toLowerCase()]; }
	};

	return partObj;
};


xhrMultiPart.ParseHeaders = function(headers) {
	var headerObj = {};

	if (headers !== null) {
		var newLine = "\r\n";
		var headerArr = headers.split(newLine);

		for (var j = 0; j < headerArr.length; j++) {
			var currentHeader = headerArr[j];
			var headerTuple = currentHeader.split(":");
			if (headerTuple.length == 2) {
				headerObj[headerTuple[0].toLowerCase()] = headerTuple[1];
			}
		}
	}

	return headerObj;
};
