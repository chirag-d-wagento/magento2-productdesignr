var DD_Layer = DD_object.extend({
    layers: [],
    id: 'dd_layer',
    canvas: null,
    last: 0,
    
    TYPE_IMG: 'img',
    TYPE_TXT: 'txt',
    
    init: function() {
        this._super(this.id);
        this.setGlobal();
    },
    
    setHeight: function(height) {
        this.height = height;
    },
    
    getHeight: function(height) {
        return this.height;
    },
    
    setWidth: function(width) {
        this.width = width;
    },
    
    getWidth: function(width) {
        return this.width;
    },
    
    getBgCanvas: function() {
        return this.bgCanvas;
    },
    
    getHoverCanvas: function() {
        return this.hoverCanvas;
    },
    
    setBgCanvas: function(canvas) {
        this.bgCanvas = canvas;
    },
    
    setHoverCanvas: function(canvas) {
        this.hoverCanvas = canvas;
    },
    
    getLast: function() {
        return this.layers.length;
    },
    
    setMask: function(mask){
        this.layerMask = mask;
    },
    
    getMask: function() {
        return this.layerMask;
    }
});
