var DD_admin_group_image = DD_panel.extend({
    model: 'DD_admin_group_image_model',
    class_name_remove: 'dd-admin-image-remove fa fa-trash-o',
    class_name_edit: 'dd-admin-image-edit fa fa-pencil-square-o',

    class_name: 'dd-admin-group-image',

    init: function (imgContainer, options) {
        this.options = options;
        this._super({
            'class': this.class_name,
            'parent': imgContainer
        });
        this.add();
        
    },

    _callBackModel: function (model) {

        var self = this;
        this.img = $('<img />').attr('src', this.options.src)
                .load(function () {
                    self.options = model.setImageSize(this, self.options.group_index, self.options.media_id);
                    self.addRemove();
                    self.addEdit();
                    model.clickEdit(self.edit.get(0), self.options);
                    model.clickRemove(self.remove.get(0));
                });

        this.self.append(this.img);

    },
    
    addRemove: function () {
        if (this.remove) {
            return;
        }
        this.remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });

        this.remove.get(0).attr({
            'data-remove': this.options.media_id,
            'data-group': this.options.group_index
        });
    },

    addEdit: function () {
        if (this.edit) {
            return;
        }
        this.edit = new DD_button({
            'class': this.class_name_edit,
            'text': this._('edit'),
            'parent': this.self,
            'fa': true
        });

        this.edit.get(0).attr({
            'data-edit': this.options.media_id,
            'data-group': this.options.group_index
        });

    }

});
