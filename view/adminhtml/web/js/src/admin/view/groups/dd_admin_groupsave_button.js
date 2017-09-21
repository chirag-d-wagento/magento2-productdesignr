var DD_admin_groupsave_button= DD_button.extend({
    class_name: 'dd-admin-groupsave-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('save'),
            fa_addon: 'fa fa-floppy-o'
        }
        this._super(options);
        this.model.addGroupSaveClick(this.self);
        
    }

});

