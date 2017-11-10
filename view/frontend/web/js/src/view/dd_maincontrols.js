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
        this.addLayersButton();
        this.addSaveButton();
        this.addQRCodeButton();
        this.addPreviewButton();
    },
    
    
    addCloseButton: function(onClose) {
        new DD_closeButton(this.self, onClose);
    },
    
    addLayersButton: function() {
        if(!this._s('layers')) {
            return;
        }
        new DD_layerButton(this.self);
    },
    
    addSaveButton: function() {
        if(!this._s('save') || !this.main.options.onSave) {
            return;
        }
        new DD_saveButton(this.self, this.main.options.onSave);
    },
    
    addQRCodeButton: function() {
        if(!this._s('qrcode')) {
            return;
        }
        new DD_qrButton(this.self);
    },
    
    addPreviewButton: function() {
        if(!this._s('preview')) {
            return;
        }
        new DD_previewButton(this.self);
        
    }
});
