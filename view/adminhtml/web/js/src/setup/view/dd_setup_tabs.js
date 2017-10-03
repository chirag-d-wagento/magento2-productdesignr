var DD_setup_tabs = DD_Tabs.extend({
    object_id: 'dd-setup-tabs',
    model: 'DD_setup_model',
    
    init: function(parent, imgOptions) {
        var options = {
            parent: parent,
            id: this.object_id,
            tabs: this.getTabs()
        }
        this.imgOptions = imgOptions;
        this._super(options);
    },
    getTabs: function() {
        return [
            {
                id: 'dd-setup-info',
                text: this._('info')
            },
            {
                id: 'dd-setup-layer-mask',
                text: this._('layer_mask')
            },
            {
                id: 'dd-setup-layer-images',
                text: this._('images')
            },
            {
                id: 'dd-setup-layer-texts',
                text: this._('texts')
            },
            /*
            {
                id: 'dd-setup-layer-qrcode',
                text: this._('qr_code')
            },
            */
            {
                id: 'dd-setup-options',
                text: this._('options')
            }
        ];
    }
});


