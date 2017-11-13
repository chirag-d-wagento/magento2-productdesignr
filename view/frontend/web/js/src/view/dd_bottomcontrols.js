var DD_Bottomcontrols = DD_panel.extend({
    object_id: 'dd-bottom-controls',
    class_name: 'dd-designer-bottomcontrols',

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
        this.addLayersButton();
        this.addPreviewButton();
        this.addDownloadButton();
        this.addPrintButton();
        this.addClearAllButton();
    },
    
    addLayersButton: function() {
        if(!this._s('layers')) {
            return;
        }
        new DD_layerButton(this.self);
    },
    
    addDownloadButton: function() {
        if(!this._s('download')) {
            return;
        }
        new DD_downloadButton(this.self);
    },
    
    addPrintButton: function() {
        if(!this._s('print')) {
            return;
        }
        new DD_printButton(this.self);
    },
    
    addClearAllButton: function() {
        if(!this._s('clear_all')) {
            return;
        }
        new DD_clearAllButton(this.self);
    },
    
    addPreviewButton: function() {
        if(!this._s('preview')) {
            return;
        }
        new DD_previewButton(this.self);
        
    }
});
