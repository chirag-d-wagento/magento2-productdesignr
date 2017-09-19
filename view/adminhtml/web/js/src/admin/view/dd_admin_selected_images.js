var DD_admin_selected_images = DD_panel.extend({
    
    class_name: 'dd-admin-designer-selected',
    model: 'DD_Admin_ImagesSelected_Model',
    class_no_image_selected: 'dd-admin-no-selected',
    class_button_customize: 'dd-admin-images-customize',
    
    init: function (options) {
        var self = this;
        this.options  = options;
        this.parent = options.parent;
        this._super({
            'class': this.class_name,
            'parent': this.parent
        });
        this.add();
    },
    
    processGroups: function(data) {
        console.log(data);
        if(data.error) {
            alert(data.errorMessage);
        }
        if(data.success) {
            return this.drawGroups(data.data);
        }
    },
    
    drawGroups: function(dataGroups){
        if(dataGroups.length == 0) {
            this.drawNoImagesSelected()
        }
    },
    
    drawNoImagesSelected: function() {
        var p = $('<p />', {
            id: this.getId(),
            class: this.class_no_image_selected,
            text: this._('default_main_image')
        });
        this.self.append(p);
        var panelCustomize = new DD_panel({
            'parent': this.self
        });
        panelCustomize.add();
        var buttonCustomize = new DD_button({
            'class': this.class_button_customize,
            'text': this._('configure_images'),
            'parent': panelCustomize.get()
        });
    }
    
});
