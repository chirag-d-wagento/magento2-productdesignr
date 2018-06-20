var DD_shareButton = DD_button.extend({

    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-share-alt fa',
    model: 'DD_Share_Model',

    shareButtons: [],

    init: function (parent, mainModel, shareUrl, controlButtons) {
        this.shareButtons = [];
        
        this.mainModel = mainModel;
        this.mainModel.shareUrl = shareUrl;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('share'),
            fa: true,
            tooltip: true
        }
        this.parent = parent;
        this._super(options);

        this.controlButtons = controlButtons;
        this.addSharePanel();
        this.addButtons();
    },

    addButtons: function () {
        this.addShareFbButton();
        this.addShareTwButton();
        this.addSharePnButton();
    },

    addSharePanel: function () {
        this.sharePanel = new DD_panel({
            class: 'dd-share-panel',
            parent: this.parent
        });
        this.sharePanel.add();
    },

    addShareFbButton: function () {
        if (!this._s('shareFb')) {
            return;
        }
        var fbButton = new DD_shareFbButton(this.sharePanel.self, this.mainModel, this.mainModel.shareUrl);
        this.shareButtons.push(fbButton);
    },

    addShareTwButton: function () {
        if (!this._s('shareTw')) {
            return;
        }
        var twButton = new DD_shareTwButton(this.sharePanel.self, this.mainModel, this.mainModel.shareUrl);
        this.shareButtons.push(twButton);
    },
    
    addSharePnButton: function() {
        if (!this._s('sharePn')) {
            return;
        }
        var pnButton = new DD_sharePnButton(this.sharePanel.self, this.mainModel, this.mainModel.shareUrl);
        this.shareButtons.push(pnButton);
      
    },

    _callBackModel: function (model) {
        model.initMainClick();
    }
});
