var DD_RemoveAll_model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },
    addClearAllEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            var canvas = self._l().getHoverCanvas();
            canvas.clear();
            canvas.renderAll();
            canvas.trigger('object:clear_all', {});
        });
    }
});


