var DD_ModelBase = DD_object.extend({

    init: function () {
        if (this.eventBase) {
            this._evnt().register(this.eventBase, this.obj, this.base);
        }
    },
    
    registerEvents: function() {
        if (this._registerEvents) {
            this._registerEvents();
        }
        if (this._registerCalls) {
            this._registerCalls();
        }
        if (this._onComplete) {
            this._onComplete();
        }
        this.callBackObject();
    },
    
    callBackObject: function() {
        if(!this.obj) {
            return;
        }
        if(this.obj._callBackModel) {
            this.obj._callBackModel.call(this.obj, this);
        }
    },

    clickEventName: function () {
        return this.eventClick;
    },

    setWindow: function (window) {
        this.window = window;
    },

    closeWindow: function () {
        if (this.window) {
            this.window.close();
        }
    }
});
