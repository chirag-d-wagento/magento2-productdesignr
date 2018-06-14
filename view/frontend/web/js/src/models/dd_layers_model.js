var DD_Layers_Model = DD_ModelBase.extend({

    count: 0,
    active: null,

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('layers');
    },

    setWindowContent: function (parent) {
        var canvas = this._l().getHoverCanvas();
        var objs = canvas.getObjects();
        var self = this;
        
        parent.html('');
        this.count = 0;
        $.each(objs, function () {
            var object = this;
            self.drawElement(object, parent, canvas);
        });
        
        if(this.count == 0) {
            parent.html(this._('no_data'));
        }
    },

    drawElement: function (object, parent, canvas) {
        if (typeof (object) === 'undefined') {
            return;
        }
        if (object.layerMask) {
            return;
        }

        var panel = new DD_panel({
            parent: parent,
            class: 'dd-control-layer'
        });

        panel.add();
        var type = object.isSvg ? 'svg' : object.type;
        var innerHtml = '';
        switch (type) {
            case "image":
                innerHtml += '<img src="' + object._originalElement.src + '" class="dd-control-layer-image" />'
                this.count++;
                break;
            case "svg":
                innerHtml += '<img src="' + object.src_orig + '" class="dd-control-layer-image" />'
                this.count++;
                break;
            case "text":
                innerHtml += '<span class="dd-control-layer-text">'
                        + object.text
                        + '</span>';
                this.count++;
                break;
            case "i-text":
                innerHtml += '<span class="dd-control-layer-text">'
                        + object.text
                        + '</span>';
                this.count++;
                break;
        }

        panel.get().html(innerHtml);

        this.attachPanelClick( panel, object, canvas );
        this.drawControls( panel, object, canvas, parent );
    },

    drawControls: function (panel, object, canvas, parent) {
        var self = this;
        var remove = new DD_button({
            'parent': panel.get(),
            'class': 'fa fa-trash'
        });

        remove.get().on('click', function (e) {
            e.preventDefault();
            if (object.isSvg === true) {
                object.forEachObject(function (a) {
                    canvas.remove(a);
                });
            }
            canvas.remove(object);
            canvas.renderAll();
            self.setWindowContent(parent);
        });
    },

    attachPanelClick: function (panel, object, canvas) {
        var self = this;
        var panel = panel.get();
        panel.on('click', function () {
            if(self.active) {
               self.active.removeClass('active'); 
            }
            canvas.setActiveObject(object);
            $(panel).addClass('active');
            self.active = panel;
        });
    }

});
