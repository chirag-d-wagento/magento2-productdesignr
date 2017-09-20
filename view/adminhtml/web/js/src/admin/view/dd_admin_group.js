var DD_admin_group = DD_panel.extend({  
    class_name: 'dd-admin-group',
    class_name_remove: 'dd-admin-group-remove',
    class_name_select_img: 'dd-admin-select-img',
    
    model: 'DD_Admin_ImagesSelected_Model',
    
    init: function (options) {
        var self = this;
        this.data = options.data;
        this.options  = options;
        console.log( this.options );
        this._super({
            'class': this.class_name
        });
        this.add();
        this.addElements();
    },
    
    addElements: function() {
        this.addRemove();
        this.addSelectImage();
    },
    
    addRemove: function() {
        var remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self
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
            'parent': this.self
        });
        selectImg.get(0).attr({
            'data-remove': this.options.index
        });
        this.model.selectImgClick(selectImg.get(0));
    }
});
