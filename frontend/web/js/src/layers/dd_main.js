var DD_Layer_Main = DD_Layer_Base.extend({
    init: function(options) {
        fabric.Object.prototype.transparentCorners = false;
        this._l().canvas.selection = false;
        options.nocontrols = true;
        options.noborders = true;
        options.noselectable = true;
        
        options.base = true;
        new DD_Layer_Img(options);
        return;
        
    }
});


