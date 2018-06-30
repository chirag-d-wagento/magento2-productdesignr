var DD_advanced_configuration = DD_Tabs.extend({
    
    object_id: 'dd-advanced-confiuration',
    model: 'DD_advanced_configuration_model',
    
    init: function(options) {
        this.imgOptions = options.imgOptions;
        var options = {
            parent: options.parent,
            id: this.object_id,
            tabs: this.getTabs(),
            isAccordion: true
        }
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
            {
                id: 'dd-photos-configuration',
                text: this._('photos_configuration')
            },
            {
                id: 'dd-text-configuration',
                text: this._('text_configuration')
            },
            {
                id: 'dd-lib-configuration',
                text: this._('add_from_library_configuration')
            },
            {
                id: 'dd-prices-configuration',
                text: this._('prices_configuration')
            }
        ]
    }
});
