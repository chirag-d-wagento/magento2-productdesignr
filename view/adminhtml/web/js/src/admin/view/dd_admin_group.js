var DD_admin_group = DD_panel.extend({
    class_name: 'dd-admin-group',
    class_name_remove: 'dd-admin-group-remove fa fa-trash-o',
    class_name_select_img: 'dd-admin-select-img fa fa-picture-o',
    class_img_container: 'dd-admin-group-img-container',
    model: 'DD_Admin_ImagesSelected_Model',
    //modelLoadImages: 'DD_Admin_loadimages_model',

    init: function (options) {
        this.options = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },

    _addElements: function () {
        this.addRemove();
        this.addImages();
    },
    
    _callBackModel: function (model) {
        model.removeGroupClick(this.remove.get(0));
    },

    addImages: function () {
        var imgContainer = new DD_panel({
            class: this.class_img_container,
            parent: this.self
        });
        imgContainer.add();

        var index = this.options.index;
        $.each(this.options.data.imgs, function (i, img) {
            img.group_index = index;
            new DD_admin_group_image(imgContainer.get(), img);
        });
    },

    addRemove: function () {
        this.remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });
        this.remove.get(0).attr({
            'data-remove': this.options.index
        });
    }
});
