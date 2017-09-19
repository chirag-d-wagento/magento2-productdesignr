var DD_admin_loader_images = DD_panel.extend({
    
    class_name: 'dd-admin-designer-container',
    model: 'DD_Admin_ImagesLoader_Model',
    
    init: function (parent) {
        var self = this;
        this.parent = parent;
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    }
     
});
