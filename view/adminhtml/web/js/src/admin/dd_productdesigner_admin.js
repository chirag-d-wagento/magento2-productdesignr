$.fn.dd_productdesigner_admin = function (options) {
    this.options = $.extend({
        'urlImages': '',
        'psku': '',
        'translator': {
            'default_main_image': 'By default shows main product image',
            'configure_images': 'Configure Images'
        }
    }, options);
    
    new DD_Translator(this.options.translator);
    new DD_Event();
    new DD_admin_main(this, this.options);
    
    if(this.options.debug) {
        new DD_Debug(this);
    }
    return this;
    
    
};
