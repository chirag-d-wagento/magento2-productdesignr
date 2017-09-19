var DD_Admin_ImagesSelected_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super();
        this.loadImages();
    },

    registerEvents: function () {

    },

    loadImages: function () {
        var self = this;
        this._evnt().doCall('show-admin-loader');
        $.ajax({
            url: this.obj.options.urlImages
                + '?form_key=' + window.FORM_KEY,
            data: {
                'product_sku': this.obj.options.psku
            }, 
            success: function (data) {
                self.obj.processGroups(data);
            },
            error: function () {
                alert("Something went wrong!");
            },
            complete: function () {
                self._evnt().doCall('hide-admin-loader');
            },
            cache: false
        }, 'json');
    }


});
