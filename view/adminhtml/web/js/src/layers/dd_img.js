var DD_Layer_Img = DD_Layer_Base.extend({
    init: function (options) {
        var self = this;
        if (!options.noselectable) {
            options = this.prepareSizeOfImage(options);
        }
        fabric.Image.fromURL(options.src, function (iImg) {
            var opt = {
                hasControls: options.nocontrols ? false : true,
                hasBorders: options.noborders ? false : true,
                selectable: options.noselectable ? false : true,
                width: options.width,
                height: options.height
            };
            iImg
                    .set(opt);
            if (options.scaleToWidth && options.scaleToWidth < options.width) {
                iImg.scaleToWidth(options.scaleToWidth);
            }
            self._l().canvas.add(iImg);

            if (!options.noselectable) {
                var offsets = self.getOffsets(opt)
                iImg
                        .set({
                            left: offsets.left,
                            top: offsets.top

                        });
            }
            self._l().canvas.renderAll();

            if (!options.noselectable) {
                self._l().canvas.setActiveObject(iImg);
            }
            self._addImage(options);
        }, {crossOrigin: 'anonymous'});
    },

    getOffsets: function (options, size) {
        return {
            'left': (options.width - size) / 2,
            'top': (options.height - size) / 2
        }
    },

    prepareSizeOfImage: function (options) {
        console.log(options);
        var canvasWidth = this._l().canvas.getWidth();
        console.log(canvasWidth);
        console.log(this._s('percentSizeImage'));
        var newImageWidth = parseInt(canvasWidth / 100 * this._s('percentSizeImage'));
        var newImageHeight = (newImageWidth / options.width) * options.height;
        options.scaleToWidth = newImageWidth;
        options.scaleToHeight = newImageHeight;
        console.log(options);

        return options;
    }
});

