var DD_control_image = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
        
        this.baseEvents();
        this.addSvgControls();
    },
    
    addDelete: function() {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function() {
            self.removeBase();
        });
    },
    
    addSvgControls: function() {
        var fabricObject = this.obj.options.fabricObject;
        var content = this.obj.content.get();
        var color = fabricObject.fill;
        
        if(fabricObject.isSvg === true) {
            this.obj.colorSelector(this.obj.buttons.get(), '', color, this.setColor, this);
        }
    },

    setColor: function (color, model) {
        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("fill", setColor);
    }
});
