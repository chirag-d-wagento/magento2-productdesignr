var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    eventObjectChanged: 'object-changed',
    eventObjectChanged: 'object-added',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        //this.registerEvents();
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
            console.log('object:added');
            console.log(e.target);
        });

        hoverCanvas.on('mouse:down', function (e) {
            /*
             var target = e.target;
             if (target.layerMask) {
             hoverCanvas.clipTo = function (ctx) {
             ctx.restore();
             hoverCanvas.calcOffset();
             hoverCanvas.replaceAll();
             }
             }
             */
            console.log('mouse:down');
            console.log(e.target);
        });
        hoverCanvas.on('object:moving', function (e) {
            console.log(e.target.controlModelCreated);
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
            /*
             var target = e.target;
             if (target.layerMask) {
             hoverCanvas.clipTo = function (ctx) {
             var zoom = hoverCanvas.getZoom();
             ctx.rect(target.get('left') * zoom,
             target.get('top') * zoom,
             target.get('width') * zoom,
             target.get('height') * zoom
             );
             }
             }
             */
        });

/*
        hoverCanvas.on('after:render', function () {
            hoverCanvas.contextContainer.strokeStyle = '#555';
            hoverCanvas.forEachObject(function (obj) {
                var bound = obj.getBoundingRect(); // <== this is the magic
                console.log(bound);
                canvas.contextContainer.strokeRect(
                        bound.left,
                        bound.top,
                        bound.width,
                        bound.height
                        );

            });

        });
*/
        hoverCanvas.on('before:selection:cleared', function (e) {
            console.log(e.target.controlModelCreated);
            console.log('selection:cleared');
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        
        

        hoverCanvas.on('object:selected', function (e) {
            console.log(e.target.controlModelCreated);
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
        })
        hoverCanvas.on('object:modified', function (e) {
            console.log('object:modified');
            console.log(e.target);
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
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
