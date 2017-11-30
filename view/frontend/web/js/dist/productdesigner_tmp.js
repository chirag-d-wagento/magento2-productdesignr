(function($){"use strict"; var DD_Global = {};
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
        DD_Global[this.id] = this;
    },
    getId: function () {
        return this.id;
    },
    getGlobal: function (id) {
        return DD_Global[id];
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

var DD_Event = DD_object.extend({
    id: 'dd_event',
    listEvents: {},
    listEventsBase: {}, //delete all callbacks after run
    listEventsCallbacks: {},
    jBoxes: [],
    
    init: function() {
        this._super(this.id);
        this.setGlobal();
    },
    
    register: function(eventName, obj, base) {
        if(this.listEvents[eventName]) {
            console.log('ERROR: event already exists('+eventName+'); Should be unique!');
            return;
        }
        if(!obj) {
            return;
        }
        this.listEvents[eventName] = obj;
        if(base) {
            this.listEventsBase[eventName] = obj; 
        }
    },
    
    unregister: function(eventName) {
        delete this.listEvents[eventName];
        delete this.listEventsBase[eventName];
        delete this.listEventsCallbacks[eventName];
    },
    
    registerCallback: function(eventName, func, id) {
        id = id ? id : this.createUUID();
        if(!this.listEventsCallbacks[eventName]) {
            this.listEventsCallbacks[eventName] = {};
        }
        if(this.listEventsCallbacks[eventName][id]) {
            return;
        }
        this.listEventsCallbacks[eventName][id] = func;
    },
    
    doCall: function(eventName, data) {
        var self = this;
        console.log('should doCall: ' + eventName);
        
        if(!this.listEvents[eventName] || !this.listEventsCallbacks[eventName]) {
            return;
        }
        console.log( this.listEventsCallbacks[eventName] );
        $.each(this.listEventsCallbacks[eventName], function (i, eventCall) {
            eventCall.call(self, self.listEvents[eventName], eventName, data);
            console.log('doCall real: ' + i + ' - ' + eventName);
        });
        if(this.listEventsBase[eventName]) {
            console.log('doCall real DELETE: ' +  ' - ' + eventName);
            delete this.listEventsCallbacks[eventName];
        }
    },
    
    getListEvents: function() {
        return this.listEvents;
    },
    
    getListEventCallback: function() {
        return $.extend(this.listEventsBase, this.listEvents);
    },
    
    isBase: function(eventName) {
        return this.listEventsBase[eventName];
    },
    
    getEventObject: function(eventName) {
        return this.listEvents[eventName];
    },
    
    getEventCallBacks: function(eventName) {
        return this.listEventsCallbacks[eventName];
    },
    
    unregisterAll: function() {
        var self = this;
        $.each(this.listEvents, function(eventName, obj) {
            self.unregister(eventName);
        });
    },
    addJBox: function(box) {
        this.jBoxes.push(box);
    },
    
    destroyJBoxes: function() {
        $.each(this.jBoxes, function(i, obj) {
            obj.destroy();
        });
    }
});

var DD_Translator = DD_object.extend({

    id: 'dd_translate',
    translateObject: {},
    init: function(translate) {
        this._super(this.id);
        this.setGlobal();
        this.setTranslation(translate);
    },
    setTranslation: function(translate) {
        this.translateObject = translate ? translate : {};
    },
    get: function(key) {
        if(typeof(this.translateObject[key]) !== 'undefined') {
            return this.translateObject[key];
        }
        return key;
    }
});

var DD_Settings = DD_object.extend({
    id: 'dd_settings',
    jBoxes: [],
    init: function(settings) {
        this._super(this.id);
        this.settings = settings;
        this.setGlobal();
    }
})

var DD_Window = DD_object.extend({
    CONST_WIN_WIDTH: 300,
    CONST_WIN_CONTENT_EL: 'modalContent',
    CONST_WIN_PREVIEW_EL: 'previewContent',

    id: 'dd_window',
    init: function () {
        if (this.getGlobal(this.id)) {
            return;
        }
        this._super(this.id);
        this.createContentElement(this.CONST_WIN_CONTENT_EL);
        this.createContentElement(this.CONST_WIN_PREVIEW_EL);
        this.registerModal();
        this.registerPreview();
        this.setGlobal();
        
        return this.modal;
    },
    
    registerPreview: function() {
        var self = this;
        
        this.preview = new jBox('Modal', {
            title: '-',
            draggable: false,
            overlay: false,
            close: true,
            content: $('#' + this.CONST_WIN_PREVIEW_EL),
            width: $(window).width(),
            fixed: false,
            height: $(window).width(),
            repositionOnOpen: false,
            repositionOnContent: true,
            fixed: true,
            onOpen: function () {
                self._evnt().doCall('preview-showed');
            },
            onClose: function () {
                self._evnt().doCall('preview-closed');
            }
        });


        this._evnt().register('preview-showed', this.modal);
        this._evnt().register('preview-closed', this.modal, true);
    },
    
    registerModal: function() {
        var self = this;
        
        this.modal = new jBox('Modal', {
            title: '-',
            draggable: 'title',
            overlay: false,
            close: true,
            content: $('#' + this.CONST_WIN_CONTENT_EL),
            width: this.getWinWidth(),
            fixed: false,
            maxHeight: 500,
            repositionOnOpen: false,
            repositionOnContent: true,
            target: $('.canvas-container'),
            
            onOpen: function () {
                self._evnt().doCall('window-showed');
            },
            onClose: function () {
                self._evnt().doCall('window-closed');
            }
        });


        this._evnt().register('window-showed', this.modal);
        this._evnt().register('window-closed', this.modal, true);
        this.registerCloseWinEventCall();
    },

    getWindow: function () {
        return this.getGlobal(this.id).modal;
    },

    getPreview: function () {
        return this.getGlobal(this.id).preview;
    },

    getContentElement: function () {
        return this.getGlobal(this.id).contentElement[this.CONST_WIN_CONTENT_EL];
    },

    getContentElementPreview: function () {
        return this.getGlobal(this.id).contentElement[this.CONST_WIN_PREVIEW_EL];
    },

    getWinWidth: function () {
        return this.CONST_WIN_WIDTH;
    },

    createContentElement: function (id) {
        if(!this.contentElement) {
            this.contentElement = {};
        }
        if($('#' + id).get(0)) {
            this.contentElement[id] = $('#' + id);
            return;
        }
        this.contentElement[id] = $('<div />').attr({
            'id': id
        }).css({
            'display': 'none'
        }).html('<p>&nbsp;</p>');

        $('body').append(this.contentElement[id]);
    },
    
    registerCloseWinEventCall: function() {
        this._evnt().registerCallback('window-closed', function(window) {
            window.isClosed = true;
        }, 'no-reposition');
    }
});


var DD_Uibase = DD_object.extend({
    options: {},

    init: function (id) {
        this._super(id);
    },

    getParent: function () {
        return $(this.options.parent);
    },

    get: function () {
        return this.self;
    },

    selfBase: function (tag) {
        tag = tag ? tag : '<div/>';
        this.self = $(tag, {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
        });
    },

    _add: function () {
        this._onBeforeCreate();
        $(this.options.parent).append(this.self);
        if (this._addElements) {
            this._addElements();
        }
        var model = this._onAfterCreate();
        if (model) {
            model.registerEvents();
            return model;
        }
    },

    _onBeforeCreate: function () {
        this.windowInit();
    },

    _onAfterCreate: function () {
        var model = null;
        if (this.model) {
            eval("try {model = new " + this.model + "(this); }catch(err) {console.log('ERROR FOR MODEL: " + this.model + "; ERRTXT: ' + err + '; err.lineNumber: ' + err.lineNumber)}");
        }
        if (this.options.windowOpener && model) {
            this.addWindowOpenEvent(this, model, this.modal, this.options);
        }
        if (this.options.tooltip && this.options.tooltip_text && !Modernizr.touchevents) {
            this.addTooltip();
        }
        if (model) {
            return model;
        }
    },

    addTooltip: function () {
        var position = this.options.tooltip_position ?
                this.options.tooltip_position : {
                    x: 'right',
                    y: 'center'
                };

        var outside = this.options.tooltip_outside ?
                this.options.tooltip_outside : 'x';

        this.tooltipBox = $(this.self).jBox('Tooltip', {
            content: this.options.tooltip_text,
            position: position,
            outside: outside
        });
        
        this._evnt().addJBox(this.tooltipBox);

    },

    addWindowOpenEvent: function (me, model, modal, options) {
        var obj = me.get();
        $(obj).on('click', function () {
            if (!options.windowPreview) {
                var window = modal.getWindow();
                var contentElement = modal.getContentElement();
            } else {
                var window = modal.getPreview();
                var contentElement = modal.getContentElementPreview();
            }

            contentElement.empty();
            model.setWindowContent(contentElement);
            model.setWindow(window);

            window.setTitle(model.getWindowTitle())
            window.open({});

            if (!window.isClosed && !options.windowPreview) {
                window.position({target: $('.canvas-container')});
            }
        });
    },

    windowInit: function () {
        if (!this.winInit) {
            this.modal = new DD_Window();
            this.winInit = true;
        }
    }

});

var DD_Debug = DD_object.extend({
    init: function (obj) {
        this.obj = obj;
        this.addDebug();
        this.addControls();
        this.addConsole();
        this.attachEvents();
    },
    attachEvents: function () {
        var self = this;
        this.listEventsBtn.on('click', function () {
            var events = self._evnt().getListEvents();
            self.consoleInner.html('');
            self.title.html('All registrated Events');
            var eventsHtml = '';
            $.each(events, function (index, event) {
                if (event.get) {
                    var el = event.get();
                    eventsHtml += '<a href="javascript:void(0)" class="debugger-event" style="color:#fff;">' + index + '</a>'
                            + ' <a href="javascript:void(0)" class="debugger-event-element">(#' + el.attr('id') + ' .' + el.get(0).className + ')</a>'
                            + (self._evnt().isBase(index) ? ' - BASE ' : '') + '<br>';
                } else {
                    eventsHtml += '<a href="javascript:void(0)" class="debugger-event" style="color:#fff;">' + index
                            + (self._evnt().isBase(index) ? ' - BASE ' : '') + '</a><br>';
                }
            });
            self.consoleInner.html(eventsHtml);
        });
        if (typeof (this._l()) != 'undefined') {

            this.listLayers.on('click', function () {
                var layers = self._l().layers;
                self.consoleInner.html('');
                self.title.html('All added Layers');
                var layersHtml = '';
                $.each(layers, function (index, layer) {
                    layersHtml += '<a href="javascript:void(0)" class="debugger-layer" style="color:#fff;">' + index + '. '
                            + layer.type + '<br>' +
                            JSON.stringify(layer.data) +
                            '</a>'
                            + '<br><br>';
                });
                self.consoleInner.html(layersHtml);
            });
        }
    },
    addDebug: function () {
        console.log('Debug started!');
        this.parentDiv = $('<div/>', {
            id: 'dd-debugger',
            class: 'debugger-container',
            style: 'border:1px solid silver; min-height:500px;margin:20px;'
        });
        this.obj.after(this.parentDiv);
    },
    addControls: function () {
        this.controlsContainer = $('<div/>', {
            id: 'dd-debugger-controls',
            class: 'debugger-controls',
            style: 'margin:20px;'
        });
        this.parentDiv.append(this.controlsContainer);
        this.listEventsBtn = $('<button/>', {
            id: 'dd-debugger-controls-list-btn',
            class: 'debugger-controls button',
            text: 'List Events'
        });
        this.controlsContainer.append(this.listEventsBtn);
        if (typeof (this._l()) != 'undefined') {
            this.listLayers = $('<button/>', {
                id: 'dd-debugger-controls-list-btn',
                class: 'debugger-controls button',
                text: 'List Layers'
            });
            this.controlsContainer.append(this.listLayers);
        }
    },
    addConsole: function () {
        this.console = $('<div/>', {
            id: 'dd-debugger-console',
            class: 'debugger-console',
            style: 'border:1px solid silver; height:500px;margin:20px; overflow:auto; background: #300a24; color:#fff;padding:7px; '
        });
        this.parentDiv.append(this.console);
        this.title = $('<h3/>', {
            style: 'color:#0a9890; text-transform:uppercase; text-align:center; padding:10px 0'
        });
        this.console.append(this.title);
        this.consoleInner = $('<div/>', {
            id: 'dd-debugger-console-inner',
        });
        this.console.append(this.consoleInner);
    }
});

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

/*
var DD_History = DD_object.extend({
  
});
*/

var DD_Layer = DD_object.extend({
    layers: [],
    id: 'dd_layer',
    canvas: null,
    last: 0,
    
    TYPE_IMG: 'img',
    TYPE_TXT: 'txt',
    
    init: function() {
        this._super(this.id);
        this.setGlobal();
    },
    
    setHeight: function(height) {
        this.height = height;
    },
    
    getHeight: function(height) {
        return this.height;
    },
    
    setWidth: function(width) {
        this.width = width;
    },
    
    getWidth: function(width) {
        return this.width;
    },
    
    getBgCanvas: function() {
        return this.bgCanvas;
    },
    
    getHoverCanvas: function() {
        return this.hoverCanvas;
    },
    
    setBgCanvas: function(canvas) {
        this.bgCanvas = canvas;
    },
    
    setHoverCanvas: function(canvas) {
        this.hoverCanvas = canvas;
    },
    
    getLast: function() {
        return this.layers.length;
    },
    
    setMask: function(mask){
        if(mask === null) {
            delete this.layerMask;
            return;
        }
        this.layerMask = mask;
    },
    
    getMask: function() {
        return this.layerMask;
    }
    
});

var DD_button = DD_Uibase.extend({
    mainClass: 'button',
    init: function (options) {
        this.options = $.extend(( options ? options : {} ) , this.options);
        if(this.options.model) {
           this.model = this.options.model; 
        }
        this._super(this.options.id);
        this.self = $('<button />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            text: (this.options.text && !this.options.fa && !this.options.fa_addon  ? this.options.text : '')
        });
        this.add();
        if(this.options.fa_addon){
            var fa = $('<span />', {
                class: this.options.fa_addon + ' extra-fa fa-lg'
            });
            this.self.append(fa);
            if(this.options.text) {
                this.self.append(this.options.text);
            }
        }
    },
    
    add: function() {
        this._add();
    }
});



var DD_checkbox = DD_Uibase.extend({
    mainClass: 'dd-checkbox-container',
    labelClass: 'dd-label',
    init: function (options) {
        this.options = $.extend((options ? options : {}), this.options);
        if (this.options.model) {
            this.model = this.options.model;
        }
        this._super();
        this.selfBase();
        this._add();
    },

    _addElements: function () {
        this._checkbox = $('<input />', {
            id: this.options.id ? this.options.id : this.createUUID(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            type: 'checkbox'
        });
        if (this.options.checked) {
            this._checkbox.attr({
                'checked': true
            }).prop('checked');
        }
        this.self.append(this._checkbox);

        if (this.options.text) {
            this.self.append($('<label />')
                    .addClass(this.labelClass)
                    .attr({'for': this._checkbox.attr('id')})
                    .text(this.options.text));
        }
    },

    _callBackModel: function (model) {
        if (!model || !model.checkedAction || !model.uncheckedAction) {
            return;
        }
        var self = this;
        this._checkbox.on('click', function () {
            if ($(this).is(':checked')) {
                model.checkedAction.call(model, this, self.options.view);
            } else {
                model.uncheckedAction.call(model, this, self.options.view);
            }
        });
        setTimeout(function () {
            if (self.checked) {
                model.checkedAction.call(model, self._checkbox, self.options.view);
                return;
            }
            model.uncheckedAction.call(model, self._checkbox, self.options.view);
        }, 10);
    }
});

var DD_control = DD_Uibase.extend({
    mainClass: 'dd-helper-popup',
    contentAdded: false,
    init: function (options) {
        this.options = $.extend((options ? options : {}), this.options);
        if (!this.options.fabricObject) {
            return;
        }
        if (!this.options.fabricObject.controlModel) {
            return;
        }
        this.model = this.options.fabricObject.controlModel;
        this._super(this.options.id);
        this.self = $('<div />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : '')
        });
        this._add();
    },

    _addElements: function () {
        this.addButtonPanel();
        this.addContentControls();
    },

    _callBackModel: function (model) {
        model._initBase();
        model.hideContentEvent();
    },

    addContentControls: function () {
        this.contentContainer = new DD_panel({
            'parent': this.self,
            'class': 'dd-helper-popup-content-container clearfix'
        });
        this.contentContainer._add();
        this.content = new DD_panel({
            'parent': this.contentContainer.get(),
            'class': 'dd-helper-popup-content'
        });
        this.content._add();
        this._closeContent = new DD_button({
            'parent': this.contentContainer.get(),
            //'text': this._('delete'),
            'class': 'fa fa-angle-double-up dd-helper-popup-content-close'
        });
    },
    
    addPaintBase: function() {
        this._paint = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('delete'),
            'class': 'fa fa-paint-brush'
        });

        return this._paint;
    },

    addButtonPanel: function () {
        this.buttons = new DD_panel({
            'parent': this.self,
            'class': 'dd-helper-popup-buttons clearfix'
        });
        this.buttons._add();
    },

    addDeleteBase: function () {
        this._delete = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('delete'),
            'class': 'fa fa-trash'
        });

        return this._delete;
    },

    addRotateBase: function () {
        this._rotate = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('delete'),
            'class': 'fa fa-refresh'
        });

        return this._rotate;
    },

    addSaveBase: function () {
        this._save = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-floppy-o'
        });

        return this._save;
    },

    addSizeBase: function () {
        this._size = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-arrows fa-rotate-45'
        });

        return this._size;
    },

    addEditBase: function () {
        this._edit = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-edit'
        });
        return this._edit;
    },

    addControlBase: function (attrs) {
        this.control = $('<input>').attr({'type': 'range'}).addClass('dd-helper-range');
        if (attrs) {
            this.control.attr(attrs);
        }
        this.content.get().append(this.control);
    },

    fontSelector: function (parent, selectedFont, onUpdate, model) {
        var fontSelectorContainer = new DD_panel({
            'parent': parent,
            'class': 'dd-helper-font-selector-container'
        });
        
        fontSelectorContainer._add();
        
        //fontSelect
        var uid = this.createUUID();

        var fontSelect = $('<div />').attr({
                    'id': uid,
                }).addClass('fontSelect').html('<div class="arrow-down"></div>');
                
        fontSelectorContainer.get()
                .append(fontSelect);

        $(fontSelect).fontSelector({
            'hide_fallbacks': true,
            'initial': selectedFont,
            'selected': function (style) {
                if(onUpdate) {
                    onUpdate.call(this, style, model);
                }
            },
            'fonts': this._s('listFonts')
        });
    },

    colorSelector: function (parent, name, color, onUpdate, model) {
        var colorSelectorContainer = new DD_panel({
            'parent': parent,
            'class': 'dd-helper-color-selector-container'
        });

        colorSelectorContainer._add();

        var uid = this.createUUID();

        colorSelectorContainer.get()
                .append($('<input />').attr({
                    'id': uid,
                    'type': 'text'
                }));

        $("#" + uid).spectrum({
            allowEmpty: true,
            color: color,
            change: function(color) {
                if(onUpdate) {
                    onUpdate.call(this, color, model);
                }
            }
        });
        colorSelectorContainer.get()
                .append($('<span />').text(name)
                        .addClass('dd-helper-color-selector-title'));
    }

});

