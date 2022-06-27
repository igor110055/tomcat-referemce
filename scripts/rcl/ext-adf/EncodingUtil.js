var EncodingUtil =
{
   base64Encode: function(aString)
   {
      return JsUtil.base64Encode(aString).replace(/\n/g, "");
   },

   base64Decode: JsUtil.base64Decode
};


