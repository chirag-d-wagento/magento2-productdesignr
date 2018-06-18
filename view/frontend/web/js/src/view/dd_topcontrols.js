var DD_Topcontrols = DD_panel.extend({
    object_id: 'dd-top-controls',
    class_name: 'dd-designer-topcontrols',
    controlButtons: [],
    
    
    init: function (parent, main, mainModel) {
        this.parent = parent;
        this.main = main;
        this.mainModel = mainModel;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        
        if(typeof(this.main.options.extra_config) === 'undefined') {
            this.main.options.extra_config = {};
        }
        this.add();
        
    },
    
    _addElements: function() {
        this.addPhotoButton();
        this.addTextButton();
        this.addFromLibraryButton();
        this.addLayersButton();
        
        this.addShareButtons();
        
        //this.addShareFbButton();
    },
    
    addShareButtons: function() {
        if(!this._s('shareFb') && !this._s('shareTw') && !this._s('sharePn')) {
            return;
        }
        return new DD_shareButton(this.self, this.mainModel, this.main.options.settings.shareUrl, this.controlButtons);
    },
    
    addLayersButton: function() {
        if(!this._s('layers')) {
            return;
        }
        var button = new DD_layerButton(this.self);
        this.controlButtons.push(button);
    },
    
    addPhotoButton: function() {
        if(this.main.options.extra_config.photos_enabled === false) {
            return;
        }
        if(this._s('addphoto') || this.main.options.extra_config.photos_enabled === true) {
            var button = new DD_AddphotoButton(this.self);
            this.controlButtons.push(button);
        }
    },
    
    addTextButton: function() {
        if(this.main.options.extra_config.text_enabled === false) {
            return;
        }
        if(this._s('addtext') || this.main.options.extra_config.text_enabled === true) {
            var button = new DD_AddtextButton(this.self);
            this.controlButtons.push(button);
        }
    },
    
    addFromLibraryButton: function(){
        if(this.main.options.extra_config.library_enabled === false) {
            return;
        }
        if(this._s('addfromlibrary') || this.main.options.extra_config.library_enabled === true) {
            var button = new DD_AddfromLibraryButton(this.self);
            this.controlButtons.push(button);
        }
    }
    
});
