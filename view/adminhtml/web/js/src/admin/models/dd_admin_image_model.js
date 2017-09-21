var DD_Admin_Image_Model = DD_Admin_ImagesSelected_Model.extend({
    
    class_selected: 'selected',
    
    registerImage: function(imgCnt, data) {
        this.data = data;
        if(this.findImage()) {
            this.selectImage(imgCnt);
        }
        this.registerClickEvent(imgCnt);
    },
    
    registerClickEvent: function(imgCnt) {
        var self = this;
        imgCnt.on('click', function() {
            self.selectImage(imgCnt);
        });
    },
    
    selectImage: function(imgCnt) {
        if(imgCnt.hasClass('selected')) {
            imgCnt.removeClass('selected');
            this.removeImage(this.data.group_index, this.data.media_id);
        }else{
            imgCnt.addClass('selected');
            this.addImage(this.data.group_index, this.data.media_id, this.data);
        }
    },
    
    getGroupImages: function() {
        this.groups = this.getGroups();
        return this.groups[parseInt(this.data.group_index)]; 
    },
    
    findImage: function() {
        var self = this;
        var images = this.getGroupImages();
        var media_id = false;
        $.each(images, function(i, image) {
            if(image.media_id == self.data.media_id) {
                media_id = image.media_id;
            }
        });
        
        return media_id;
    }
});
