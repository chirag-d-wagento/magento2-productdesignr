var DD_Layer_Mask = DD_Layer_Base.extend({
    
    init: function () {
        this.addRectLayer();
    },
    
    addRectLayer: function() {
        
        var parent = this.getParent();
        
        var conf = {
            fill: 'white',
            stroke: 'black',
            opacity: 0.4,
            layerMask: true,
            controlModel: 'DD_control_mask'
        };
        
        conf = this.setSize(conf, null, this._s('defaultLayerMaskWidth'));
        conf = this.positionToBase(conf);
        
        var rect = new fabric.Rect(conf);
        parent.add(rect);
        parent.renderAll();
        parent.setActiveObject(rect);
        
        this._l().setMask(rect);
        
        
        this.object = rect;
        this.setDeselectEvent();
    }
});
