var DD_ImportInstagram_Model = DD_ModelBase.extend({

    cookie_name: 'designer-instagram-token',
    init: function (obj) {
        this.obj = obj;
    },

    setClickEvents: function () {
        var self = this;
        this.obj.self.on('click', function () {
            self.obj.content.addClass('tab-loading');
            self.obj.contentImages.html(self._('loading') + '...');
        });
    }
});
