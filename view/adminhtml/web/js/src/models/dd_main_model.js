var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    eventObjectChanged: 'object-changed',
    eventObjectChanged: 'object-added',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        this.initLayers();
    },

    registerEvents: function () {
        this._evnt().register(this.eventClick, this.obj);
        this._evnt().register(this.eventObjectChanged, this.obj);
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

        hoverCanvas.on('object:added', function (e) {
            new DD_control({
                parent: self.obj.self,
                fabricObject: e.target
            });
            e.target.uid = self.createUUID();
            self._onUpdate(e.target, 'update');
        });

        hoverCanvas.on('mouse:down', function (e) {
           
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
        })
        hoverCanvas.on('object:modified', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
            self._onUpdate(e.target, 'update');
        });
        hoverCanvas.on('object:removed', function (e) {
            self._onUpdate(e.target, 'remove');
        });

        new DD_Layer_Main({
            width: width,
            height: height,
            src: this.obj.options.src
        });


        this.resize(width, height);
        $(window).on('resize', function () {
            self.resize(width, height);
        });
        return;
    },

    _onUpdate: function (fabricObj, type) {
        console.log('_onUpdate');
        console.log(this);
        
        if (this.obj.options.onUpdate) {
            this.obj.options.onUpdate.call(
                    null,
                    fabricObj,
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
    }
});
