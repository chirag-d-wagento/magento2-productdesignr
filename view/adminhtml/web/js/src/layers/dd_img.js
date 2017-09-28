var DD_Layer_Img = DD_Layer_Base.extend({
    init: function (options) {
        var self = this;
        if(options.parent) {
            this.parent = options.parent;
        }
        fabric.Image.fromURL(options.src, function (iImg) {
            var parent = self.getParent()
            var conf = {
                hasControls: options.nocontrols ? false : true,
                hasBorders: options.noborders ? false : true,
                selectable: options.noselectable ? false : true,
                controlModel: 'DD_control_image'
            }
            var mask = self._l().getMask();
            var percentWidth = !mask ? self._s('defaultLayerMaskWidth') : self._s('percentSizeFromMask');
            if (!options.noChangeSize) {
                conf = self.setSize(conf, {
                    width: options.width,
                    height: options.height
                }, percentWidth);
            }
            if (!options.noChangeSize) {
                conf = self.positionToBase(conf);
            }

            iImg
                    .set(conf);
            parent.add(iImg);
            
            self.setObjAngle(iImg);
            
            parent.renderAll();
            
            if (!options.noselectable) {
                parent.setActiveObject(iImg);
            }
            
            self.object = iImg;
            self.onCreated();
            //self.setDeselectEvent();
            
        }, {crossOrigin: 'anonymous'});
    }
});

