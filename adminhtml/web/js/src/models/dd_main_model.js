var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        this.registerEvents();
        this.initLayers();
    },

    registerEvents: function () {
        this._evnt().register(this.eventClick, this.obj);
    },

    initLayers: function () {
        var self = this;
        this.layersObj = new DD_Layer();
        this.canvas = $('<canvas/>', {
            id: 'canvas'
        });
        this.width = parseInt(this.obj.parent.data('width'));
        this.height = parseInt(this.obj.parent.data('height'));
        this.canvas.attr('width', this.width);
        this.canvas.attr('height', this.height);
        this.obj.self.append(this.canvas);
        this.layersObj.canvas = new fabric.Canvas('canvas');

        new DD_Layer_Main({
            width: this.obj.parent.data('width'),
            height: this.obj.parent.data('height'),
            src: this.obj.parent.data('src')
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
        var canvasContainer = document.getElementsByClassName("canvas-container")[0];
        if (blockWidth < this.width) {
            var proportion = this.height / this.width;
            newWidth = blockWidth;
            newHeight = proportion * newWidth;
            canvasContainer.setAttribute("style", "width:100%;");
            this.canvas.get(0).setAttribute("style", "width:" + newWidth + "px;height:" + newHeight + "px;position: relative;");
        }
        return;
    }
});
