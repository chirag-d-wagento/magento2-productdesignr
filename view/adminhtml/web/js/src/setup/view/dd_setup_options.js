var DD_setup_options = DD_panel.extend({
    class_name: 'dd-setup-options',
    checkboxModel: 'DD_setup_options_model',

    init: function (parent, imgOptions) {
        this.parent = parent;
        this.imgOptions = imgOptions;
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.self
                .append($('<h3 />').text(this._('configuration')));
        console.log(this.imgOptions);
        this.checkbox = new DD_checkbox({
            parent: this.self, 
            text: this._('enable_photos'), 
            model: this.checkboxModel, 
            view: this,
            id: 'photos_enabled',
            checked : (this._('defaultImgEnabled') && this.imgOptions.extra_config.photos_enabled !== false
                    || this.imgOptions.extra_config.photos_enabled  ? true 
            : false)
        });
        this.checkbox = new DD_checkbox({
            parent: this.self, 
            text: this._('enable_text'), 
            model: this.checkboxModel, 
            view: this,
            id: 'text_enabled',
            checked : (this._('defaultTextEnabled') && this.imgOptions.extra_config.text_enabled !== false 
                    || this.imgOptions.extra_config.text_enabled ? true 
            : false)
        });
        this.checkbox = new DD_checkbox({
            parent: this.self, 
            text: this._('enable_add_from_library'), 
            model: this.checkboxModel, 
            view: this,
            id: 'library_enabled',
            checked : (this._('defaultLibraryEnabled') && this.imgOptions.extra_config.library_enabled !== false 
                    || this.imgOptions.extra_config.library_enabled ? true 
            : false)
        });
        
        this.self.append($('<hr>'));
    }
});