var DD_ImageLinkAdd = DD_Uibase.extend({
    
    mainClass: 'dd-image-link',
    defaultImageClass: 'size-medium',
    model: 'DD_ImageLink_Model',
    
    init: function(options) {
        this.options = options;
        this._super(this.options.id);
        this.self = $('<a />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : this.defaultImageClass),
            href: 'javascript:void(0)',
            "data-src": options.src,
            "data-width": options.width,
            "data-height": options.height
        });
        this._add();
    },
    
    _addElements: function() {
        this.image = $('<img />', {
            src: this.options.src
        });
        this.self.append( this.image );
    },
    
    _callBackModel: function (model) {
        model.setClickEvents();
    }
    
});

var DD_panel = DD_Uibase.extend({
    mainClass: 'panel',
    init: function (options) {
        this.options = $.extend(( options ? options : {} ) , this.options);
        if(!this.parent ) {
            this.parent = this.options.parent;
        }
        this._super(this.options.id);
        this.selfBase();
    },
    
    add: function() {
        return this._add();
    }
});

var DD_Tabs = DD_Uibase.extend({
    mainClass: 'tabs-container',
    classTabs: 'tabs',
    classTabsContentContainer: 'tab-content-container',
    classTabsContent: 'tab-content',
    classTabCurrent: 'current',

    tabs: {},
    tabsContent: {},

    init: function (options) {
        this.options = options;
        this._super(this.options.id);
        this.selfBase();
        this._add();
    },
    
    _addElements: function() {
        this.addTabs();
    },
    
    _callBackModel: function (model) {
        var self = this;
        this.setEvents(model);
        if (this.current && model.tabActive) {
            setTimeout(function () {
                model.tabActive(self.current.attr('id'), self.currentContent);
            }, 100);
        }
    },

    addTabs: function () {
        var self = this;
        this.createTabPanel();
        this.createTabContent();
        $.each(this.options.tabs, function (a, tab) {
            self.tabsContent[tab.id] = $('<div />')
                    .attr('id', 'content-' + tab.id)
                    .addClass(self.classTabsContent);
            
            self.tabs[tab.id] = $('<li />')
                    .attr('id', tab.id)
                    .text(tab.text)
                    .attr('data-index', tab.id);
            if (a == 0 && !self.options.activeTab) {
                self.tabs[tab.id].addClass('current');
                self.tabsContent[tab.id].addClass('current');
                self.current = self.tabs[tab.id];
                self.currentContent = self.tabsContent[tab.id];
            }
            self.tabPanel.append(self.tabs[tab.id]);
            self.tabContent.append(self.tabsContent[tab.id]);
            
        });
        
    },

    createTabPanel: function () {
        this.tabPanel = $('<ul />')
                .addClass(this.classTabs);
        this.self.append(this.tabPanel);
    },

    createTabContent: function () {
        this.tabContent = $('<div />')
                .addClass(this.classTabsContentContainer);
        this.self.append(this.tabContent);
    },

    setEvents: function (model) {
        var self = this;
        this.tabPanel.find('li').on('click', function () {
            var id = $(this).attr('id');
            self.tabPanel.find('.current')
                    .removeClass('current');
            self.tabContent.find('.current')
                    .removeClass('current');
            var index = parseInt($(this).attr('data-index'));
            self.tabsContent[id]
                    .addClass('current');
            $(this).addClass('current');
            
            if (model.tabActive) {
                model.tabActive(id, self.tabsContent[id]);
            }

        });
    }
});

