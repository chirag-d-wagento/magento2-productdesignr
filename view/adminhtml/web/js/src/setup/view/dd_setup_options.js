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
        this.advancedConfiguration = new DD_advanced_configuration({
            parent: this.self,
            imgOptions: this.imgOptions
        });        
    }
    
});
