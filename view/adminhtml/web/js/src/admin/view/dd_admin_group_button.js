var DD_admin_group_button= DD_button.extend({
    class_name: 'dd-admin-group-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('add_group'),
        }
        this._super(options);
        this.model.addGroupClick(this.self);
    }

});

