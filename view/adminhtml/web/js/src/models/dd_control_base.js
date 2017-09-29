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
        if(this._addControls && !this.obj.options.fabricObject.controlsAdded) {
            this._addControls();
            this.obj.options.fabricObject.controlsAdded = true;
        }
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
