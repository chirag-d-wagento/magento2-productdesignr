var DD_Maincontrols = DD_panel.extend({
    object_id: 'dd-main-controls',
    class_name: 'dd-designer-maincontrols',

    init: function (parent) {
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },

    _addElements: function () {
        this.addLayersButton();
        this.addSaveButton();
        this.addQRCodeButton();
        this.addPreviewButton();
    },
    
    addLayersButton: function() {
        if(!this._s('layers')) {
            return;
        }
        new DD_layerButton(this.self);
    },
    
    addSaveButton: function() {
        if(!this._s('save')) {
            return;
        }
        new DD_saveButton(this.self);
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
