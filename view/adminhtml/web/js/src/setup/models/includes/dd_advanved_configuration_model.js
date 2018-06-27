var DD_advanced_configuration_model = DD_ModelBase.extend({
    
    mainModel: 'DD_setup_options_model',

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    tabActive: function (id) {
        var content = $('#content-' + id + '');
        content.html('');
        switch (id) {
            case 'dd-photos-configuration':
                this.tabPhotos(content);
                break;
            case 'dd-text-configuration':
                this.tabText(content);
                break;
            case 'dd-lib-configuration':
                this.tabLib(content);
                break;
            case 'dd-prices-configuration':
                this.tabPrices(content);
                break;
            default: //options

                break;
        }
    },

    tabPhotos: function (content) {
        content
                .append($('<h3 />').text(this._('photos_configuration')));
        
        var control= new DD_checkbox({
            parent: content, 
            text: this._('enable_photos'), 
            model: this.mainModel, 
            view: this,
            id: 'photos_enabled',
            checked : (this._('defaultImgEnabled') && this.obj.imgOptions.extra_config.photos_enabled !== false
                    || this.obj.imgOptions.extra_config.photos_enabled  ? true 
            : false)
        });

    },

    tabText: function (content) {
        content
                .append($('<h3 />').text(this._('text_configuration')));
        
        new DD_checkbox({
            parent: content, 
            text: this._('enable_text'), 
            model: this.mainModel, 
            view: this,
            id: 'text_enabled',
            checked : (this._('defaultTextEnabled') && this.obj.imgOptions.extra_config.text_enabled !== false 
                    || this.obj.imgOptions.extra_config.text_enabled ? true 
            : false)
        });
    },

    tabLib: function (content) {
        content
                .append($('<h3 />').text(this._('add_from_library_configuration')));
        
        new DD_checkbox({
            parent: content, 
            text: this._('enable_add_from_library'), 
            model: this.mainModel, 
            view: this,
            id: 'library_enabled',
            checked : (this._('defaultLibraryEnabled') && this.obj.imgOptions.extra_config.library_enabled !== false 
                    || this.obj.imgOptions.extra_config.library_enabled ? true 
            : false)
        });
    },

    tabPrices: function (content) {
        
        content
                .append($('<h3 />').text(this._('prices_configuration')));

        this.layerImgPrice = new DD_inputText({
            parent: content,
            label: this._('layer_img_price'),
            model: this.mainModel,
            value: (typeof (this.obj.imgOptions.extra_config.layer_img_price) !== 'undefined')
                    ? this.obj.imgOptions.extra_config.layer_img_price
                    : this._s('defaultImgPrice'),
            id: 'layer_img_price',
            'data-type': 'price'
        });


        this.layerTxtPrice = new DD_inputText({
            parent: content,
            label: this._('layer_txt_price'),
            model: this.mainModel,
            value: (typeof (this.obj.imgOptions.extra_config.layer_txt_price) !== 'undefined')
                    ? this.imgOptions.extra_config.layer_txt_price
                    : this.obj._s('defaultTextPrice'),
            id: 'layer_txt_price',
            'data-type': 'price'
        });
    }
});
