var DD_setup_model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this.imgOptions = obj.imgOptions;
        this._super();
    },

    tabActive: function (id) {
        console.log(id);
        var content = $('#content-' + id + '');
        content.html('');
        switch (id) {
            case 'dd-setup-info':
                    this.tabInfo(content);
                break;
            case 'dd-setup-layer-mask':
                    this.tabLayerMask(content);
                break;
            case 'dd-setup-layer-images':
                    this.tabImages(content);
                break;
            case 'dd-setup-layer-texts':
                    this.tabTexts(content);
                break;
            case 'dd-setup-layer-qrcode':

                break;
            default: //options

                break;
        }
    },
    
    tabTexts: function(content) {
         new DD_setup_texts(content, this.imgOptions);
    },
    
    tabImages: function(content) {
        new DD_setup_images(content, this.imgOptions);
    },
    
    
    tabLayerMask: function(content) {
        new DD_setup_layer(content, this.imgOptions);
    },
    
    tabInfo: function(content) {
        new DD_setup_info(content, this.imgOptions);
    }

});
