var DD_Layer_Text = DD_Layer_Base.extend({
    init: function (options, fullCnfg, notSelect) {
        var parent = this.getParent();

        var options = options ? options : {};
        var text = fullCnfg ? fullCnfg.text : options.text;

        if (!fullCnfg) {
            var conf = {
                fontSize: this.calcFontSize(),
                fontFamily: options.fontFamily ? options.fontFamily : this._s('defaultFont'),
                fill: options.fill ? options.fill : this._s('defualtFontColor'),
                controlModel: 'DD_control_text',
                centeredScaling: true
            };
        } else {
            var conf = fullCnfg;
        }

        conf.notSelect = notSelect;
        if (!this._s('extra_config').max_text_chars) {
            var text = new fabric.IText(text, conf);
        } else {
            var text = new fabric.Text(text, conf);
        }

        if (this._s('extra_config').disable_text_resize) {
            text.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                bl: false,
                br: false,
                tl: false,
                tr: false,
                //mtr: false
            });
        }
        
        if (this._s('extra_config').disable_text_rotate) {
            text.setControlsVisibility({
                mtr: false
            });
        }

        parent.add(text);

        if (!fullCnfg) {
            var coords = this.positionToBase({width: text.getWidth(), height: text.getHeight()});

            text.set({
                left: parseInt(coords.left),
                top: parseInt(coords.top)
            }).setCoords();

            this.setObjAngle(text);
        } else {
            text.setCoords();
        }

        this.removeControlsMiddle(text);

        parent.renderAll();
        if (!options.noselectable && !conf.notSelect) {
            parent.setActiveObject(text);
        }

        this.object = text;
        this.onCreated();
    }
})
