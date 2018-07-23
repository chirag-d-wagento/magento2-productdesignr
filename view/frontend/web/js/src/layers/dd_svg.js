var DD_Layer_Svg = DD_Layer_Base.extend({
    
    init: function (conf) {
        
        var extraConfig = this._s('extra_config');
        
        var parent = this.getParent();
        var self = this;
        var svgString = conf.svgString;
        var reg = /translate\(.+?\)/g;
        svgString = svgString.replace(reg, "");
        var reg2 = /scale\(.+?\)/g;
        svgString = svgString.replace(reg2, "");
        var reg3 = /rotate\(.+?\)/g;
        svgString = svgString.replace(reg3, "");
        
        fabric.loadSVGFromString(svgString, function(svg, opt) {
            delete conf.paths;
            delete opt.angle;
            var object = fabric.util.groupSVGElements(svg);
            var iImg = new fabric.Group(object.getObjects(), opt);
            iImg.set(conf);
            
            if(extraConfig && extraConfig.disable_photos_resize) {
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
            
            if(extraConfig && extraConfig.disable_photos_rotate) {
                 iImg.setControlsVisibility({
                    mtr: false
                });
            }
            
            parent.add(iImg);
            self.removeControlsMiddle(iImg);
            parent.calcOffset();
            
            parent.renderAll();
            parent.setActiveObject(iImg);
            
            self.object = iImg;
            
            self.onCreated();
        });
        
    }
    
});
