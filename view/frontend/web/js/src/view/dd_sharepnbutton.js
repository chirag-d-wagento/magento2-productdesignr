var DD_sharePnButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-pinterest fa dd-share-button',
    model: 'DD_Share_Model',
    
    init: function(parent, mainModel, shareUrl) {
        this.mainModel = mainModel;
        this.mainModel.shareUrl = shareUrl;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('share_pinterest'),
            fa: true,
            tooltip: true
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.initSharePn(this.mainModel);
    }
});


