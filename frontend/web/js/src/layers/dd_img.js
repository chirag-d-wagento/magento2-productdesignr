var DD_Layer_Img = DD_Layer_Base.extend({
    init: function (options) {
        var self = this;
        if (!options.noselectable) {
            options = this.prepareSizeOfImage(options);
        }
        fabric.Image.fromURL(options.src, function (iImg) {
            iImg
                    .set({
                        hasControls: options.nocontrols ? false : true,
                        hasBorders: options.noborders ? false : true,
                        selectable: options.noselectable ? false : true,
                        width: options.width,
                        height: options.height
                    });
            if (options.scaleToWidth && options.scaleToWidth < options.width) {
                iImg.scaleToWidth(options.scaleToWidth);
            }
            self._l().canvas.add(iImg);

            if (!options.noselectable) {
                iImg.center();
                iImg.setCoords();
                
            }
            self._l().canvas.renderAll();

            if (!options.noselectable) {
                self._l().canvas.setActiveObject(iImg);
            }
            
            console.log('REAL WIDTH: ' + iImg.getWidth());
            self._addImage(options);
        }, {crossOrigin: 'anonymous'});
    },

    prepareSizeOfImage: function (options) {
        console.log(options);
        var canvasWidth = this._l().canvas.getWidth();
        console.log(canvasWidth);
        var newImageWidth = parseInt(canvasWidth / 100 * this._s('percentSizeImage'));
        var newImageHeight = (newImageWidth / options.width) * options.height;
        options.scaleToWidth = newImageWidth;
        options.scaleToHeight = newImageHeight;
        console.log(options);

        return options;
    }
});

