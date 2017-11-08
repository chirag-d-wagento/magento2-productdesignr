var DD_AddfromLibraryButton = DD_button.extend({
    object_id: 'dd-add-library-button',
    class_name: 'dd-add-library-controls fa fa-folder',
    
    model: 'DD_AddFromLibrary_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_from_library'),
            windowOpener: true,
            tooltip: true,
            fa:true
        }
        this._super(options);
    }
})