var DD_AddFromLibrary_Model = DD_ModelBase.extend({

    currentCategory: null,

    getWindowTitle: function () {
        return this._('add_from_library');
    },

    setWindowContent: function (parent) {
        this.loadLibrary(parent);
    },

    addOnCategoryEvent: function (categoryLink, parent, name) {
        var self = this;
        categoryLink.on('click', function () {
            self.currentCategory = name;
            self.loadLibrary(parent);
        });
    },

    addClearLink: function (parent, name) {
        var fa = $('<span />').addClass('fa fa-window-close');
        var link = $('<a />').addClass('dd-clear-category')
                .append(fa)
                .append(name)
        parent.append(link);
        this.addClearLinkEvent(link, parent);
    },

    addClearLinkEvent: function (link, parent) {
        var self = this;
        link.on('click', function () {
            self.currentCategory = null;
            self.loadLibrary(parent);
        });
    },

    loadLibrary: function (parent) {
        var self = this;
        parent.empty();
        parent.addClass('dd-window-loading');
        parent.html(this._('loading') + '...');

        $.ajax({
            url: this._s('libraryPath'),
            type: 'json',
            method: 'post',
            data: {
                'category': self.currentCategory
            }
        })
                .done(function (response) {
                    parent.removeClass('dd-window-loading');
                    parent.empty();
                    if (response.error) {
                        alert(response.errMessage);
                        return;
                    }
                    if (self.currentCategory) {
                        self.addClearLink(parent, self.currentCategory);
                    }
                    $.each(response.data, function (i, element) {
                        if (element.directory) {
                            new DD_Category({
                                'parent': parent,
                                'data': element,
                                'model': self
                            });
                        }
                        if (element.file) {
                            new DD_ImageLinkAdd({
                                'parent': parent,
                                'src': element.src,
                                'width': element.width,
                                'height': element.height,
                                'class': 'size-small'
                            });
                        }
                    });

                });


    }
});

var DD_AddPhoto_Model = DD_ModelBase.extend({
    idUploaderTab: 'dd-add-photo-tab',
    idMyPhotosTab: 'dd-my-photo-tab',
    uploaderInitiated: false,

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('add_photo_to_image');
    },

    setWindowContent: function (parent) {
        new DD_windowPhotoTabs(parent);
    },

    tabActive: function (id, content) {
        if (id === this.idMyPhotosTab) {
            this.initMyPhotos(content);
        } else if (id === this.idUploaderTab) {
            this.initUploader(content);
        }
    },

    initUploader: function (content) {
        if (this.uploaderInitiated) {
            return;
        }
        this.content = content;
        var self = this;
        content.html('<form class="dropzone">' +                
        '</form>');
        content.find('form').dropzone({
            url: self._s('urlUploadImages') /* + '?form_key=' + window.FORM_KEY */,
            maxFilesize: 2, // MB
            acceptedFiles: '.png, .jpeg, .jpg, .gif',
            init: function () {
                this.on("addedfile", function (file) {
                    if (self.previousFile) {
                        self.previousFile.fadeOut();
                        delete self.previousFile;
                    }
                });
                this.on("success", function (file, responseText) {
                    self.previousFile = $(file.previewElement);
                    var obj = responseText;
                    if (!obj) {
                        return processUploaderError(file, responseText);
                    }
                    if (obj.error) {
                        return processUploaderError(file, responseText, obj.errMessage);
                        return;
                    }
                    $(file.previewElement).find('.dz-error-mark').hide();
                    $(file.previewElement).find('.dz-success-mark').show();
                    $(file.previewElement).find('.dz-details').hide();
                    new DD_Layer_Img({
                        src: obj.filename,
                        width: obj.width,
                        height: obj.height
                    });
                    setTimeout(function () {
                        self._w().close();
                    }, 500);
                });
                this.on("error", function (file, responseText) {
                    self.previousFile = $(file.previewElement);
                    return processUploaderError(file, responseText);
                })
            }});
        this.uploaderInitiated = true;

        function processUploaderError(file, responseText, extraText) {
            $(file.previewElement).find('.dz-error-message').html(self._('uploader_error') + '<br>' + (extraText ? extraText : ''));
            $(file.previewElement).find('.dz-success-mark').hide();
            $(file.previewElement).find('.dz-details').hide();

            $(file.previewElement).find('.dz-error-mark').on('click', function () {
                $(file.previewElement).hide();
            });
        }
    },

    initMyPhotos: function (content) {
        var self = this;
        content.html(this._('loading') + '...')
                .addClass('tab-loading');

        $.ajax({
            url: this._s('myFilesPath'),
            type: 'json'
        })
                .done(function (data) {
                    content.removeClass('tab-loading');
                    if (!data || data.length == 0) {
                        content.html(self._('no_data'))
                        content.addClass('tab-no-data');
                        return;
                    }
                    content.removeClass('tab-no-data');
                    content.html('');

                    $.each(data, function (a, img) {
                        new DD_ImageLinkAdd({
                            'parent': content,
                            'src': img.src,
                            'width': img.width,
                            'height': img.height
                        });
                    });

                });

    }

});

var DD_AddText_Model = DD_ModelBase.extend({
    
    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },
    
    getWindowTitle: function() {
        return this._('add_text_to_image');
    },
    
    setWindowContent: function(parent) {
        this.form = new DD_windowTextForm(parent);
        this.setSaveTextEvent();
    },
    
    setSaveTextEvent: function() {
        var textarea = this.form.get().find('textarea');
        var self = this;
        
        this.form.get().find('button').on('click', function() {
            var text = textarea.val();
            if(text.trim() == '') {
                textarea.addClass('empty');
            }else{
                textarea.removeClass('empty');
                textarea.addClass('valid');
                new DD_Layer_Text({
                    text: text.trim()
                });
                self.closeWindow();
            }
        });
    }
});

