var DD_admin_image_button = DD_button.extend({
    model: 'DD_Admin_loadimages_model',
    class_name: 'dd-admin-image-button',

    init: function (parent) {
        this._super({
            'class': this.class_name,
            'parent': parent,
            'text': this._('add_edit_image'),
            'fa_addon': 'fa fa-image',
            'windowOpener': true,
            'windowPreview': true
        });
        
    }

});
