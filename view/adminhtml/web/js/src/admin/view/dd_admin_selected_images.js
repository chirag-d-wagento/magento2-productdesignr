var DD_admin_selected_images = DD_panel.extend({
    
    class_name: 'dd-admin-designer-selected',
    model: 'DD_Admin_ImagesSelected_Model',
    class_no_image_selected: 'dd-admin-no-selected',
    class_button_customize: 'dd-admin-images-customize',
    class_group_container: 'dd-admin-group-container',
    groups: null,
    _onComplete: true, 
    
    init: function (options) {
        var self = this;
        this.options  = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },
    
    drawNoImagesSelected: function() {
        if(this.groupsPanel) {
           this.groupsPanel.remove(); 
        }
        if(this.groupContainer){
            this.groupContainer.remove();
        }
        this.p_noimages = $('<p />', {
            id: this.getId(),
            class: this.class_no_image_selected,
            text: this._('default_main_image')
        });
        this.self.append(this.p_noimages);
        this.panelCustomize = new DD_panel({
            'parent': this.self
        });
        this.panelCustomize.add();
        var buttonCustomize = new DD_button({
            'class': this.class_button_customize,
            'text': this._('configure_images'), 
            'parent': this.panelCustomize.get(),
            'fa_addon': 'fa fa-cogs'
        });
        return buttonCustomize.get();
    },
    
    drawCustomizePanel: function() {
        var groupsPanel = new DD_admin_groups_panel({parent: this.self});
        this.groupsPanel = groupsPanel.get();
        
        var groupContainer = new DD_panel({
            'parent': this.self,
            'class': this.class_group_container
        });
        groupContainer.add();
        this.groupContainer = groupContainer.get();
    }
    
});
