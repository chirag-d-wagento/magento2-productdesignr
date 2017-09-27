var DD_Control_Base_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
        this._super();
    },
    
    initPosition: function() {
        this.obj.get().css({
            left: this.calcLeftosition(),
            top: this.calcTopPosition()
        });
        this.obj.get().fadeIn('slow');
        this.obj.options.fabricObject.controlModelCreated = this;
    },
    
    calcTopPosition: function() {
        var parent = this._l().getHoverCanvas();
        var zoom = parent.getZoom();
        var bounds = this.obj.options.fabricObject.getBoundingRect();
        return (bounds.top + bounds.height) + 10
    },
    
    calcLeftosition: function() {
        var parent = this._l().getHoverCanvas();
        var zoom = parent.getZoom();
        var bounds = this.obj.options.fabricObject.getBoundingRect();
        var left = ( bounds.left + (bounds.width)/2 
                - this.obj.get().width()/2) + 10;
        return left;
    },
    
    hide: function() {
        this.obj.get().fadeOut('fast');
    }
});
