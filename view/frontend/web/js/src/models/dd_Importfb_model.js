var DD_ImportFb_Model = DD_ModelBase.extend({

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
