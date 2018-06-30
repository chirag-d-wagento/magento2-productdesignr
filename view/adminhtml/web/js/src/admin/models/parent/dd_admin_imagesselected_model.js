var DD_Admin_ImagesSelected_Model = DD_ModelBase.extend({

    groupChangedEvent: 'image-group-changed',
    groupSetEvent: 'image-group-setdata',
    groupCancelEvent: 'image-group-cancel',
    addGroupEvent: 'image-group-add',
    removeGroupEvent: 'image-group-remove',
    updateExtraConfEvent: 'image-group-extra-conf',
    
    createDesignerEvent: 'designer-created',
    beforeCreateDesignerEvent: 'before-designer-created',
    
    designer: null,

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
        this._evnt().register(this.updateExtraConfEvent, this.obj);
        
        this._evnt().register(this.createDesignerEvent, this.obj);
        this._evnt().register(this.beforeCreateDesignerEvent, this.obj);
    },

    _registerCalls: function () {
        if (this._evnt().getEventCallBacks(this.groupChangedEvent)) {
            return;
        }
        var self = this;
        
        
        this._evnt().registerCallback(this.createDesignerEvent, function (obj, eventName, designer) {
            obj.designer = designer;
        });
        
        this._evnt().registerCallback(this.beforeCreateDesignerEvent, function (obj) {
            if(obj.designer) {
                obj.designer.destroy();
                obj.designer = null;
            }
        });
        
        this._evnt().registerCallback(this.updateExtraConfEvent, function (obj, eventName, data) {
            if(obj.options.onUpdate) {
                obj.options.onUpdate.call(obj, obj.groups);
            }
        });
        
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
            
            self._evnt().doCall(self.updateExtraConfEvent);
            
        });
        this._evnt().registerCallback(this.groupSetEvent, function (obj, eventName, data) {
            obj.groups = data;
            self._evnt().doCall(self.updateExtraConfEvent);
        });

        this._evnt().registerCallback(this.removeGroupEvent, function (obj, eventName, group_index) {
            var tmpGroups = obj.groups;
            var index = self.getGroupIndexByUid(group_index);
            tmpGroups.splice(index, 1);
            obj.groups = tmpGroups;
            self._evnt().doCall(self.updateExtraConfEvent);
        });

        this._evnt().registerCallback(this.addGroupEvent, function (obj, eventName, data) {
            obj.groups[obj.groups.length] = data;
        });

        this._evnt().registerCallback(this.groupCancelEvent, function (obj, eventName, data) {
            var button = obj.drawNoImagesSelected();
            self.attachCustomizeButtonEvents(button);
            self._evnt().doCall(self.updateExtraConfEvent);
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
        if(confValue !== null) {
            groups[group_index]['imgs'][index][confName] = confValue;
        }else{
            groups[group_index]['imgs'][index][confName] = null;
            delete groups[group_index]['imgs'][index][confName];
        }
        this._evnt().doCall(this.groupSetEvent, groups);
        return groups[group_index]['imgs'][index];
    },

    getObject: function () {
        return this._evnt().getEventObject(this.groupSetEvent);
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
        if (this.getObject().designerGroupId === index && this.getObject().designer) {
            this.getObject().designer.destroy();
            delete this.getObject().designer;
            delete this.getObject().media_id;
            delete this.getObject().designerGroupId;
        }
        this._evnt().doCall(this.removeGroupEvent, index);
        this._evnt().doCall(this.groupChangedEvent);
    },
    addGroup: function (data) {
        this._evnt().doCall(this.addGroupEvent, data);
        this._evnt().doCall(this.groupChangedEvent);
    },

    addImage: function (group_uid, media_id, img) {
        var group_index = this.getGroupIndexByUid(group_uid);
        var groups = this.getGroups();
        if (group_index === false) {
            this.addGroup({
                'product_id': img.product_id,
                'group_uid': group_uid,
                'imgs': [
                    img
                ]
            });
            return;
        }
        var index = this.getImgIndex(group_uid, media_id);
        if (index !== false) {
            return;
        }
        var imgGroup = groups[group_index].imgs;
        var newImgIndex = Object.keys(imgGroup).length ? Object.keys(imgGroup).length : 0;
        groups[parseInt(group_index)]['imgs'][newImgIndex] = img;
        this.updateGroups(groups);
    },

    updateImgFabricConf: function (group_uid, media_id, fabricObj, type) {
        if (fabricObj.mainBg) {
            return;
        }
        if (fabricObj.layerMask && type === 'remove') {
            this.removeMask(group_uid, media_id, fabricObj);
            return;
        }
        if (fabricObj.layerMask) {
            this.updateMask(group_uid, media_id, fabricObj);
        }
        if (type === 'remove') {
            this.removeLayer(group_uid, media_id, fabricObj);
            return;
        }
        console.log(fabricObj.type);
        console.log(fabricObj);
        if(fabricObj.type === 'image' || fabricObj.type === 'text' || fabricObj.isSvg) {
            this.updateLayer(group_uid, media_id, fabricObj)
            console.log('fabricObj.isSvg');
            console.log(fabricObj.isSvg);
        }
        
    },

    findLayerByUid: function (imgConf, fabricObj) {
        var _layer = null;
        var _index = null;
        $.each(imgConf, function (index, layer) {
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
        imgConf.splice(layer.index, 1);
        
        this.updateImageConf(group_uid, media_id, 'conf', imgConf);
    },
    
    updateExtraConf: function(group_uid, media_id, key, value) {
        var extraConf = this.getImgConf(group_uid, media_id, 'extra_config');
        extraConf[key] = value;
        this.updateImageConf(group_uid, media_id, 'extra_config', extraConf);
    },

    updateMask: function (group_uid, media_id, fabricObj) {
        this.updateImageConf(group_uid, media_id, 'mask', fabricObj);
    },

    removeMask: function (group_uid, media_id, fabricObj) {
        this.updateImageConf(group_uid, media_id, 'mask', null);
    },

    getImgConf: function (group_uid, media_id, indexConf) {
        var groups = this.getGroups();
        var index = this.getImgIndex(group_uid, media_id);
        var img = groups[this.getGroupIndexByUid(group_uid)]['imgs'][index];
        if(indexConf) {
            if(!img[indexConf] || img[indexConf] == '') {
                img[indexConf] = {};
            }
            
            return img[indexConf];
        }
        
        if (!img['conf']) {
            img['conf'] = [];
        }
        return img['conf'];
    },

    getImgIndex: function (group_uid, media_id) {
        if (!group_uid) {
            return false;
        }
        var groups = this.getGroups();
        if (!groups[this.getGroupIndexByUid(group_uid)]) {
            return false;
        }
        var imgGroup = groups[this.getGroupIndexByUid(group_uid)]['imgs'];
        var index = false;
        $.each(imgGroup, function (i, image) {
            if (parseInt(image.media_id) === parseInt(media_id)) {
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
        if (imgGroup.length == 0) {
            this.removeGroup(group_uid);
        } else {
            groups[parseInt(group_index)]['imgs'] = imgGroup;
        }

        if (this.getObject().designerMediaId === media_id
                && this.getObject().designerGroupId === group_uid) {
            this.getObject().designer.destroy();
            delete this.getObject().designer;
            delete this.getObject().media_id;
            delete this.getObject().designerGroupId;
        }

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
                    } else {
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
        var groups = this.getGroups();
        var index = false;
        $.each(groups, function (i, group) {
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
            if (self.getObject().designer) {
                self.getObject().designer.destroy();
                delete self.getObject().designer;
                delete self.getObject().media_id;
                delete self.getObject().designerGroupId;
            }
            self.updateGroups([]);
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
            if (self.getObject().designer) {
                self.getObject().designer.destroy();
                delete self.getObject().designer;
                delete self.getObject().media_id;
                delete self.getObject().designerGroupId;
            }
            self.cancelGroups();
        });
    }

});
