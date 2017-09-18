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
    
    addLayer: function(obj, type, data) {
        this.layers.push({
            obj: obj,
            type: type ? type : this.TYPE_IMG,
            data: data ? data : {}
        });
        
        this.last = this.layers.length;
    },
    
    getLast: function() {
        return this.layers.length;
    }
});
