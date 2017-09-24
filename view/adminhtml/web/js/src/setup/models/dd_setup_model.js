var DD_setup_model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    tabActive: function (id, content) {
        content.html('');
        switch (id) {
            case 'dd-setup-info':
                    this.tabInfo(content);
                break;
            case 'dd-setup-layer-mask':
                    this.tabLayerMask(content);
                break;
            case 'dd-setup-layer-images':

                break;
            case 'dd-setup-layer-texts':

                break;
            case 'dd-setup-layer-qrcode':

                break;
            default: //options

                break;
        }
    },
    
    tabLayerMask: function(content) {
        new DD_setup_layer(content, this.obj.imgOptions);
    },
    
    tabInfo: function(content) {
        new DD_setup_info(content, this.obj.imgOptions);
    }

});
