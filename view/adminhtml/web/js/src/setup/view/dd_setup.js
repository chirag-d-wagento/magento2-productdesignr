var DD_setup = DD_panel.extend({
    object_id: 'dd-setup',
    class_name: 'dd-setup-image',
    //model: 'DD_setup_model',
    
    init: function(parent, imgOptions) {
        this.parent = parent;
        this.imgOptions = imgOptions;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        var me = this;
        setTimeout(function() {
            new DD_setup_options(me.self, me.imgOptions);
        }, 100);
        
    }
    
});


