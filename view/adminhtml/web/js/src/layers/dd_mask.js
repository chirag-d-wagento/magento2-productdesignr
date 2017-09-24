var DD_Layer_Mask = DD_Layer_Base.extend({
    persentFromWidth: 40,
    init: function (options) {
        this.options = options;
        this.addRect( options );
    },
    
    addRect: function(options) {
        var offsets = this.getOffsets(this.getRectSize());
        console.log( offsets );
        var rect = new fabric.Rect({
            width: this.getRectSize(),
            height: this.getRectSize(),
            fill: 'white',
            stroke: 'black',
            opacity: 0.4,
            left: offsets.left,
            top: offsets.top
        })
        this._l().canvas.add(rect);
        this._l().canvas.renderAll();
        this._l().canvas.setActiveObject(rect);
    },
    
    getRectSize: function() {
        return (this.options.width / 100) * this.persentFromWidth;
    },
    
    getOffsets: function(size) {
        return {
            'left': (this.options.width - size)/2,
            'top': (this.options.height - size)/2  
        }
    }
});
