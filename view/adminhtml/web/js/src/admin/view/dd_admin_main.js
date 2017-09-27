var DD_admin_main = DD_panel.extend({
    
    object_id: 'dd-admin-main-panel',
    class_name: 'dd-admin-main-container',
    
    init: function (parent, options) {
        var self = this;
        this.options = options;
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.addLoader();
        this.addImagesSelectedPanel();
    },
    
    addImagesSelectedPanel: function() {
        this.options.parent = this.self;
        this.modelSelectedImages = new DD_admin_selected_images({
            'parent': this.self,
            'urlImages': this.options.urlImages,
            'product_sku': this.options.psku
        });
    },
    
    addLoader: function() {
        new DD_admin_loader_images(this.self);
    },
    
    getSelectedImagesModel: function() {
        return this.modelSelectedImages;
    }
    
})
