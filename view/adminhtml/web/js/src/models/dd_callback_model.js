var DD_Callback_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    _callbackClick: function () {
        if (this.obj.callback) {
            var self = this;
            this.obj.get().on('click', function () {
                var canvasBg = self._l() ? self._l().getBgCanvas() : null;
                var canvasHover = self._l() ? self._l().getHoverCanvas() : null;
                if(self.destroy) {
                   self.destroy.call(); 
                }
                self.obj.callback.call(self.obj, canvasBg, canvasHover);
            });
        }
    }
})
