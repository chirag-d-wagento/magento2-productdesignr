var DD_Admin_ImagesSelected_Model = DD_ModelBase.extend({

    groupChangedEvent: 'image-group-changed',
    groupSetEvent: 'image-group-setdata',
    groupCancelEvent: 'image-group-cancel',
    addGroupEvent: 'image-group-add',
    removeGroupEvent: 'image-group-remove',

    init: function (obj) {
        this.obj = obj;
        this._super();
        //this.loadGroups();
    },
    _registerEvents: function () {
        this._evnt().register(this.groupChangedEvent, this.obj);
        this._evnt().register(this.groupSetEvent, this.obj);
        this._evnt().register(this.addGroupEvent, this.obj);
        this._evnt().register(this.groupCancelEvent, this.obj);
        this._evnt().register(this.removeGroupEvent, this.obj);
    },
    _registerCalls: function () {
        var self = this;
        this._evnt().registerCallback(this.groupChangedEvent, function (obj) {
            obj.groupContainer.empty();
            var c = 0;
            obj.groups.each(function (group) {
                new DD_admin_group({
                    data: group,
                    parent: obj.groupContainer,
                    index: c
                });
                c++;
            });

            if (this.sortable) {
                this.sortable.destroy();
            }
            this.sortable = new Sortable(obj.groupContainer.get(0), {
                handle: ".sortable",
                onEnd: function (evt) {
                    ;
                    self.updateGroupsOrder(evt.oldIndex, evt.newIndex);
                }
            });
        });
        this._evnt().registerCallback(this.groupSetEvent, function (obj, eventName, data) {
            obj.groups = data;
        });

        this._evnt().registerCallback(this.removeGroupEvent, function (obj, eventName, index) {
            var tmpGroups = obj.groups;
            tmpGroups.splice(index, 1);
            obj.groups = tmpGroups;
        });

        this._evnt().registerCallback(this.addGroupEvent, function (obj, eventName, data) {
            obj.groups[obj.groups.length] = data;
        });

        this._evnt().registerCallback(this.groupCancelEvent, function (obj, eventName, data) {
            obj.drawNoImagesSelected();
        });
    },

    updateGroupsOrder: function (group_index, new_index) {
        this.groups = this.getGroups();
        this.groups = this.sortArray(this.groups, new_index, group_index);
        this._evnt().doCall(this.groupSetEvent, this.groups);
        this._evnt().doCall(this.groupChangedEvent);
    },

    getGroups: function () {
        return this._evnt().getEventObject(this.groupSetEvent).groups;
    },

    cancelGroups: function () {
        this._evnt().doCall(this.groupSetEvent, []);
        this._evnt().doCall(this.groupCancelEvent);
    },
    updateGroups: function (groups) {
        this._evnt().doCall(this.groupSetEvent, groups);
        this._evnt().doCall(this.groupChangedEvent);
    },
    removeGroup: function (index) {
        this._evnt().doCall(this.removeGroupEvent, index);
        this._evnt().doCall(this.groupChangedEvent);
    },
    addGroup: function (data) {
        this._evnt().doCall(this.addGroupEvent, data);
        this._evnt().doCall(this.groupChangedEvent);
    },

    addImage: function (group_index, media_id, img) {
        var index = this.getImgIndex(group_index, media_id);
        if (index) {
            return;
        }
        this.groups = this.getGroups();
        var imgGroup = this.groups[parseInt(group_index)];
        var index = Object.keys(imgGroup).length ? Object.keys(imgGroup).length : 0;
        this.groups[parseInt(group_index)][index] = img;
        this._evnt().doCall(this.groupChangedEvent);
    },

    getImgIndex: function (group_index, media_id) {
        var imgGroup = this.groups[parseInt(group_index)];
        var index = false;
        $.each(imgGroup, function (i, image) {
            if (image.media_id == parseInt(media_id)) {
                index = i;
            }
        });

        return index;

    },

    removeImage: function (group_index, media_id) {
        this.groups = this.getGroups();
        var newGropImg = {};
        var indexRemov = this.getImgIndex(group_index, media_id);
        var imgGroup = this.groups[parseInt(group_index)];
        var c = 0;
        $.each(imgGroup, function (i, image) {
            if (indexRemov != i) {
                newGropImg[c] = image;
                c++;
            }
        });
        this.groups[parseInt(group_index)] = newGropImg;
        this.updateGroups(this.groups);
    },
    loadGroups: function () {
        var self = this;
        this._evnt().doCall('show-admin-loader');
        $.ajax({
            url: this.obj.options.urlImages
                    + '?form_key=' + window.FORM_KEY,
            data: {
                'product_sku': this.obj.options.psku
            },
            success: function (data) {
                self.obj.processGroups(data);
            },
            error: function () {
                alert("Something went wrong!");
            },
            complete: function () {
                self._evnt().doCall('hide-admin-loader');
            },
            cache: false
        }, 'json');
    },
    attachCustomizeButtonEvents: function (button, parent) {
        var self = this;
        button.on('click', function () {
            self.obj.p_noimages.remove();
            self.obj.panelCustomize.get().remove();
            self.obj.drawCustomizePanel();
        });
    },

    clearClickEvents: function (obj) {
        var self = this;
        obj.on('click', function () {
            self.updateGroups([]);
        });
    },

    addGroupClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            self.addGroup({});
        });
    },

    removeGroupClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            var remove = obj.attr('data-remove');
            self.removeGroup(remove);
        });
    },

    addGroupCancelClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            self.cancelGroups();
        });
    },

    addGroupSaveClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            console.log('save');
        });
    }

});
