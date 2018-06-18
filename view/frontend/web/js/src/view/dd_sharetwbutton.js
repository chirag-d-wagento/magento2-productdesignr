var DD_shareTwButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-twitter fa dd-share-button',
    model: 'DD_Share_Model',
    
    init: function(parent, mainModel, shareUrl) {
        this.mainModel = mainModel;
        this.mainModel.shareUrl = shareUrl;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('share_twitter'),
            fa: true,
            tooltip: true
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.initShareTw(this.mainModel);
    }
});


