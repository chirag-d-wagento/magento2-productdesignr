var DD_admin_group = DD_panel.extend({
    class_name: 'dd-admin-group',
    class_name_remove: 'dd-admin-group-remove fa fa-trash-o',
    class_name_select_img: 'dd-admin-select-img fa fa-picture-o',
    class_img_container: 'dd-admin-group-img-container',
    class_sorting_container: 'dd-admin-group-sorting-container sortable',
    class_sorting_icon: 'dd-admin-group-sorting-icon fa fa-arrows',

    model: 'DD_Admin_ImagesSelected_Model',
    modelLoadImages: 'DD_Admin_loadimages_model',

    init: function (options) {
        this.options = options;
        this._super({
            'class': this.class_name
        });
        this.add();
        this.addElements();
    },

    addElements: function () {
        this.addRemove();
        this.addSelectImage();
        this.addSortingPanel();
        this.addImages();
    },

    addSortingPanel: function () {
        var sorting = new DD_panel({
            class: this.class_sorting_container,
            parent: this.self
        });
        sorting.add();
        sorting.get().append($('<span />').addClass(this.class_sorting_icon));
    },

    addImages: function () {
        var imgContainer = new DD_panel({
            class: this.class_img_container,
            parent: this.self
        });
        imgContainer.add();

        var index = this.options.index;
        $.each(this.options.data, function (i, img) {
            img.groupIndex = index
            new DD_admin_group_image(imgContainer.get(), img);
        });

        new Sortable(imgContainer.get().get(0), {

        });
    },

    addRemove: function () {
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

    addSelectImage: function () {
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
