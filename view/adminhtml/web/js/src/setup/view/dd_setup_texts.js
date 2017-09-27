var DD_setup_texts = DD_panel.extend({
    class_name: 'dd-setup-texts',
    model: 'DD_setup_texts_model',

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
                .append($('<h3 />').text(this._('add_default_texts')));
        this.button = new DD_button({parent: this.self, 'text': this._('add_text'), 'fa_addon': 'fa fa-pencil'});
    },
    
    _callBackModel: function (model) {
        model.addEditTextEvent(this.button, this);
    }
    
});
