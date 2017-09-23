var DD_Global = {};
var DD_object = Class.extend({
    
    idTranslateObject: 'dd_translate',
    idEventObject: 'dd_event',
    idLayersObject: 'dd_layer',
    idSettingsObject: 'dd_settings',
    idWindow: 'dd_window',
    
    init: function (id) {
        this.id = id ? id : this.createUUID();
    },
    
    setGlobal: function () {
        var uid = this.getGlobalUid();
        if(uid) {
            DD_Global[uid][this.id] = this;
        }
        DD_Global[this.id] = this;
    },
    getId: function () {
        return this.id;
    },
    getGlobal: function (id) {
        var uid = this.getGlobalUid();
        if(uid) {
            return DD_Global[uid][id];
        }
        return DD_Global[id];
    },
    
    getGlobalUid: function() {
        /////???????
    },
    
    createUUID: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },
    
    sortArray: function(_array, new_index, old_index) {
        var record = _array.splice(old_index, 1);
        _array.splice(new_index, 0, record[0]);
        return _array;
    },
    
    //translation
    _: function(key) {
        var translateObject = this.getGlobal(this.idTranslateObject); 
        if(translateObject) {
            return translateObject.get(key);
        }
        return key;
    },
    //events
    _evnt: function() {
        return this.getGlobal(this.idEventObject);
    },
    //layers
    _l: function() {
        return this.getGlobal(this.idLayersObject);
    },
    //settings
    _s: function(settingName) {
        var settingsObject = this.getGlobal(this.idSettingsObject);
        return settingsObject.settings[settingName];
    },
    //window
    _w: function(object) {
        if(object){
            this.getGlobal(this.idWindow);
        }
        return this.getGlobal(this.idWindow).modal;
    }
});
