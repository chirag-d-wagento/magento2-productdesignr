var DD_Layer_Base = DD_object.extend({

    init: function (id) {
        this._super(id);
    },

    positionToBase: function (options, setTo) {
        var parent = this.getParent();

        switch (setTo) {
            case 'top_left':

                break;
            default:
                options = this.positionCenterCenter(parent, options);  
                break;
        }
        return this.setAngle(parent, options);
    },
    
    getParent: function() {
        if(this.parent) {
            return this.parent;
        }
        return this._l().getHoverCanvas();//canvas
    },
    
    positionCenterCenter: function(parent, options) {
        options.left = (this._l().getWidth() - options.width)/2;
        options.top = (this._l().getHeight() - options.height)/2;
        return options;
    },
    
    setAngle: function(parent, options) {
        var angle = parent.get('angle');
        options.angle = (angle ? angle : 0);
        return options;
    },

    calcFontSize: function (baseSize, percentFromImg) {

    },
    
    setSize: function(options, sizes, percentFromParent) {
        options.width  = this.calcObjectSize(sizes, percentFromParent).width;
        options.height = this.calcObjectSize(sizes, percentFromParent).height;
        
        return options;
    },

    calcObjectSize: function (sizes, percentFromParent) {
        var parent = this.getParent();
        var width    = this._l().getWidth();
        var newWidth = (width/100)*percentFromParent;
        if(sizes && sizes.width < newWidth) {
            return sizes;
        }
        if(sizes){
            var newHeight = newWidth * (sizes.width/sizes.height);
        }else{
            var newHeight = (this._l().getHeight() / 100) * percentFromParent;
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
        this.object.on('selection:cleared', function() {
            console.log('i am deselected!');
        });
    }
});

