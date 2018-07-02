var DD_Layer_Img = DD_Layer_Base.extend({
    init: function (options, fullCnfg, notSelect) {
        var self = this;
        var options = options ? options : {};
        if (options.parent) {
            this.parent = options.parent;
        }
        var src = fullCnfg ? fullCnfg.src : options.src;
        var ext = src.substr(src.lastIndexOf('.') + 1);

        function ___callBack(iImg, isSvg, src_orig) {
            var parent = self.getParent()
            if (!fullCnfg) {
                var conf = {
                    hasControls: options.nocontrols ? false : true,
                    hasBorders: options.noborders ? false : true,
                    selectable: options.noselectable ? false : true,
                    controlModel: 'DD_control_image',
                    centeredScaling: true,
                    src_orig: src_orig,
                    isSvg: isSvg
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
            } else {
                var conf = fullCnfg;
            }

            conf.notSelect = notSelect;
            if (!isSvg) {
                iImg
                        .set(conf);
            } else {
                var _opt = {
                    width: options.width,
                    height: options.height,
                    scaleY: conf.height / options.height,
                    scaleX: conf.width / options.width
                };

                var object = fabric.util.groupSVGElements(iImg);
                iImg = new fabric.Group(object.getObjects(), _opt);

                delete conf.width;
                delete conf.height;

                iImg.set(conf);
            }
            
            if(self._s('extra_config').disable_photos_resize) {
                iImg.setControlsVisibility({
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
            if(self._s('extra_config').disable_photos_rotate) {
                iImg.setControlsVisibility({
                    mtr: false
                });
            }
            
            parent.add(iImg);
            self.removeControlsMiddle(iImg);

            if (!options.noChangeSize) {
                self.setObjAngle(iImg);
            }

            parent.renderAll();

            if (!options.noselectable && !conf.notSelect) {
                parent.setActiveObject(iImg);
            }

            
            self.object = iImg;
            self.onCreated();

        }
        if (ext !== 'svg') {
            fabric.Image.fromURL(src, function (iImg) {
                ___callBack(iImg);
            }, {crossOrigin: 'anonymous'});
        } else {
            fabric.loadSVGFromURL(src, function (svgobject) {
                ___callBack(svgobject, true, src);
            });
        }
    }
});

