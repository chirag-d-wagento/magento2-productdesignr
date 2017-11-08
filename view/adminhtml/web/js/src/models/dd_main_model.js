var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    eventObjectChanged: 'object-changed',
    eventObjectAdded: 'object-added',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        var self = this;

        if (this._s('loadGoogleFonts')) {
            var fonts = self.prepareFonts();
            console.log(fonts);
            WebFont.load({
                google: {
                    families: fonts
                },
                active: function () {
                    self.initLayers();
                }
            });
            return;
        }
        this.initLayers();
    },

    registerEvents: function () {
        this._evnt().register(this.eventClick, this.obj);
        this._evnt().register(this.eventObjectChanged, this.obj);
        this._evnt().register(this.eventObjectAdded, this.obj);
    },

    initLayers: function () {
        var self = this;
        this.layersObj = new DD_Layer();
        var idBgCanvas = 'canvas-' + this.createUUID();
        var idCanvasHover = 'canvas-hover-' + this.createUUID();
        var bgCanvas = $('<canvas/>', {
            id: idBgCanvas
        });
        var hoverCanvas = $('<canvas/>', {
            id: idCanvasHover
        });
        var width = this.obj.options.width;
        var height = this.obj.options.height;
        bgCanvas.attr({
            'width': width,
            'height': height
        });
        hoverCanvas.attr({
            'width': width,
            'height': height
        });
        this.obj.self.append(bgCanvas);
        var div = $('<div />').addClass('canvas-absolute')
                .append(hoverCanvas);
        this.obj.self.append(div);

        var bgCanvas = new fabric.Canvas(idBgCanvas);
        var hoverCanvas = new fabric.Canvas(idCanvasHover);

        this.layersObj.setBgCanvas(bgCanvas);
        this.layersObj.setHoverCanvas(hoverCanvas);
        this.layersObj.setHeight(height);
        this.layersObj.setWidth(width);

        new DD_Layer_Main({
            width: width,
            height: height,
            src: this.obj.options.src
        });

        this._canvasEvents(hoverCanvas);
        this._addObjects(this.obj.options);

        this.resize(width, height);
        $(window).on('resize', function () {
            self.resize(width, height);
        });
        return;
    },

    _canvasEvents: function (hoverCanvas) {
        var self = this;
        hoverCanvas.on('object:added', function (e) {

            new DD_control({
                parent: self.obj.self,
                fabricObject: e.target
            });
            if (e.target.uid) {
                return;
            }
            e.target.uid = self.createUUID();
            e.target.uid.toString();
            self._onUpdate(e.target, 'update');

        });
        hoverCanvas.on('object:moving', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:scaling', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:rotating', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:skewing', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });

        hoverCanvas.on('before:selection:cleared', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:selected', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
            self._onUpdate(e.target, 'update');
        })
        hoverCanvas.on('object:modified', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
            self._onUpdate(e.target, 'update');
        });
        hoverCanvas.on('object:removed', function (e) {
            self._onUpdate(e.target, 'remove');
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.remove();
            }
        });
        
        hoverCanvas.on('object:extra_config', function (e) {
            e.type = 'extra_conf';
            self.obj.options.onUpdate.call(
                    null,
                    e,
                    self.obj.options.group_index,
                    self.obj.options.media_id,
                    'extra_conf');
        });
    },

    _addObjects: function (options) {
        if (options.mask) {
            var mask = new DD_Layer_Mask(options.mask, true);
            mask.save();
        }
        if (options.conf) {
            var last = options.conf.length;
            $(options.conf).each(function (i, obj) {
                var notSelect = (last - 1) == i ? false : true;
                if (obj.type === 'image') {
                    new DD_Layer_Img(null, obj, notSelect);
                }
                if (obj.type === 'text') {
                    new DD_Layer_Text(null, obj, notSelect);
                }
            });
        }
        ;
    },

    _onUpdate: function (fabricObj, type) {
        var newObject = fabricObj.toJSON();
        newObject.uid = fabricObj.uid;
        if (fabricObj.layerMask) {
            newObject.layerMask = true;
        }
        if (fabricObj.controlModel) {
            newObject.controlModel = fabricObj.controlModel;
        }

        if (this.obj.options.onUpdate) {
            this.obj.options.onUpdate.call(
                    null,
                    newObject,
                    this.obj.options.group_index,
                    this.obj.options.media_id,
                    type);
        }
    },

    resize: function (width, height) {
        var blockWidth = this.obj.self.width();
        var newWidth, newHeight;
        var proportion = height / width;
        newWidth = blockWidth;
        newHeight = proportion * newWidth;
        if (blockWidth < width) {
            var bgCanvas = this.layersObj.getBgCanvas();
            var hoverCanvas = this.layersObj.getHoverCanvas();
            var scaleFactor = blockWidth / this._l().getWidth();
            if (scaleFactor != 1) {
                bgCanvas.setWidth(blockWidth);
                bgCanvas.setHeight(newHeight);
                bgCanvas.setZoom(scaleFactor);
                bgCanvas.calcOffset();
                bgCanvas.renderAll();
                hoverCanvas.setWidth(blockWidth);
                hoverCanvas.setHeight(newHeight);
                hoverCanvas.setZoom(scaleFactor);
                hoverCanvas.calcOffset();
                hoverCanvas.renderAll();
            }
            return;
        }
        return;
    },

    destroy: function () {
        this._evnt().unregisterAll();
        this.obj.self.parent().empty();
        this.obj.self.parent().remove();

        delete this;
    },

    prepareFonts: function () {
        var listFonts = this._s('listFonts');
        var googleFonts = [];
        $.each(listFonts, function (i, font) {
            if (font.indexOf('"') != -1) { //custom named font
                var fontArr = font.split(',');
                googleFonts.push(fontArr[0].replace(/\"/g, ''));
            }
        });

        return googleFonts;
    }
});
