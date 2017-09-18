var DD_windowPhotoTabs = DD_Tabs.extend({
    object_id: 'dd-add-photo-tabs',
    model: 'DD_AddPhoto_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            tabs: this.getTabs()
        }
        this._super(options);
    },
    getTabs: function() {
        return [
            {
                id: 'dd-add-photo-tab',
                text: this._('upload')
            },
            {
                id: 'dd-my-photo-tab',
                text: this._('my_photos')
            }
        ];
    }
});

