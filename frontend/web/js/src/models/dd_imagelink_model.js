var DD_ImageLink_Model = DD_ModelBase.extend({

    setClickEvents: function (obj) {
        var self = this;
        obj.on('click', function () {
            new DD_Layer_Img({
                src: $(this).attr('data-src'),
                width: parseInt($(this).attr('data-width')),
                height: parseInt($(this).attr('data-height'))
            });
            self._w().close();            
        });
    }
});
