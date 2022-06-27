//-----------------------------------------------------------------------------
/**
* ValidationResult
* @constructor
* @class
**/
function ValidationResult (aIsValid, aValue, aDisplayText)
{
   this.isValid = aIsValid;
   this.value = aValue;
   this.displayText = aDisplayText;
}



//-----------------------------------------------------------------------------
/**
* AjaxValidator
* @constructor
* @class
**/
function AjaxValidator (aValidationUrl)
{
   this.validationUrl = aValidationUrl;
   this.lastResult = null;
}

AjaxValidator.prototype.validateValue = function (aValue)
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = this.validationUrl + aValue;

   //alert('validating via : \n\n' + url)

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         //--- will be something like :
         //     var validationResult = new ValidationResult(true, "5", "Golfing Equipment");
         eval(anXmlHttpRequest.responseText);
         
         this.ajaxValidator.lastResult = validationResult;
      }
      catch (e)
      {
         JsUtil.debugString("there was an error evaluating the following response:\n\n" + anXmlHttpRequest.responseText);
      }
   });

   handler.ajaxValidator = this;

   xmlHttpRequest.open("POST", url, false);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );

   xmlHttpRequest.send("");

    if( !is_ie )
   {
      // firefox doesn't do synchronous calls with callback
      handler.callBackFn( xmlHttpRequest );
   }

   return this.lastResult;
};

