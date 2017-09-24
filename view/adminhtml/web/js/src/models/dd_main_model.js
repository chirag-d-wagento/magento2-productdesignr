var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        //this.registerEvents();
        this.initLayers();
    },

    registerEvents: function () {
        this._evnt().register(this.eventClick, this.obj);
    },

    initLayers: function () {
        var self = this;
        this.layersObj = new DD_Layer();
        var idCanvas = 'canvas-' + this.createUUID;
        this.canvas = $('<canvas/>', {
            id: idCanvas
        });
        this.width = this.obj.options.width;
        this.height = this.obj.options.height;
        this.canvas.attr('width', this.width);
        this.canvas.attr('height', this.height);
        this.obj.self.append(this.canvas);
        this.layersObj.canvas = new fabric.Canvas(idCanvas);
        new DD_Layer_Main({
            width: this.width,
            height: this.height,
            src: this.obj.options.src
        });

        this.resize();
        $(window).on('resize', function () {
            self.resize();
        });
        return;
    },

    resize: function () {
        var blockWidth = this.obj.self.width();
        var newWidth, newHeight;
        var proportion = this.height / this.width;
        newWidth = blockWidth;
        newHeight = proportion * newWidth;
        if (blockWidth < this.width) {
            var scaleFactor = blockWidth / this.layersObj.canvas.getWidth();
            if (scaleFactor != 1) {
                this.layersObj.canvas.setWidth(blockWidth);
                this.layersObj.canvas.setHeight(newHeight);
                this.layersObj.canvas.setZoom(scaleFactor);
                this.layersObj.canvas.calcOffset();
                this.layersObj.canvas.renderAll();
            }
            return;
        }
        return;
    }
});
