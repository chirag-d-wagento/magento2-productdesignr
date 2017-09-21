var DD_admin_group = DD_panel.extend({  
    class_name: 'dd-admin-group',
    class_name_remove: 'dd-admin-group-remove fa fa-trash-o',
    class_name_select_img: 'dd-admin-select-img fa fa-picture-o',
    
    model: 'DD_Admin_ImagesSelected_Model',
    modelLoadImages: 'DD_Admin_loadimages_model',
    
    init: function (options) {
        var self = this;
        this.options  = options;
        this._super({
            'class': this.class_name
        });
        this.add();
        this.addElements();
    },
    
    addElements: function() {
        this.addRemove();
        this.addSelectImage();
        this.addImages();
    },
    
    addImages: function(){
        console.log('addImages');
        console.log(this.options.data);
        
    },
    
    addRemove: function() {
        var remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });
        remove.get(0).attr({
            'data-remove': this.options.index
        });
        this.model.removeGroupClick(remove.get(0));
    },
    
    addSelectImage: function() {
        var selectImg = new DD_button({
            'class': this.class_name_select_img,
            'text': this._('image'),
            'parent': this.self,
            'fa': true,
            'windowOpener': true,
            'windowPreview': true,
            'model': this.modelLoadImages
            
        });
        selectImg.get(0).attr({
            'data-group': this.options.index
        });
    }
});
