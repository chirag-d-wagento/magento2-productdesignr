var DD_ModelBase = DD_object.extend({
     
        init: function() {
         if(this.eventBase) {
             this._evnt().register(this.eventBase, this.obj, this.base);
         }
         if(this.registerEvents) {
            this.registerEvents();
         }
         if(this.registerCalls) {
            this.registerCalls();
         }
     },
     
     clickEventName: function() {
         return this.eventClick;
     },
     
     setWindow: function(window) {
         this.window = window;
     },
     
     closeWindow: function() {
         if(this.window) {
             this.window.close();
         }
     }
});
