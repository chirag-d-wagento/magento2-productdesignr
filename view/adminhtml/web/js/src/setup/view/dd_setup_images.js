var DD_setup_images = DD_panel.extend({
    class_name: 'dd-setup-images',
    model: 'DD_setup_images_model',

    init: function (parent, imgOptions) {
        this.parentModel = this.model;
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
                .append($('<h3 />').text(this._('add_default_images')));
        this.button = new DD_button({parent: this.self, 'text': this._('add_image'), 'fa_addon': 'fa fa-image'});
    },
    
    _callBackModel: function (model) {
        model.addEditImageEvent(this.button, this);
    }
    
    
});
