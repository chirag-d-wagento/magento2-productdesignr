var DD_admin_image_row = DD_panel.extend({

    class_name: 'dd-admin-product-image-row clearfix',

    init: function (parent, imgs, rowOptions) {
        this.imgs = imgs;
        if (rowOptions) {
            this.rowOptions = rowOptions;
            if (!this.rowOptions.group_index || this.rowOptions.group_index == 0) {
                this.rowOptions.group_index = this.createUUID();
            }
        }
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },

    _addElements: function () {
        if (typeof (this.imgs) == 'undefined' || this.imgs.length == 0) {
            this.self.append($('<div />').html(this.rowOptions.no_images_text));
            return;
        }
        this.self.append($('<h3 />').html(this.rowOptions.product_name + '(' + this.rowOptions.psku + ')'));
        this.addImages();
    },

    addImages: function () {
        var me = this;
        $.each(this.imgs, function (i, img) {
            img.group_index = me.rowOptions.group_index;
            new DD_admin_image(me.self, img);
        });
    }
})
