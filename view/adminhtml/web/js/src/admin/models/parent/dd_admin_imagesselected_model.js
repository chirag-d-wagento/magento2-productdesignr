var DD_Admin_ImagesSelected_Model = DD_ModelBase.extend({

    groupChangedEvent: 'image-group-changed',
    groupSetEvent: 'image-group-setdata',
    groupCancelEvent: 'image-group-cancel',
    addGroupEvent: 'image-group-add',
    removeGroupEvent: 'image-group-remove',

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    _registerEvents: function () {
        if (this._evnt().getEventObject(this.groupChangedEvent)) {
            return;
        }
        this._evnt().register(this.groupChangedEvent, this.obj);
        this._evnt().register(this.groupSetEvent, this.obj);
        this._evnt().register(this.addGroupEvent, this.obj);
        this._evnt().register(this.groupCancelEvent, this.obj);
        this._evnt().register(this.removeGroupEvent, this.obj);
    },

    _registerCalls: function () {
        if (this._evnt().getEventCallBacks(this.groupChangedEvent)) {
            return;
        }
        var self = this;
        this._evnt().registerCallback(this.groupChangedEvent, function (obj) {
            if (!obj.groupContainer) {
                return;
            }
            obj.groupContainer.empty();

            var c = 0;
            obj.groups.each(function (group) {
                new DD_admin_group({
                    data: group,
                    parent: obj.groupContainer,
                    index: group.group_uid
                });
                c++;
            });

            if (this.sortable) {
                this.sortable.destroy();
            }
            this.sortable = new Sortable(obj.groupContainer.get(0), {
                handle: ".sortable",
                onEnd: function (evt) {
                    self.updateGroupsOrder(evt.oldIndex, evt.newIndex);
                }
            });
        });
        this._evnt().registerCallback(this.groupSetEvent, function (obj, eventName, data) {
            obj.groups = data;
            console.log('obj.groups SET EVENT: ');
            console.log(obj.groups);
        });

        this._evnt().registerCallback(this.removeGroupEvent, function (obj, eventName, group_index) {
            var tmpGroups = obj.groups;
            var index = self.getGroupIndexByUid(group_index);
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

    _onComplete: function () {
        if (this.obj._onComplete) {
            this.loadGroups();
        }
    },

    updateGroupsOrder: function (group_index, new_index) {
        var groups = this.getGroups();
        var groups = this.sortArray(groups, new_index, group_index);
        this._evnt().doCall(this.groupSetEvent, groups);
    },

    updateImageConf: function (group_uid, media_id, confName, confValue) {
        var group_index = this.getGroupIndexByUid(group_uid);
        var index = this.getImgIndex(group_uid, media_id);
        var groups = this.getGroups();
        groups[group_index]['imgs'][index][confName] = confValue;
        this._evnt().doCall(this.groupSetEvent, groups);
        return groups[group_index]['imgs'][index];
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

    addImage: function (group_uid, media_id, img) {
        var group_index = this.getGroupIndexByUid(group_uid);
        var index = this.getImgIndex(group_uid, media_id);
        if (index !== false) {
            return;
        }
        var groups = this.getGroups();
        var imgGroup = groups[group_index].imgs;
        var newImgIndex = Object.keys(imgGroup).length ? Object.keys(imgGroup).length : 0;
        this.groups[parseInt(group_index)]['imgs'][newImgIndex] = img;
        this._evnt().doCall(this.groupChangedEvent);
    },

    updateImgFabricConf: function (group_uid, media_id, fabricObj, type) {
        if (fabricObj.mainBg) {
            return;
        }
        if (fabricObj.layerMask && type == 'remove') {
            this.removeMask(group_uid, media_id, fabricObj);
        }
        if (fabricObj.layerMask) {
            this.updateMask(group_uid, media_id, fabricObj);
        }
        if (type == 'remove') {
            this.removeLayer(group_uid, media_id, fabricObj);
        }
        this.updateLayer(group_uid, media_id, fabricObj);
    },

    findLayerByUid: function (imgConf, fabricObj) {
        var _layer = null;
        var _index = null;
        $.each(imgConf, function (index, layer) {
            console.log('layer.uid == fabricObj.uid ' + layer.uid + '==' +  fabricObj.uid);
            if (layer.uid == fabricObj.uid) {
                _layer = layer;
                _index = index;
                return true;
            }
        });
        return {
            'layer': _layer,
            'index': _index
        };
    },

    updateLayer: function (group_uid, media_id, fabricObj) {
        var imgConf = this.getImgConf(group_uid, media_id);
        var layer = this.findLayerByUid(imgConf, fabricObj);
        if (!layer.layer) {
            imgConf.push(fabricObj);
        } else {
            imgConf[layer.index] = fabricObj;
        }
        this.updateImageConf(group_uid, media_id, 'conf', imgConf);
    },

    removeLayer: function (group_uid, media_id, fabricObj) {
        var imgConf = this.getImgConf(group_uid, media_id);
        var layer = this.findLayerByUid(imgConf, fabricObj);
        imgConf.splice(layer._index, 1, imgConf);
        this.updateImageConf(group_uid, media_id, 'conf', imgConf);
    },

    updateMask: function (group_uid, media_id, fabricObj) {
        this.updateImageConf(group_uid, media_id, 'mask', fabricObj);
    },

    removeMask: function (group_uid, media_id, fabricObj) {
        this.updateImageConf(group_uid, media_id, 'mask', null);
    },

    getImgConf: function (group_uid, media_id) {
        var groups = this.getGroups();
        var index = this.getImgIndex(group_uid, media_id);
        var img = groups[this.getGroupIndexByUid(group_uid)]['imgs'][index];
        if (!img['conf']) {
            img['conf'] = [];
        }
        return img['conf'];
    },

    getImgIndex: function (group_uid, media_id) {
        var groups = this.getGroups();
        var imgGroup = groups[this.getGroupIndexByUid(group_uid)]['imgs'];
        var index = false;
        $.each(imgGroup, function (i, image) {
            if (image.media_id == parseInt(media_id)) {
                index = i;
            }
        });
        return index;
    },

    removeImage: function (group_uid, media_id) {
        var groups = this.getGroups();
        var group_index = this.getGroupIndexByUid(group_uid);
        var indexRemov = this.getImgIndex(group_index, media_id);
        var imgGroup = groups[group_index]['imgs'];
        imgGroup.splice(indexRemov, 1);
        groups[parseInt(group_index)]['imgs'] = imgGroup;
        this.updateGroups(groups);
    },
    loadGroups: function () {

        if (this.getGroups()) {
            return;
        }
        var self = this;
        this._evnt().doCall('show-admin-loader');
        $.ajax({
            url: this.obj.options.urlImages
                    + '?form_key=' + window.FORM_KEY,
            data: {
                'product_id': self._s('product_id')
            },
            success: function (data) {
                if (data.error) {
                    alert(data.errorMessage);
                } else {
                    if (data.data.length == 0) {
                        self.updateGroups(data.data);
                        var button = self.obj.drawNoImagesSelected();
                        self.attachCustomizeButtonEvents(button);
                        return;
                    }else{
                        self.obj.drawCustomizePanel();
                        self.updateGroups(data.data);
                    }
                    //process groups!
                }
            },
            error: function () {
                alert("Something went while loading groups wrong!");
            },
            complete: function () {
                self._evnt().doCall('hide-admin-loader');
            },
            cache: false
        }, 'json');
    },

    getGroupIndexByUid: function (group_uid) {
        this.groups = this.getGroups();
        var index = 0;
        $.each(this.groups, function (i, group) {
            if (group_uid == group.group_uid) {
                index = i;
            }
        });
        return index;
    },

    attachCustomizeButtonEvents: function (button) {
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

    addEmptyGroupClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            self.addGroup({'group_uid': self.createUUID(), 'imgs': []});
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
            var groups = self.getGroups();
            var jsonStr = JSON.stringify(groups);
            
            console.log(jsonStr);
            self._evnt().doCall('show-admin-loader');
            $.ajax({
                url: self._s('urlSaveData')
                        + '?form_key=' + window.FORM_KEY,
                data: {
                    'data': jsonStr,
                    'product_id': self._s('product_id')
                },
                success: function (data) {
                    console.log(data);
                },
                error: function () {
                    alert("Something went wrong!");
                },
                complete: function () {
                    self._evnt().doCall('hide-admin-loader');
                },
                cache: false
            }, 'json');

        });
    }

});
