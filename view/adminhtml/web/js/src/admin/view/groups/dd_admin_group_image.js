var DD_admin_group_image = DD_panel.extend({
    model: 'DD_admin_group_image_model',
    class_name_remove: 'dd-admin-image-remove fa fa-trash-o',
    class_name_edit: 'dd-admin-image-edit fa fa-pencil-square-o',
    
    class_name: 'dd-admin-group-image',
    
    init: function (imgContainer, options) {
        this.options  = options;
        this._super({
            'class': this.class_name,
            'parent': imgContainer
        });
        this.add();
        this.addElements();
    },
    
    addElements: function(){
        this.addImage();
        this.addRemove();
        this.addEdit();
    },
    
    addImage: function() {
        this.img = $('<img />').attr('src', this.options.src);
        this.self.append(this.img);        
    },
    
    addRemove: function() {
        var remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });
        
        remove.get(0).attr({
            'data-remove': this.options.media_id,
            'data-group': this.options.groupIndex
        });
        
        this.model.clickRemove(remove.get(0));
    },
    
    addEdit: function() {
        var edit = new DD_button({
            'class': this.class_name_edit,
            'text': this._('edit'),
            'parent': this.self,
            'fa': true
        });
        
        
        this.model.clickEdit(edit.get(0), this.options);
        edit.get(0).attr({
            'data-edit': this.options.media_id,
            'data-group': this.options.groupIndex
        });
    }

});
