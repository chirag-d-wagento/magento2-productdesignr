var DD_admin_group_image_model = DD_Admin_ImagesSelected_Model.extend({

    clickRemove: function (el) {
        var self = this;
        el.on('click', function () {
            var group = el.attr('data-group');
            var media_id = el.attr('data-remove');
            self.removeImage(group, media_id);

        });
    },

    clickEdit: function (el, options) {
        el.on('click', function () {
            $('#dd_designer').html('');
            $('#dd_designer').empty();
            
            
            $('#dd_designer').dd_productdesigner({
                'src': options.src
            });
        });
    }

});
