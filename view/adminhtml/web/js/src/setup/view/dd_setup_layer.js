var DD_setup_layer = DD_panel.extend({
    class_name: 'dd-setup-layer',
    model: 'DD_setup_layer_model',

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
                .append($('<h3 />').text(this._('configure_layer_mask')));
        this.checkbox = new DD_checkbox({parent: this.self, 'text': this._('enable_layer_mask'), model: this.model, view: this});
        this.button = new DD_button({parent: this.self, 'text': this._('add_layer_mask'), 'fa_addon': 'fa fa-window-restore'});
    },
    
    _callBackModel: function (model) {
        model.addEditLayerEvent(this.button, this);
    }
    
});