var DD_Callback_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    _callbackClick: function () {
        if (this.obj.callback) {
            var self = this;
            this.obj.get().on('click', function () {
                var canvasBg = self._l() ? self._l().getBgCanvas() : null;
                var canvasHover = self._l() ? self._l().getHoverCanvas() : null;
                if(self.destroy) {
                   self.destroy.call(); 
                }
                self.obj.callback.call(self.obj, canvasBg, canvasHover);
            });
        }
    }
})

var DD_Control_Base_Model = DD_ModelBase.extend({
    controlTitleClass: 'control-title',

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    _initBase: function () {
        this.obj.options.fabricObject.controlModelCreated = this;
    },

    initPosition: function () {
        this.obj.get().css({
            //left: this.calcLeftosition(),
            top: this.calcTopPosition()
        });
        this.obj.get().fadeIn('slow');
        if (this._addControls && !this.obj.options.fabricObject.controlsAdded) {
            this._addControls();
            this.obj.options.fabricObject.controlsAdded = true;
        }
    },

    titleControl: function (titleText) {
        this.obj.content.get()
                .append($('<span />').addClass(this.controlTitleClass).text(titleText));
    },

    sizeBase: function () {
        var self = this;
        var fabricObj = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();

        this.obj._size.get().on('click', function () {

            var defaultScale = self.obj.options.fabricObject.defaultScale
                    ? self.obj.options.fabricObject.defaultScale
                    : self.obj.options.fabricObject.scaleX;

            //defaultScale = defaultScale ? defaultScale : 1;    
            if (!self.obj.options.fabricObject.defaultScale) {
                self.obj.options.fabricObject.defaultScale = defaultScale;
            }
            var currentScale = self.obj.options.fabricObject.scaleX;

            self.obj.content.get().empty();
            self.titleControl(self._('change_size'));
            self.obj.addControlBase({
                'min': 0,
                'max': 2,
                'step': 0.01,
                'value': currentScale / defaultScale
            });
            self.obj.contentContainer.get().show();
            self.obj.control.on('input', function () {
                var val = $(this).val();
                val = val * defaultScale;

                fabricObj.set({
                    'scaleX': parseFloat(val),
                    'scaleY': parseFloat(val)
                });
                fabricObj.setCoords();
                canvas.renderAll();
            });

            self.obj.control.on('mouseup', function () {
                canvas.trigger('object:modified', {target: fabricObj});
            });

        });
    },

    rotateBase: function () {
        var self = this;
        var fabricObj = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();
        this.obj._rotate.get().on('click', function () {

            self.obj.content.get().empty();
            self.titleControl(self._('rotate'));
            self.obj.addControlBase({
                'min': 0,
                'max': 360,
                'value': parseInt(fabricObj.get('angle'))
            });
            self.obj.contentContainer.get().show();
            self.obj.control.on('input', function () {
                var val = $(this).val();
                fabricObj.setAngle(val);
                fabricObj.setCoords();
                canvas.renderAll();
            });

            self.obj.control.on('mouseup', function () {
                canvas.trigger('object:modified', {target: fabricObj});
            });

        });
    },

    baseEvents: function () {
        if (this.obj._size) {
            this.sizeBase();
        }
        if (this.obj._rotate) {
            this.rotateBase();
        }
    },

    hideContentEvent: function () {
        var self = this;
        this.obj._closeContent.get().on('click', function () {
            self.obj.contentContainer.get().hide();
        });
    },

    removeBase: function () {
        if (this.obj.options.fabricObject.isSvg === true) {
            var canvas =  this._l().getHoverCanvas();
            this.obj.options.fabricObject.forEachObject(function (a) {
                canvas.remove(a);
            });
            canvas.remove(this.obj.options.fabricObject);
            return;
        }
        
        this.obj.options.fabricObject.remove();
    },

    setFabricObjVal: function (propName, val) {
        var fabricObject = this.obj.options.fabricObject;
        var canvas = this._l().getHoverCanvas();
        if (propName === 'fill') {
            fabricObject.setFill(val ? val : 'transparent');

        } else {
            fabricObject.set(propName, val);
        }
        canvas.renderAll();
        canvas.trigger('object:modified', {target: fabricObject});
    },

    calcTopPosition: function () {
        return '0';
    },

    calcLeftosition: function () {
        //return '0';
    },

    hide: function () {
        this.obj.contentContainer.get().hide()
        this.obj.get().fadeOut('fast');
    },

    remove: function () {
        this.obj.get().remove();
    }
});

var DD_Download_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addDownloadEvent: function (mainModel) {
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var image_data = atob(data.split(',')[1]);
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }
            try {
                var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
            } catch (e) {
                var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
                bb.append(arraybuffer);
                var blob = bb.getBlob('application/octet-stream');
            }
            var url = (window.webkitURL || window.URL).createObjectURL(blob);
            location.href = url;
        });
    }
});
var DD_ImageLink_Model = DD_ModelBase.extend({

    init: function(obj) {
        this.obj = obj;
    },

    setClickEvents: function () {
        var self = this;
        this.obj.self.on('click', function () {
            new DD_Layer_Img({
                src: $(this).attr('data-src'),
                width: parseInt($(this).attr('data-width')),
                height: parseInt($(this).attr('data-height'))
            });
            self._w().close();            
        });
    }
});

var DD_Layers_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('layers');
    },

    setWindowContent: function (parent) {
        var canvas = this._l().getHoverCanvas();
        var objs = canvas.getObjects();
        var self = this;
        
        parent.html('');

        $.each(objs, function () {
            var object = this;
            self.drawElement(object, parent, canvas);
        });
    },

    drawElement: function (object, parent, canvas) {
        if (typeof (object) === 'undefined') {
            return;
        }
        if (object.layerMask) {
            return;
        }

        var panel = new DD_panel({
            parent: parent,
            class: 'dd-control-layer'
        });

        panel.add();
        var type = object.isSvg ? 'svg' : object.type;
        var innerHtml = '';
        switch (type) {
            case "image":
                innerHtml += '<img src="' + object.src + '" class="dd-control-layer-image" />'
                break;
            case "svg":
                innerHtml += '<img src="' + object.src_orig + '" class="dd-control-layer-image" />'
                break;
            case "text":
                innerHtml += '<span class="dd-control-layer-text">'
                        + object.text
                        + '</span>';
                break;
        }

        panel.get().html(innerHtml);

        this.attachPanelClick( panel, object, canvas );
        this.drawControls( panel, object, canvas, parent );
    },

    drawControls: function (panel, object, canvas, parent) {
        var self = this;
        var remove = new DD_button({
            'parent': panel.get(),
            'class': 'fa fa-trash'
        });

        remove.get().on('click', function (e) {
            e.preventDefault();
            if (object.isSvg === true) {
                object.forEachObject(function (a) {
                    canvas.remove(a);
                });
            }
            canvas.remove(object);
            canvas.renderAll();
            self.setWindowContent(parent);
        });
    },

    attachPanelClick: function (panel, object, canvas) {
        panel.get().on('click', function () {
            canvas.setActiveObject(object);
        });
    }

});

