/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */


//override fixes an issue with validation error box rendering with the wrong css class
Ext.form.MessageTargets.qtip.mark = function(field, msg){
    field.el.addClass(field.invalidClass);
    field.el.dom.qtip = msg;
    field.el.set({ "ext:qclass": 'x-form-invalid-tip' });
    if(Ext.QuickTips){
        Ext.QuickTips.enable();
    }
};
Ext.form.MessageTargets.side.mark = function(field, msg){
    field.el.addClass(field.invalidClass);
    if(!field.errorIcon){
        var elp = field.getErrorCt();

        if(!elp){
            field.el.dom.title = msg;
            return;
        }
        field.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
        if (field.ownerCt) {
            field.ownerCt.on('afterlayout', field.alignErrorIcon, field);
            field.ownerCt.on('expand', field.alignErrorIcon, field);
        }
        field.on('resize', field.alignErrorIcon, field);
        field.on('destroy', function(){
            Ext.destroy(this.errorIcon);
        }, field);
    }
    field.alignErrorIcon();
    field.errorIcon.dom.qtip = msg;
    field.errorIcon.set({ "ext:qclass": 'x-form-invalid-tip' });
    field.errorIcon.show();
};
