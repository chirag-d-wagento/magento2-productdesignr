var DD_Admin_Image_Model = DD_Admin_ImagesSelected_Model.extend({

    class_selected: 'selected',

    registerImage: function (obj) {
        var imgCnt = obj.self;
        this.data = obj.imgOptions;
        if (this.findImage() !== false) {
            this.selectImage(imgCnt);
        }
        this.registerClickEvent(imgCnt);
    },

    registerClickEvent: function (imgCnt) {
        var self = this;
        imgCnt.on('click', function () {
            self.selectImage(imgCnt);
        });
    },

    selectImage: function (imgCnt) {
        if (imgCnt.hasClass('selected')) {
            imgCnt.removeClass('selected');
            this.removeImage(this.data.group_index, this.data.media_id);
        } else {
            imgCnt.addClass('selected');
            this.addImage(this.data.group_index, this.data.media_id, this.data);
        }
    },

    getGroupImages: function () {
        this.groups = this.getGroups();
        return this.groups[this.getGroupIndexByUid(this.data.group_index)]['imgs'];
    },

    findImage: function () {
        var media_id = this.getImgIndex(this.data.group_index, this.data.media_id);
        return media_id;
    }
});