var DD_Main_Model = DD_ModelBase.extend({
    eventBase: 'main-panel-created',
    eventClick: 'panel-click',
    eventObjectChanged: 'object-changed',
    eventObjectAdded: 'object-added',
    base: true,
    init: function (obj) {
        this.obj = obj;
        this._super();
        var self = this;

        if (this._s('loadGoogleFonts')) {
            var fonts = self.prepareFonts();
            WebFont.load({
                google: {
                    families: fonts
                },
                active: function () {
                    self.initLayers();
                    if (obj.options.help) {
                        self.help = $('body').dd_help({
                            'data': obj.options.help
                        });
                        self.help.show();
                        
                    }
                }
            });
            return;
        }
        this.initLayers();
        if (obj.options.help) {
            self.help = $('body').dd_help({
                'data': obj.options.help
            });
            self.help.show();
        }

    },

    registerEvents: function () {
        this._evnt().register(this.eventClick, this.obj);
        this._evnt().register(this.eventObjectChanged, this.obj);
        this._evnt().register(this.eventObjectAdded, this.obj);

        this.callBackObject();
    },

    initLayers: function () {
        var self = this;
        this.layersObj = new DD_Layer();
        this.idBgCanvas = 'canvas-' + this.createUUID();
        this.idCanvasHover = 'canvas-hover-' + this.createUUID();
        var bgCanvas = $('<canvas/>', {
            id: this.idBgCanvas
        });
        var hoverCanvas = $('<canvas/>', {
            id: this.idCanvasHover
        });
        var width = this.obj.options.width;
        var height = this.obj.options.height;
        
        bgCanvas.attr({
            'width': width,
            'height': height
        });
        hoverCanvas.attr({
            'width': width,
            'height': height
        });
        this.obj.self.append(bgCanvas);
        var div = $('<div />').addClass('canvas-absolute')
                .append(hoverCanvas);
        this.obj.self.append(div);

        var bgCanvas = new fabric.Canvas(this.idBgCanvas);
        var hoverCanvas = new fabric.Canvas(this.idCanvasHover);

        this.layersObj.setBgCanvas(bgCanvas);
        this.layersObj.setHoverCanvas(hoverCanvas);
        this.layersObj.setHeight(height);
        this.layersObj.setWidth(width);

        new DD_Layer_Main({
            width: width,
            height: height,
            src: this.obj.options.src
        });

        this._canvasEvents(hoverCanvas);
        this._addObjects(this.obj.options);

        this.resize(width, height);
        $(window).on('resize', function () {
            self.resize(width, height);
        });

        $('.dd-designer-loading').hide();
        return;
    },

    _canvasEvents: function (hoverCanvas) {
        var self = this;
        hoverCanvas.on('object:added', function (e) {

            new DD_control({
                parent: self.obj.self,
                fabricObject: e.target
            });
            if (e.target.uid) {
                return;
            }
            e.target.uid = self.createUUID();
            e.target.uid.toString();
            self._onUpdate(e.target, 'update');

        });
        hoverCanvas.on('object:moving', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:scaling', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:rotating', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:skewing', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });

        hoverCanvas.on('before:selection:cleared', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.hide();
            }
        });
        hoverCanvas.on('object:selected', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
            self._onUpdate(e.target, 'update');
        })
        hoverCanvas.on('object:modified', function (e) {
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.initPosition();
            }
            self._onUpdate(e.target, 'update');
        });
        hoverCanvas.on('object:removed', function (e) {
            self._onUpdate(e.target, 'remove');
            if (e.target.controlModelCreated) {
                e.target.controlModelCreated.remove();
            }
        });
        hoverCanvas.on('object:clear_all', function (e) {
            console.log('trigger object:clear_all!');
            self.obj.options.onClearAll.call(null, self.obj.options.media_id)
        });
    },

    _addObjects: function (options) {
        if (options.mask) {
            var mask = new DD_Layer_Mask(options.mask, true);
            mask.save();
        }
        if (options.conf) {
            var self = this;
            var last = options.conf.length;
            $(options.conf).each(function (i, obj) {
                var notSelect = (last - 1) == i ? false : true;
                if (obj.type === 'image') {
                    new DD_Layer_Img(null, obj, notSelect);
                }
                if (obj.type === 'text') {
                    new DD_Layer_Text(null, obj, notSelect);
                }
                if (obj.isSvg === true) {
                    new DD_Layer_Svg(obj);
                }
            });
        }
        ;
    },

    _onUpdate: function (fabricObj, type) {
        var newObject = fabricObj.toJSON();
        newObject.uid = fabricObj.uid;
        if (fabricObj.layerMask) {
            newObject.layerMask = true;
        }
        if (fabricObj.controlModel) {
            newObject.controlModel = fabricObj.controlModel;
        }
        if (fabricObj.isSvg) {
            newObject.svgString = fabricObj.toSVG();
            newObject.src_orig = fabricObj.src_orig;
            newObject.isSvg = true;
        }

        if (this.obj.options.onUpdate) {
            this.obj.options.onUpdate.call(
                    null,
                    newObject,
                    this.obj.options.group_index,
                    this.obj.options.media_id,
                    type);
        }
    },

    resize: function (width, height) {
        var blockWidth = $(window).width(); //magento 2 modal
        var blockHeight = $(window).height() - 40; //magento 2 modal

        this.obj.get().width(blockWidth);
        this.obj.get().height(blockHeight);

        var newWidth, newHeight, scaleFactor;
        var bgCanvas = this.layersObj.getBgCanvas();
        var hoverCanvas = this.layersObj.getHoverCanvas();
        if (blockWidth < width) {
            newWidth = blockWidth;
            newHeight = (height / width) * newWidth;
            scaleFactor = blockWidth / this._l().getWidth();
        }

        if (blockHeight < (newHeight ? newHeight : height)) {
            var scaleFactorH = (blockHeight) / (newHeight ? newHeight : this._l().getHeight());
            if (scaleFactorH != 1) {
                newHeight = blockHeight;
                newWidth = (newHeight) * (width / height);
                scaleFactor = (scaleFactor ? scaleFactor : 1) * scaleFactorH;
            }
        }

        if (scaleFactor != 1 && newHeight && newWidth) {
            bgCanvas.setWidth(newWidth);
            bgCanvas.setHeight(newHeight);
            bgCanvas.setZoom(scaleFactor);
            bgCanvas.calcOffset();
            bgCanvas.renderAll();
            hoverCanvas.setWidth(newWidth);
            hoverCanvas.setHeight(newHeight);
            hoverCanvas.setZoom(scaleFactor);
            hoverCanvas.calcOffset();
            hoverCanvas.renderAll();

            this.obj.get().width(newWidth);
            this.obj.get().height(newHeight);

        }
        return;
    },

    destroy: function () {
        this._evnt().unregisterAll();
        this.obj.self.parent().empty();
        this.obj.self.parent().remove();
        this._w().close();
        this._evnt().destroyJBoxes();
        if(this.help) {
            this.help.destroy();
        }
        delete this;
    },

    prepareFonts: function () {
        var listFonts = this._s('listFonts');
        var googleFonts = [];
        $.each(listFonts, function (i, font) {
            if (font.indexOf('"') != -1) { //custom named font
                var fontArr = font.split(',');
                googleFonts.push(fontArr[0].replace(/\"/g, ''));
            }
        });

        return googleFonts;
    },

    getDataImg: function () {
        return this._mergeCanvases();
    },

    getJsonImg: function () {
        return this._mergeCanvases(true);
    },

    unselectAll: function () {
        var _hoverCanvas = this.layersObj.getHoverCanvas();
        if (_hoverCanvas) {
            _hoverCanvas.discardActiveObject().renderAll();
        }
    },

    _getSvgLayer: function (obj) {
        var output = $('<canvas />')
                .attr({
                    'width': obj.width,
                    'height': obj.height
                })
                .get(0);

        var octx = output.getContext('2d');

    },

    _mergeCanvases: function (json) {

        var _bgCanvas = this.layersObj.getBgCanvas();
        var _hoverCanvas = this.layersObj.getHoverCanvas()
        var bgCanvas = $('#' + this.idBgCanvas).get(0);
        var hoverCanvas = $('#' + this.idCanvasHover).get(0);

        var sourceBgWidth = _bgCanvas.lowerCanvasEl.width;
        var sourceBgHeight = _bgCanvas.lowerCanvasEl.height;
        var sourceHoverWidth = _hoverCanvas.lowerCanvasEl.width;
        var sourceHoverHeight = _hoverCanvas.lowerCanvasEl.height;
        var output = $('<canvas />')
                .attr({
                    'width': this._l().getWidth(),
                    'height': this._l().getHeight()
                })
                .get(0);

        var octx = output.getContext('2d');

        octx.drawImage(bgCanvas, 0, 0, sourceBgWidth, sourceBgHeight, 0, 0, output.width, output.height);
        octx.drawImage(hoverCanvas, 0, 0, sourceHoverWidth, sourceHoverHeight, 0, 0, output.width, output.height);
        if (!json) {
            return output.toDataURL('png');
        }

        return []; //skip this for now!
    }
});

var DD_Privew_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addPreviewEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(self.__imgSourcetoShow(data));
            pwa.document.close();

        });
    },

    __imgSourcetoShow: function (data) {
        return "<html><head>/head><body>" +
                "<img src='" + data + "' style='max-width:100%;' /></body></html>";
    }
});


var DD_Print_model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addPrintEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(self.__imgSourcetoPrint(data));
            pwa.document.close();

        });
    },

    __imgSourcetoPrint: function (data) {
        return "<html><head><script>function step1(){\n" +
                "setTimeout('step2()', 10);}\n" +
                "function step2(){window.print();window.close()}\n" +
                "</scri" + "pt></head><body onload='step1()'>\n" +
                "<img src='" + data + "' /></body></html>";
    }
});

var DD_RemoveAll_model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },
    addClearAllEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            var canvas = self._l().getHoverCanvas();
            canvas.clear();
            canvas.renderAll();
            canvas.trigger('object:clear_all', {});
        });
    }
});



var DD_Share_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    initShareFb: function (mainModel) {
        this.mainModel = mainModel;
        var self = this;
        this.obj.get().on('click', function () {
            self.sendData('facebook');
        });
    },

    sendData: function (type) { //fb or instagram
        var self = this;
        switch (type) {
            case 'facebook':
                var _class = 'fa-facebook';
                break;

        }
        var img = this.mainModel;
        this.showLoading(_class);
        this.mainModel.unselectAll();
        $.ajax({
            url: this.mainModel.shareUrl,
            type: 'json',
            method: 'post',
            data: {
                'type': type,
                'img': this.mainModel.getDataImg()
            }
        })
                .done(function (response) {
                    self.hideLoading(_class);
                    if(response.error) {
                        alert(response.errMessage);
                        return;
                    }
                    if(response.share_url) {
                        window.open(response.share_url);
                    }
                });
    },

    showLoading: function (_class) {
        this.obj.get().removeClass(_class)
                .addClass('fa-circle-o-notch')
                .addClass('fa-spin');
    },

    hideLoading: function (_class) {
        this.obj.get().removeClass('fa-spin')
                .removeClass('fa-circle-o-notch')
                .addClass(_class);
    }
});

var DD_control_image = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
        
        this.baseEvents();
        this.addSvgControls();
    },
    
    addDelete: function() {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function() {
            self.removeBase();
        });
    },
    
    addSvgControls: function() {
        var fabricObject = this.obj.options.fabricObject;
        var content = this.obj.content.get();
        var color = fabricObject.fill;
        
        if(fabricObject.isSvg === true) {
            this.obj.colorSelector(this.obj.buttons.get(), '', color, this.setColor, this);
        }
    },

    setColor: function (color, model) {
        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("fill", setColor);
    }
});

var DD_control_mask = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.addSave();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
      
        this.baseEvents();
    },
    addDelete: function () {
        var _delete = this.obj.addDeleteBase();
        var self = this;
        _delete.get().on('click', function() {
            self.removeBase();
            self._l().setMask(null)
        });
    },
    addSave: function () {
        var self = this;
        var _save = this.obj.addSaveBase();
        _save.get().on('click', function () {
            self._l().getMask().eventSave.call();
        });
    }
});

