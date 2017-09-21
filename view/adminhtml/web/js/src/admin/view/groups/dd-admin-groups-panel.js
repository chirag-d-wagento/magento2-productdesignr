var DD_admin_groups_panel = DD_panel.extend({
    
    class_name: 'dd-admin-groups-panel',
    model: 'DD_Admin_ImagesSelected_Model',
    
    init: function (options) {
        this.options  = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },
    
    _addElements: function() {
        this.addGroupButton();
        this.addClearButton();
        this.addCancelButton();
        this.addSaveButton();
    },
    
    addGroupButton: function(){
        new DD_admin_group_button(
            this.self
        );
    },
    
    addSaveButton: function(){
        new DD_admin_groupsave_button(
            this.self
        );
    },
    
    addClearButton: function() {
        new DD_admin_clear_button(
            this.self
        );
    },
    
    addCancelButton: function() {
        new DD_admin_groupcancel_button(
            this.self
        );
    }

});
