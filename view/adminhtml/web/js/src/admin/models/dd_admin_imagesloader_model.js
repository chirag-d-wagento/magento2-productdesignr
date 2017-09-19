var DD_Admin_ImagesLoader_Model = DD_ModelBase.extend({
    
    eventShow: 'show-admin-loader',
    eventHide: 'hide-admin-loader',
    
    init: function (obj) {
        this.obj = obj;
        this._super();
    },
    
    registerEvents: function () {
        this._evnt().register(this.eventShow, this.obj);
        this._evnt().register(this.eventHide, this.obj);
    },
    
    registerCalls: function(){
        var self = this;
        this._evnt().registerCallback(this.eventShow, function(window) {
            self.obj
                .get(0)
                .show();
        });
        this._evnt().registerCallback(this.eventHide, function(window) {
            self.obj
                .get(0)
                .hide();
        });
    }
    
});