var DD_control_text = DD_Control_Base_Model.extend({
    containerClass: 'dd-helper-control-text',

    init: function (obj) {
        this._super(obj);
    },

    _addControls: function () {
        this.obj.contentContainer.get().addClass(this.containerClass);
        this.addDelete();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
        this.addFontSelector();
        this.addEdit();

        this.baseEvents();
    },

    addEdit: function () {
        var self = this;
        var edit = this.obj.addEditBase();
        

        edit.get().on('click', function () {
            var content = self.obj.content.get();
            content.empty();
            var fabricObject = self.obj.options.fabricObject;
            var text = fabricObject.text;
            var form = new DD_windowTextForm(content, text);
            self.obj.contentContainer.get().show();
            self.setEditEvents(form);
        });
    },

    setEditEvents: function (form) {
        var self = this;
        var textarea = form.get().find('textarea');
        form.get().find('button').on('click', function () {
            var text = textarea.val();
            if (text.trim() == '') {
                textarea.addClass('empty');
            } else {
                textarea.removeClass('empty');
                textarea.addClass('valid');
                self.setFabricObjVal("text", text.trim());
                self.obj.contentContainer.get().hide();
            }
        });
    },

    addFontSelector: function () {
        var self = this;
        var _selector = new DD_button({
            'parent': this.obj.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-font'
        });
        _selector.get().on('click', function () {
            self.showTextSetting();
        });
    },

    setBgColor: function (color, model) {
        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("backgroundColor", setColor);
    },

    setFontColor: function (color, model) {

        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("fill", setColor);
    },

    setFont: function (font, model) {
        model.setFabricObjVal("fontFamily", font);
    },

    showTextSetting: function () {
        var fabricObject = this.obj.options.fabricObject;

        var color = fabricObject.fill;
        var bg = fabricObject.backgroundColor;
        var font = fabricObject.fontFamily;
        var content = this.obj.content.get();
        content.empty();
        this.obj.colorSelector(content, this._('background_color'), bg, this.setBgColor, this);
        this.obj.colorSelector(content, this._('text_color'), color, this.setFontColor, this);
        this.obj.fontSelector(content, font, this.setFont, this);

        this.obj.contentContainer.get().show();
    },

    addDelete: function () {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function () {
            self.removeBase();
        });
    }
})

var DD_Layer_Base = DD_object.extend({

    init: function (id) {
        this._super(id);
    },

    positionToBase: function (options, setTo) {
        var parent = this.getParent();
        switch (setTo) {
            default:
                options = this.positionCenterCenter(parent, options);  
                break;
        }
        return options;
    },
    
    getParent: function() {
        if(this.parent) {
            return this.parent;
        }
        return this._l().getHoverCanvas();//canvas
    },
    
    positionCenterCenter: function(parent, options) {
        
        if(this._l().getMask()) {
            var mask = this._l().getMask();
            var pointCenter = mask.getCenterPoint();
            options.left = (pointCenter.x) - ((options.width)/2);
            options.top = (pointCenter.y) - ((options.height)/2); 
        }else{
            options.left = (this._l().getWidth() - options.width)/2;
            options.top = (this._l().getHeight() - options.height)/2;
        }
        options.centeredRotation = true;
        return options;
    },
    
    getAngle: function() {
        if(this._l().getMask()) {
            var angle = this._l().getMask().get('angle');
        }else{
            var parent = this.getParent();
            var angle = parent.get('angle');
        }
        return angle;
    },

    calcFontSize: function () {
        if(this._l().getMask()) {
           var width = this._l().getMask().getWidth(); 
        }else{
            var width = this._l().getWidth();
        }
        var canvas = this._l().getHoverCanvas();
        return parseInt(this._s('defaultFontSize')/canvas.getZoom()) * 
                (width / canvas.getWidth());
    },
    
    setSize: function(options, sizes, percentFromParent) {
        options.width  = this.calcObjectSize(sizes, percentFromParent).width;
        options.height = this.calcObjectSize(sizes, percentFromParent).height;
        return options;
    },

    calcObjectSize: function (sizes, percentFromParent) {
        if(this._l().getMask()) {
            var mask = this._l().getMask();
            var width  = mask.get('width') * mask.get('scaleX');
            var height = mask.get('height') * mask.get('scaleY');
        }else{
            var width = this._l().getWidth();
            var height = this._l().getHeight();
        }
        var newWidth = (width/100)*percentFromParent;
        if(sizes && sizes.width < newWidth) {
            //return sizes;
        }
        if(sizes){
            var prop = sizes.height/sizes.width;
            var newHeight = newWidth * prop;
        }else{
            var newHeight = ( height / 100 ) * percentFromParent;
        }
        var sizes = {
            width: newWidth,
            height: newHeight
        }
        return sizes;
    },
    
    getObject: function() {
        return this.object;
    },
    
    setDeselectEvent: function() {
        this.object.on('deselected', function(e) {
            if(typeof(this.controlModelCreated)!=='undefined') {
                this.controlModelCreated.hide();
            }
        });
    },
    
    setObjAngle: function(object) {
        var angle = this.getAngle();
        if(angle && !object.get('angle')) {
            object.setAngle(angle);
        }
    },
    
    removeControlsMiddle: function(obj) {
        obj['setControlVisible']('mb', false);
        obj['setControlVisible']('mt', false);     
    },
    
    onCreated: function() {
        this.setDeselectEvent();
        //this.removeControlsMiddle();
    }
});
var DD_Layer_Img = DD_Layer_Base.extend({
    init: function (options, fullCnfg, notSelect) {
        var self = this;
        var options = options ? options : {};
        if (options.parent) {
            this.parent = options.parent;
        }
        var src = fullCnfg ? fullCnfg.src : options.src;
        var ext = src.substr(src.lastIndexOf('.') + 1);

        function ___callBack(iImg, isSvg, src_orig) {
            var parent = self.getParent()
            if (!fullCnfg) {
                var conf = {
                    hasControls: options.nocontrols ? false : true,
                    hasBorders: options.noborders ? false : true,
                    selectable: options.noselectable ? false : true,
                    controlModel: 'DD_control_image',
                    centeredScaling: true,
                    src_orig: src_orig,
                    isSvg: isSvg
                }
                var mask = self._l().getMask();
                var percentWidth = !mask ? self._s('defaultLayerMaskWidth') : self._s('percentSizeFromMask');
                if (!options.noChangeSize) {
                    conf = self.setSize(conf, {
                        width: options.width,
                        height: options.height
                    }, percentWidth);
                }
                if (!options.noChangeSize) {
                    conf = self.positionToBase(conf);
                }
            } else {
                var conf = fullCnfg;
            }

            conf.notSelect = notSelect;
            if (!isSvg) {
                iImg
                        .set(conf);
            } else {
                var _opt =  {
                    width:options.width, 
                    height:options.height, 
                    scaleY: conf.height / options.height, 
                    scaleX: conf.width / options.width
                };
                
                var object = fabric.util.groupSVGElements(iImg);
                iImg = new fabric.Group(object.getObjects(), _opt);
                
                delete conf.width;
                delete conf.height;
                
                iImg.set(conf);    
            }
            parent.add(iImg);
            self.removeControlsMiddle(iImg);
            
            if (!options.noChangeSize) {
                self.setObjAngle(iImg);
            }

            parent.renderAll();

            if (!options.noselectable && !conf.notSelect) {
                parent.setActiveObject(iImg);
            }

            self.object = iImg;
            self.onCreated();

        }
        if (ext !== 'svg') {
            fabric.Image.fromURL(src, function (iImg) {
                ___callBack(iImg);
            }, {crossOrigin: 'anonymous'});
        } else {
            fabric.loadSVGFromURL(src, function (svgobject) {
                ___callBack(svgobject, true, src);
            });
        }
    }
});


var DD_Layer_Main = DD_Layer_Base.extend({
    init: function(options) {
        fabric.Object.prototype.transparentCorners = false;
        //this._l().canvas.selection = false;
        options.nocontrols = true;
        options.noborders = true;
        options.noselectable = true;
        options.left = 0;
        options.top = 0;
        options.noChangeSize = true;
        options.parent = this._l().getBgCanvas();
        options.mainBg = true;
        new DD_Layer_Img(options);
        return;
    }
});



var DD_Layer_Mask = DD_Layer_Base.extend({

    init: function (maskOptions, notSelect) {
        if (maskOptions) {
            if (maskOptions.type == 'rect') {
                maskOptions.controlModel = 'DD_control_mask';
                return this.addRectLayer(maskOptions, notSelect);
            }
        }
        return this.addRectLayer(false, notSelect);
    },
    addRectLayer: function (conf, notSelect) {
        var parent = this.getParent();
        if (!conf) {
            var conf = {
                opacity: 0.4,
                layerMask: true,
                controlModel: 'DD_control_mask',
                centeredScaling: true
            };

            conf = this.setSize(conf, null, this._s('defaultLayerMaskWidth'));
            conf = this.positionToBase(conf);

        }
        var rect = new fabric.Rect(conf);
        parent.add(rect);
        
        rect.notSelect = notSelect;
        if(!notSelect) {
            parent.setActiveObject(rect);
        }
        parent.renderAll();
        this._l().setMask(rect);
        rect.eventSave = this.save.bind(this);
        rect.eventRestore = this.restore.bind(this);
        this.object = rect;
        this.setDeselectEvent();
        
        return this;
    },

    save: function () {
        var object = this._l().getMask();
        var canvas = this._l().getHoverCanvas();
        canvas.clipTo = function (ctx) {
            var oCoords = object.oCoords;
            ctx.strokeStyle = 'transparent';
            ctx.beginPath();
            ctx.moveTo(oCoords.tl.x, oCoords.tl.y);
            ctx.lineTo(oCoords.tr.x, oCoords.tr.y);
            ctx.lineTo(oCoords.br.x, oCoords.br.y);
            ctx.lineTo(oCoords.bl.x, oCoords.bl.y);
            ctx.closePath();
            ctx.stroke();
            ctx.save();
        }
        canvas.setBackgroundColor('transparent');
        object.hasControls = false;
        object.selectable = false;
        if(object.controlModelCreated) {
            object.controlModelCreated.hide();
        }
        object.setOpacity(0);
        canvas.renderAll();
    },

    restore: function () {
        var object = this._l().getMask();
        var canvas = this._l().getHoverCanvas();
        canvas.clipTo = null;
        object.hasControls = true;
        object.selectable = true;
        object.setOpacity(0.4);
        canvas.setActiveObject(object);
        canvas.setBackgroundColor('transparent');
        canvas.renderAll();
    }
});

