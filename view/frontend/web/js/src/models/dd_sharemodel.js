var DD_Share_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    initShareFb: function (mainModel) {
        this.mainModel = mainModel;
        var self = this;
        this.obj.get().on('click', function () {
            self.sendData('facebook');
        });
    },

    sendData: function (type) { //fb or instagram
        var self = this;
        switch (type) {
            case 'facebook':
                var _class = 'fa-facebook';
                break;

        }
        var img = this.mainModel;
        this.showLoading(_class);
        this.mainModel.unselectAll();
        $.ajax({
            url: this.mainModel.shareUrl,
            type: 'json',
            method: 'post',
            data: {
                'type': type,
                'img': this.mainModel.getDataImg()
            }
        })
                .done(function (response) {
                    self.hideLoading(_class);
                    if(response.error) {
                        alert(response.errMessage);
                        return;
                    }
                    if(response.share_url) {
                        window.open(response.share_url);
                    }
                });
    },

    showLoading: function (_class) {
        this.obj.get().removeClass(_class)
                .addClass('fa-circle-o-notch')
                .addClass('fa-spin');
    },

    hideLoading: function (_class) {
        this.obj.get().removeClass('fa-spin')
                .removeClass('fa-circle-o-notch')
                .addClass(_class);
    }
});
