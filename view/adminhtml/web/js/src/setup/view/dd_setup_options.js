var DD_setup_options = DD_panel.extend({
    class_name: 'dd-setup-options',
    setupModel: 'DD_setup_options_model',

    init: function (parent, imgOptions) {
        this.parent = parent;
        this.imgOptions = imgOptions;
        this.model = this.setupModel;
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.self
                .append($('<h3 />').text(this._('configuration')));
        
        new DD_checkbox({
            parent: this.self, 
            text: this._('enable_photos'), 
            model: this.setupModel, 
            view: this,
            id: 'photos_enabled',
            checked : (this._('defaultImgEnabled') && this.imgOptions.extra_config.photos_enabled !== false
                    || this.imgOptions.extra_config.photos_enabled  ? true 
            : false)
        });
        new DD_checkbox({
            parent: this.self, 
            text: this._('enable_text'), 
            model: this.setupModel, 
            view: this,
            id: 'text_enabled',
            checked : (this._('defaultTextEnabled') && this.imgOptions.extra_config.text_enabled !== false 
                    || this.imgOptions.extra_config.text_enabled ? true 
            : false)
        });
        new DD_checkbox({
            parent: this.self, 
            text: this._('enable_add_from_library'), 
            model: this.setupModel, 
            view: this,
            id: 'library_enabled',
            checked : (this._('defaultLibraryEnabled') && this.imgOptions.extra_config.library_enabled !== false 
                    || this.imgOptions.extra_config.library_enabled ? true 
            : false)
        });
        
        this.self.append($('<hr>'));
        
        this.self
                .append($('<h3 />').text(this._('prices_configuration')));
        
        this.layerImgPrice = new DD_inputText({
            parent: this.self, 
            label: this._('layer_img_price'),
            value: (typeof(this.imgOptions.extra_config.layer_img_price) !== 'undefined') 
                ? this.imgOptions.extra_config.layer_img_price 
                : this._s('defaultImgPrice'),
            id: 'layer_img_price',
            'data-type': 'price'
        });
        
        
        this.layerTxtPrice = new DD_inputText({
            parent: this.self, 
            label: this._('layer_txt_price'),
            value: (typeof(this.imgOptions.extra_config.layer_txt_price) !== 'undefined') 
                ? this.imgOptions.extra_config.layer_txt_price 
                :  this._s('defaultTextPrice'),
            id: 'layer_txt_price',
            'data-type': 'price'
        });
    },
    
    _callBackModel: function (model) {
        this.self.find('input[type="text"]').each(function() {
            var input = $(this);
            model.initInputEvents(input);
        });
    }
    
});