var DD_Layer_Svg = DD_Layer_Base.extend({
    
    init: function (conf) {
        var parent = this.getParent();
        var self = this;
        var svgString = conf.svgString;
        var reg = /translate\(.+?\)/g;
        svgString = svgString.replace(reg, "");
        var reg2 = /scale\(.+?\)/g;
        svgString = svgString.replace(reg2, "");
        var reg3 = /rotate\(.+?\)/g;
        svgString = svgString.replace(reg3, "");
        
        fabric.loadSVGFromString(svgString, function(svg, opt) {
            delete conf.paths;
            delete opt.angle;
            var object = fabric.util.groupSVGElements(svg);
            var iImg = new fabric.Group(object.getObjects(), opt);
            iImg.set(conf);
            parent.add(iImg);
            self.removeControlsMiddle(iImg);
            parent.calcOffset();
            parent.renderAll();
            self.object = iImg;
            self.onCreated();
        });
        
    }
    
});

var DD_Layer_Text = DD_Layer_Base.extend({
    init: function (options, fullCnfg, notSelect) {
        console.log('notSelect: ' + notSelect);
        var parent = this.getParent();

        var options = options ? options : {};
        var text = fullCnfg ? fullCnfg.text : options.text;
        
        if (!fullCnfg) {
            console.log(this._s('defaultFont'));
            var conf = {
                fontSize: this.calcFontSize(),
                fontFamily: options.fontFamily ? options.fontFamily : this._s('defaultFont'),
                fill: options.fill ? options.fill : this._s('defualtFontColor'),
                controlModel: 'DD_control_text',
                centeredScaling: true
            };
        } else {
            var conf = fullCnfg;
        }

        conf.notSelect = notSelect;
        
        var text = new fabric.Text(text, conf);
        parent.add(text);
        
        if (!fullCnfg) {
            var coords = this.positionToBase({width: text.getWidth(), height: text.getHeight()});

            text.set({
                left: parseInt(coords.left),
                top: parseInt(coords.top)
            }).setCoords();

            this.setObjAngle(text);
        }else{
            text.setCoords();
        }
        
        this.removeControlsMiddle(text);

        parent.renderAll();
        if (!options.noselectable && !conf.notSelect) {
            parent.setActiveObject(text);
        }
        
        this.object = text;
        this.onCreated();
    }
})

var DD_AddfromLibraryButton = DD_button.extend({
    object_id: 'dd-add-library-button',
    class_name: 'dd-add-library-controls fa fa-folder',
    
    model: 'DD_AddFromLibrary_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_from_library'),
            windowOpener: true,
            tooltip: true,
            fa:true
        }
        this._super(options);
    }
})

var DD_AddphotoButton = DD_button.extend({
    object_id: 'dd-add-photo-button',
    class_name: 'dd-add-photo-controls fa fa-file-image-o',
    model: 'DD_AddPhoto_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_photo'),
            windowOpener: true,
            fa: true,
            
            tooltip: true
        }
        this._super(options);
    }
});

var DD_AddtextButton = DD_button.extend({
    object_id: 'dd-add-text-button',
    class_name: 'dd-add-text-controls fa-file-text-o fa',
    model: 'DD_AddText_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_text'),
            windowOpener: true,
            fa: true,
            tooltip: true
        }
        this._super(options);
    }
})


var DD_Bottomcontrols = DD_panel.extend({
    object_id: 'dd-bottom-controls',
    class_name: 'dd-designer-bottomcontrols',

    init: function (parent, main, mainModel) {
        this.parent = parent;
        this.main = main;
        this.mainModel = mainModel;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function () {
        this.addPreviewButton();
        this.addDownloadButton();
        this.addPrintButton();
        this.addClearAllButton();
    },
    
    addDownloadButton: function() {
        if(!this._s('download')) {
            return;
        }
        new DD_downloadButton(this.self, this.mainModel);
    },
    
    addPrintButton: function() {
        if(!this._s('print')) {
            return;
        }
        new DD_printButton(this.self, this.mainModel);
    },
    
    addClearAllButton: function() {
        if(!this._s('clear_all')) {
            return;
        }
        new DD_clearAllButton(this.self, this.mainModel);
    },
    
    
    addPreviewButton: function() {
        if(!this._s('preview')) {
            return;
        }
        new DD_previewButton(this.self, this.mainModel);
        
    }
});

var DD_Category = DD_panel.extend({
    
    class_name: 'dd-designer-category',
    
    init: function (options) {
        this.parent = options.parent;
        this.data = options.data;
        
        this._model = options.model;
        this._super({
            'class': this.class_name,
            'parent': this.parent
        });
        
        this.add();
    },
    
    _addElements: function() {
        this.self.append($('<a />')
                .append($('<span />').addClass('fa-folder-open fa'))
                .append(this.data.name));
        
        this._model.addOnCategoryEvent(this.self, this.parent, this.data.name);
        
    },
    
});

var DD_clearAllButton = DD_button.extend({
    class_name: 'dd-main-button fa-scissors fa',
    model: 'DD_RemoveAll_model',
    
    init: function (parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('clear_all'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    },
    
    
    _callBackModel: function(model) {
        model.addClearAllEvent(this.mainModel);
    }

});

var DD_closeButton = DD_button.extend({
    object_id: 'dd-main-close-button',
    class_name: 'dd-main-button-cancel fa fa-times',
    model: 'DD_Callback_Model',

    init: function (parent, callback) {
        this.callback = callback;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('close'),
            tooltip: true
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        var self = this;
        model.destroy = function () {
            if (self.tooltipBox) {
                self.tooltipBox.destroy();
            }
        }
        model._callbackClick();
    }
});


var DD_downloadButton = DD_button.extend({
    class_name: 'dd-main-button fa-download fa',
    model: 'DD_Download_Model',
    
    init: function (parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            
            tooltip_text: this._('download'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.addDownloadEvent(this.mainModel);
    }

});

var DD_historyBackButton = DD_button.extend({
    object_id: 'dd-history-back-button',
    class_name: 'dd-history-controls',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('back')
        }
        this._super(options);
    }
});


var DD_Historycontrols = DD_panel.extend({
    object_id: 'dd-history-controls',
    class_name: 'dd-designer-history-controls',
    
    init: function (parent) {
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.addBackButton();
        this.addNextButton();
    },
    
    addNextButton: function() {
        new DD_historyNextButton(this.self);
    },
    
    addBackButton: function() {
        new DD_historyBackButton(this.self);
    }
});

var DD_historyNextButton = DD_button.extend({
    object_id: 'dd-history-next-button',
    class_name: 'dd-history-controls',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('next')
        }
        this._super(options);
    }
});



var DD_layerButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-database fa',
    model: 'DD_Layers_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('layers'),
            fa: true,
            tooltip: true,
            windowOpener: true
        }
        this._super(options);
    }
});


var DD_main = DD_panel.extend({
    object_id: 'dd-main-panel',
    class_name: 'dd-designer-container clearfix',
    model: 'DD_Main_Model',

    init: function (parent, options) {
        this.options = options;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
    },
    
    create: function() {
        return this.add();
    },
    
    _addElements: function() {
        if(this._s('history')) {
            new DD_Historycontrols(this.self);
        }
        new DD_Maincontrols(this.self.parent(), this);
    },
    
    _callBackModel: function(model) {
        new DD_Topcontrols(this.self.parent(), this, model);
        new DD_Bottomcontrols(this.self.parent(), this, model);
    }
});

var DD_Maincontrols = DD_panel.extend({
    object_id: 'dd-main-controls',
    class_name: 'dd-designer-maincontrols',

    init: function (parent, main) {
        this.parent = parent;
        this.main = main;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },

    _addElements: function () {
        if(this.main.options.onClose) {
            this.addCloseButton(this.main.options.onClose);
        }
        this.addSaveButton();
    },    
    
    addCloseButton: function(onClose) {
        new DD_closeButton(this.self, onClose);
    },
    
    addSaveButton: function() {
        if(!this._s('save') || !this.main.options.onSave) {
            return;
        }
        new DD_saveButton(this.self, this.main.options.onSave);
    }
});

var DD_previewButton = DD_button.extend({
    object_id: 'dd-main-preview-button',
    class_name: 'dd-main-button fa fa-eye',
    model: 'DD_Privew_Model',
    
    init: function(parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('preview'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.addPreviewEvent(this.mainModel);
    }
});


var DD_printButton = DD_button.extend({
    class_name: 'dd-main-button fa-print fa',
    model: 'DD_Print_model',
    init: function (parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('print'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.addPrintEvent(this.mainModel);
    }

});

var DD_qrButton = DD_button.extend({
    object_id: 'dd-main-qrcode-button',
    class_name: 'dd-main-button',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('add_qrcode')
        }
        this._super(options);
    }
});


