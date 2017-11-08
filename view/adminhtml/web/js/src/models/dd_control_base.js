var DD_Control_Base_Model = DD_ModelBase.extend({
    controlTitleClass: 'control-title',

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    _initBase: function () {
        this.obj.options.fabricObject.controlModelCreated = this;
    },

    initPosition: function () {
        this.obj.get().css({
            //left: this.calcLeftosition(),
            top: this.calcTopPosition()
        });
        this.obj.get().fadeIn('slow');
        if (this._addControls && !this.obj.options.fabricObject.controlsAdded) {
            this._addControls();
            this.obj.options.fabricObject.controlsAdded = true;
        }
    },

    titleControl: function (titleText) {
        this.obj.content.get()
                .append($('<span />').addClass(this.controlTitleClass).text(titleText));
    },

    sizeBase: function () {
        var self = this;
        var fabricObj = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();

        this.obj._size.get().on('click', function () {

            var defaultScale = self.obj.options.fabricObject.defaultScale
                    ? self.obj.options.fabricObject.defaultScale
                    : self.obj.options.fabricObject.scaleX;

            //defaultScale = defaultScale ? defaultScale : 1;    
            if (!self.obj.options.fabricObject.defaultScale) {
                self.obj.options.fabricObject.defaultScale = defaultScale;
            }
            var currentScale = self.obj.options.fabricObject.scaleX;

            self.obj.content.get().empty();
            self.titleControl(self._('change_size'));
            self.obj.addControlBase({
                'min': 0,
                'max': 2,
                'step': 0.01,
                'value': currentScale / defaultScale
            });
            self.obj.contentContainer.get().show();
            self.obj.control.on('input', function () {
                var val = $(this).val();
                val = val * defaultScale;

                fabricObj.set({
                    'scaleX': parseFloat(val),
                    'scaleY': parseFloat(val)
                });
                fabricObj.setCoords();
                canvas.renderAll();
            });

            self.obj.control.on('mouseup', function () {
                canvas.trigger('object:modified', {target: fabricObj});
            });

        });
    },

    rotateBase: function () {
        var self = this;
        var fabricObj = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();
        this.obj._rotate.get().on('click', function () {

            self.obj.content.get().empty();
            self.titleControl(self._('rotate'));
            self.obj.addControlBase({
                'min': 0,
                'max': 360,
                'value': parseInt(fabricObj.get('angle'))
            });
            self.obj.contentContainer.get().show();
            self.obj.control.on('input', function () {
                var val = $(this).val();
                fabricObj.setAngle(val);
                fabricObj.setCoords();
                canvas.renderAll();
            });

            self.obj.control.on('mouseup', function () {
                canvas.trigger('object:modified', {target: fabricObj});
            });

        });
    },

    baseEvents: function () {
        if (this.obj._size) {
            this.sizeBase();
        }
        if (this.obj._rotate) {
            this.rotateBase();
        }
    },

    hideContentEvent: function () {
        var self = this;
        this.obj._closeContent.get().on('click', function () {
            self.obj.contentContainer.get().hide();
        });
    },

    removeBase: function () {
        if (this.obj.options.fabricObject.isSvg === true) {
            var canvas =  this._l().getHoverCanvas();
            this.obj.options.fabricObject.forEachObject(function (a) {
                canvas.remove(a);
            });
            canvas.remove(this.obj.options.fabricObject);
            return;
        }
        
        this.obj.options.fabricObject.remove();
    },

    setFabricObjVal: function (propName, val) {
        var fabricObject = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();
        if (propName === 'fill') {
            fabricObject.setFill(val ? val : 'transparent');

        } else {
            fabricObject.set(propName, val);
        }
        canvas.renderAll();
        canvas.trigger('object:modified', {target: fabricObject});
    },

    calcTopPosition: function () {
        return '0';
    },

    calcLeftosition: function () {
        //return '0';
    },

    hide: function () {
        this.obj.contentContainer.get().hide()
        this.obj.get().fadeOut('fast');
    },

    remove: function () {
        this.obj.get().remove();
    }
});
