var DD_Maincontrols = DD_panel.extend({
    object_id: 'dd-main-controls',
    class_name: 'dd-designer-maincontrols',

    init: function (parent, main) {
        this.parent = parent;
        this.main = main;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },

    _addElements: function () {
        if(this.main.options.onClose) {
            this.addCloseButton(this.main.options.onClose);
        }
        this.addSaveButton();
    },    
    
    addCloseButton: function(onClose) {
        new DD_closeButton(this.self, onClose);
    },
    
    addSaveButton: function() {
        if(!this._s('save') || !this.main.options.onSave) {
            return;
        }
        new DD_saveButton(this.self, this.main.options.onSave);
    }
});