var DD_saveButton = DD_button.extend({
    object_id: 'dd-main-save-button',
    class_name: 'dd-main-button fa-check-square fa',
    model: 'DD_Callback_Model',

    init: function (parent, callback) {
        this.callback = callback;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('save'),
            fa: true,
            tooltip: true
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        var self = this;
        model.destroy = function () {
            if (self.tooltipBox) {
                self.tooltipBox.destroy();
            }
        }

        model._callbackClick();
        
    },

    showLoading: function () {
        this.self.removeClass('fa-check-square')
                .addClass('fa-circle-o-notch')
                .addClass('fa-spin');
    },

    hideLoading: function () {
        this.self.removeClass('fa-spin')
                    .removeClass('fa-circle-o-notch')
                    .addClass('fa-check-square');
    }
});


var DD_shareFbButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-facebook fa',
    model: 'DD_Share_Model',
    
    init: function(parent, mainModel, shareUrl) {
        this.mainModel = mainModel;
        this.mainModel.shareUrl = shareUrl;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('share_facebook'),
            fa: true,
            tooltip: true
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.initShareFb(this.mainModel);
    }
});



var DD_Topcontrols = DD_panel.extend({
    object_id: 'dd-top-controls',
    class_name: 'dd-designer-topcontrols',
    
    init: function (parent, main, mainModel) {
        this.parent = parent;
        this.main = main;
        this.mainModel = mainModel;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        
        if(typeof(this.main.options.extra_config) === 'undefined') {
            this.main.options.extra_config = {};
        }
        this.add();
        
    },
    
    _addElements: function() {
        this.addPhotoButton();
        this.addTextButton();
        this.addFromLibraryButton();
        this.addLayersButton();
        this.addShareFbButton();
    },
    
    addShareFbButton: function() {
        if(!this._s('shareFb')) {
            return;
        }
        new DD_shareFbButton(this.self, this.mainModel, this.main.options.settings.shareUrl);
    },
    
    addLayersButton: function() {
        if(!this._s('layers')) {
            return;
        }
        new DD_layerButton(this.self);
    },
    
    addPhotoButton: function() {
        if(this.main.options.extra_config.photos_enabled === false) {
            return;
        }
        if(this._s('addphoto') || this.main.options.extra_config.photos_enabled === true) {
            return new DD_AddphotoButton(this.self);
        }
    },
    
    addTextButton: function() {
        if(this.main.options.extra_config.text_enabled === false) {
            return;
        }
        if(this._s('addtext') || this.main.options.extra_config.text_enabled === true) {
            return new DD_AddtextButton(this.self);
        }
    },
    
    addFromLibraryButton: function(){
        if(this.main.options.extra_config.library_enabled === false) {
            return;
        }
        if(this._s('addfromlibrary') || this.main.options.extra_config.library_enabled === true) {
            return new DD_AddfromLibraryButton(this.self);
        }
    }
    
});

var DD_windowPhotoTabs = DD_Tabs.extend({
    object_id: 'dd-add-photo-tabs',
    model: 'DD_AddPhoto_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            tabs: this.getTabs()
        }
        this._super(options);
    },
    getTabs: function() {
        return [
            {
                id: 'dd-add-photo-tab',
                text: this._('upload')
            },
            {
                id: 'dd-my-photo-tab',
                text: this._('my_photos')
            }
        ];
    }
});


var DD_windowTextForm = DD_panel.extend({
    object_id: 'dd-add-text-form',
    
    init: function(parent, value) {
        var options = {
            parent: parent,
            id: this.object_id
        }
        this.value = value;
        this._super(options);
        this.add();
    },
    
    _addElements: function() {
        this.addTextArea();
        this.addSaveButton();
    },
    
    addTextArea: function() {
        this.textArea = $('<textarea />').attr('class', 'dd-add-text-textarea');
        if(this.value) {
            this.textArea.val(this.value);
        }
        this.self.append(this.textArea);
    },
    
    addSaveButton: function() {
        new DD_button({
            'id': 'dd-add-text-button',
            'parent': this.self,
            'text': this.value ? this._('update_text'): this._('add_text')
        });
    }
});

$.fn.dd_help = function (options) {
    this.options = $.extend({
        'delay': 7000,
        'defaultOutside': 'y',
        'defaultPosition': {
            x: 'center',
            y: 'top'
        },
        data: [
            /* 
             * {
             * 
             'selector': 'jquerySelector',
             'content' : '{content}'
             'position': null,
             'outside' : null
            
             }
             */
        ]
    }, options);

    this.show = function () {

        var options = this.options;
        var firstEl = options.data[0];
        var index   = 0;
        
        var self = this;

        function showHelpElement(data) {
            var cookieName = 'help-' + data.selector;
            if($.cookie(cookieName)) {
                index++;
                var newEl = options['data'][index];
                if(newEl) {
                    showHelpElement(newEl);
                }
                return;
            }
            $.cookie(cookieName, true);
            var divContainer = $('<div />').addClass('dd-help-container')
                    .html(data.content);
            var buttonContainer = $('<div />').addClass('dd-help-buttons');
            
            var help = new jBox('Tooltip', {
                target: data.selector,
                position: data.position ? data.position : options.defaultPosition,
                outside: data.outside ? data.outside :options.defaultOutside,
                closeOnMouseleave: true           
            });
            
            var _close = $('<button />').text('OK');
            _close.on('click', function() {
                help.destroy();
                index++;
                var newEl = options['data'][index];
                if(newEl) {
                    showHelpElement(newEl);
                }
            });
            
            
            buttonContainer.append(_close);
            divContainer.append(buttonContainer);
            help.setContent(divContainer);
            help.open();
            
            self.showed = help;
        }


        setTimeout(showHelpElement(firstEl), options.delay);

    };
    
    this.destroy = function() {
        if(this.showed){
            this.showed.destroy();
        }
    }

    return this;
};
$.fn.dd_productdesigner = function (options) {
    var settings = {
        'addphoto': true,
        'addtext': true,
        'addfromlibrary': true,
        'history': false,
        'layers': true,
        'save': true,
        'print': true,
        'clear_all': true,
        'preview': true,
        'download': true,
        'defaultFont': 'Verdana,Geneva,sans-serif',
        'defualtFontColor': '#ffffff',
        'defaultFontSize': 25,
        'listFonts': [],
        'percentSizeFromMask': 70,
        'defaultLayerMaskWidth': 40,
        'urlUploadImages': '',
        'myFilesPath': '/myfiles.php',
        'libraryPath': '',
        'shareFb': false,
        'shareInst': false,
        'loadGoogleFonts': true,
        'percentSizeImage': 20 //percentage size from canvas width,
    };

    settings = $.extend(settings, options.settings);

    this.options = $.extend({
        'src': '',
        'debug': false,
        'width': '',
        'height': '',
        'sku': '',
        'product_id': '',
        'media_id': '',
        'group_index': '',
        'mask': '',
        'translator': {
            'back': 'Back',
            'next': 'Next',
            'add_photo': 'Add Photo',
            'add_text': 'Add Text',
            'update_text': 'Update Text',
            'add_from_library': 'Add from Library',
            'layers': 'Layers',
            'save': 'Save',
            'add_qrcode': 'Add QR Code',
            'preview': 'Preview',
            'loading': 'Loading',
            'add_text_to_image': 'Add text to image',
            'add_photo_to_image': 'Add photo to image',
            'upload': 'Upload',
            'my_photos': 'My Photos',
            'drop_files_or_upload': 'Click to upload',
            'uploader_error': 'Uploader Error!!!',
            'loading': 'Loading',
            'no_data': 'No Data Found',
            'delete': 'Delete',
            'save': 'Save',
            'change_size': 'Change Size',
            'rotate': 'Rotate',
            'background_color': 'Background',
            'text_color': 'Color',
            'resize': 'Resize',
            'text_settings': 'Text Settings',
            'edit': 'Edit',
            'close': 'Close',
            'color': 'Color',
            'download': 'Download',
            'print': 'Print',
            'clear_all': 'Clear All',
            'share_facebook': 'Share Facebook',
            'share_instagram': 'Share Instagram'
        },
        //'settings': settings,
        'onSave': null,
        'onUpdate': null,
        'onClose': null,
        'onClearAll': null
    }, options);

    this.options.settings = settings;

    this.onUpdate = function (callback) {
        this.options.onUpdate = callback;
    }
    
    this.onClearAll = function (callback) {
        this.options.onClearAll = callback;
    }

    this.onClose = function (callback) {
        this.options.onClose = callback;
    }

    this.onSave = function (callback) {
        this.options.onSave = callback;
    }

    this.init = function () {
        new DD_Translator(this.options.translator);
        new DD_Settings(this.options.settings);
        new DD_Event();
        var main = new DD_main(this, this.options);
        var app = main.create();
        if (this.options.debug) {
            new DD_Debug(this);
        }

        this.destroy = function () {
            app.destroy();
        }

        this.unselectAll = function () {
            return app.unselectAll();
        }

        this.getData = function () {
            return app.getDataImg();
        }

        this.getMediaId = function () {
            return this.options.media_id;
        }

        this.getProductId = function () {
            return this.options.product_id;
        }

        this.getJson = function () {
            return app.getJsonImg();
        }

        return this;
    }

    return this;
};
})(jQuery);