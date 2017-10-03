var DD_Layer_Text = DD_Layer_Base.extend({
    init: function (options, fullCnfg) {
        var parent = this.getParent();

        var options = options ? options : {};
        var text = fullCnfg ? fullCnfg.text : options.text;
        
        if (!fullCnfg) {
            var conf = {
                fontSize: this.calcFontSize(),
                fontFamily: options.fontFamily ? options.fontFamily : this._s('defaultFont'),
                fill: options.fill ? options.fill : this._s('defualtFontColor')
            };
        } else {
            var conf = fullCnfg;
        }

        var text = new fabric.Text(text, conf);
        parent.add(text);
        
        if (!fullCnfg) {
            var coords = this.positionToBase({width: text.getWidth(), height: text.getHeight()});

            text.set({
                left: parseInt(coords.left),
                top: parseInt(coords.top)
            }).setCoords();

            this.setObjAngle(text);
        }else{
            text.setCoords();
        }

        parent.renderAll();
        if (!options.noselectable) {
            parent.setActiveObject(text);
        }
        
        this.object = text;
        this.onCreated();
    }
})
