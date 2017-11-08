var DD_Layer_Base = DD_object.extend({

    init: function (id) {
        this._super(id);
    },

    positionToBase: function (options, setTo) {
        var parent = this.getParent();
        switch (setTo) {
            default:
                options = this.positionCenterCenter(parent, options);  
                break;
        }
        return options;
    },
    
    getParent: function() {
        if(this.parent) {
            return this.parent;
        }
        return this._l().getHoverCanvas();//canvas
    },
    
    positionCenterCenter: function(parent, options) {
        
        if(this._l().getMask()) {
            var mask = this._l().getMask();
            var pointCenter = mask.getCenterPoint();
            options.left = (pointCenter.x) - ((options.width)/2);
            options.top = (pointCenter.y) - ((options.height)/2); 
        }else{
            options.left = (this._l().getWidth() - options.width)/2;
            options.top = (this._l().getHeight() - options.height)/2;
        }
        options.centeredRotation = true;
        return options;
    },
    
    getAngle: function() {
        if(this._l().getMask()) {
            var angle = this._l().getMask().get('angle');
        }else{
            var parent = this.getParent();
            var angle = parent.get('angle');
        }
        return angle;
    },

    calcFontSize: function () {
        if(this._l().getMask()) {
           var width = this._l().getMask().getWidth(); 
        }else{
            var width = this._l().getWidth();
        }
        var canvas = this._l().getHoverCanvas();
        return parseInt(this._s('defaultFontSize')/canvas.getZoom()) * 
                (width / canvas.getWidth());
    },
    
    setSize: function(options, sizes, percentFromParent) {
        options.width  = this.calcObjectSize(sizes, percentFromParent).width;
        options.height = this.calcObjectSize(sizes, percentFromParent).height;
        return options;
    },

    calcObjectSize: function (sizes, percentFromParent) {
        if(this._l().getMask()) {
            var mask = this._l().getMask();
            var width  = mask.get('width') * mask.get('scaleX');
            var height = mask.get('height') * mask.get('scaleY');
        }else{
            var width = this._l().getWidth();
            var height = this._l().getHeight();
        }
        var newWidth = (width/100)*percentFromParent;
        if(sizes && sizes.width < newWidth) {
            //return sizes;
        }
        if(sizes){
            var prop = sizes.height/sizes.width;
            var newHeight = newWidth * prop;
        }else{
            var newHeight = ( height / 100 ) * percentFromParent;
        }
        var sizes = {
            width: newWidth,
            height: newHeight
        }
        return sizes;
    },
    
    getObject: function() {
        return this.object;
    },
    
    setDeselectEvent: function() {
        this.object.on('deselected', function(e) {
            if(typeof(this.controlModelCreated)!=='undefined') {
                this.controlModelCreated.hide();
            }
        });
    },
    
    setObjAngle: function(object) {
        var angle = this.getAngle();
        if(angle && !object.get('angle')) {
            object.setAngle(angle);
        }
    },
    
    removeControlsMiddle: function(obj) {
        obj['setControlVisible']('mb', false);
        obj['setControlVisible']('mt', false);     
    },
    
    onCreated: function() {
        this.setDeselectEvent();
        //this.removeControlsMiddle();
    }
});