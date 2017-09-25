var DD_Layer_Text = DD_Layer_Base.extend({
    init: function (options) {
        var text = new fabric.IText(options.text, {
            left: 10,
            top: 5,
            fontSize: options.fontSize ? options.fontSize : this._s('defaultFontSize'),
            fontFamily: options.fontFamily ? options.fontFamily : this._s('defaultFont'),
            fill: options.fill ? options.fill : this._s('defualtFontColor')
        }).on('changed', function(){
            console.log(this);
        });
        
        this._l().canvas.add(text);
        //text.center();
        //text.setCoords();
        //this._l().canvas.centerObject(text);
        this._l().canvas.setActiveObject(text);
        this._l().canvas.renderAll();
        this._addText(options);

    }
})
