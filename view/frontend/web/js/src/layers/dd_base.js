var DD_Layer_Base = DD_object.extend({
    init: function(id) {
        this._super(id);
    },
    
    _addImage: function(extra) {
        var objNum = this._l().getLast();
        var obj = this._l().canvas.item(objNum);
        this._l().addLayer(obj, this._l().TYPE_IMG, extra);
    },
    
    _addText: function(extra) {
        var objNum = this._l().getLast();
        var obj = this._l().canvas.item(objNum);
        this._l().addLayer(obj, this._l().TYPE_TXT, extra);
    }
});

