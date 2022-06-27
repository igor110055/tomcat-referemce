/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */


var multipleEmailValidationFn = function(aInput)
{
   var emailRegex = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.]\s?(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;
   return (Ext.isEmpty(aInput) || emailRegex.test(aInput));
};

Ext.apply(Ext.form.VTypes, {
   multipleEmail : multipleEmailValidationFn,
   multipleEmailText : applicationResources.getProperty("email.validation.message")
});

Ext.QuickTips.init();

// turn on validation errors beside the field globally
Ext.form.Field.prototype.msgTarget = 'side';
