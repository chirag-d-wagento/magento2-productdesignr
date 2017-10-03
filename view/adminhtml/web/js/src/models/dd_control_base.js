var DD_Control_Base_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
        this._super();
    },
    
    _initBase: function() {
        this.obj.options.fabricObject.controlModelCreated = this;
    },
    
    initPosition: function() {
        this.obj.get().css({
            left: this.calcLeftosition(),
            top: this.calcTopPosition()
        });
        this.obj.get().fadeIn('slow');    
        if(this._addControls && !this.obj.options.fabricObject.controlsAdded) {
            this._addControls();
            this.obj.options.fabricObject.controlsAdded = true;
        }
    },
    
    removeBase: function() {
        this.obj.options.fabricObject.remove();
    },
    
    calcTopPosition: function() {
        return '0';
    },
    
    calcLeftosition: function() {
        return '0';
    },
    
    hide: function() {
        this.obj.get().fadeOut('fast');
    },
    
    remove: function() {
        this.obj.get().remove();
    }
});
