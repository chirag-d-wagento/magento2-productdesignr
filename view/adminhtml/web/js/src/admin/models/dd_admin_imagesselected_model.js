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
            obj.groups.each(function(group){
                new DD_admin_group({
                    data: group, 
                    parent:obj.groupContainer,
                    index: c
                });
                c++;
            });
        });
        this._evnt().registerCallback(this.groupSetEvent, function (obj, eventName, data) {
            obj.groups = data;
        });
        
        this._evnt().registerCallback(this.removeGroupEvent, function (obj, eventName, index) {
            console.log(index);
            var tmpGroups = obj.groups;
            tmpGroups.splice(index, 1);
            
            obj.groups = tmpGroups;
            
            console.log(obj.groups);
        });
        
        this._evnt().registerCallback(this.addGroupEvent, function (obj, eventName, data) {
            obj.groups.push(data);
            console.log(obj.groups);
        });
        
        this._evnt().registerCallback(this.groupCancelEvent, function (obj, eventName, data) {
            obj.drawNoImagesSelected();
        });
    },
    cancelGroups: function() {
        this._evnt().doCall(this.groupSetEvent, []);
        this._evnt().doCall(this.groupCancelEvent);
    },
    updateGroups: function (groups) {
        this._evnt().doCall(this.groupSetEvent, groups);
        this._evnt().doCall(this.groupChangedEvent);
    },
    removeGroup: function(index) {
        this._evnt().doCall(this.removeGroupEvent, index);
        this._evnt().doCall(this.groupChangedEvent);
    },
    addGroup: function (data) {
        this._evnt().doCall(this.addGroupEvent, data);
        this._evnt().doCall(this.groupChangedEvent);
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
    
    addGroupClick: function(obj) {
        var self = this;
        obj.on('click', function () {
            self.addGroup({'unique_id': self.createUUID() });
        });
    },
    
    removeGroupClick: function(obj) {
        var self = this;
        obj.on('click', function () {
            var remove = obj.attr('data-remove');
            self.removeGroup(remove);
        });
    },
    
    addGroupCancelClick: function(obj) {
        var self = this;
        obj.on('click', function () {
            self.cancelGroups();
        });
    },
    
    addGroupSaveClick: function(obj) {
        var self = this;
        obj.on('click', function () {
            console.log('save');
        });
    },
    
    selectImgClick: function(obj) {
        var self = this;
        obj.on('click', function () {
            alert('select img');
        });
        
    }

});
