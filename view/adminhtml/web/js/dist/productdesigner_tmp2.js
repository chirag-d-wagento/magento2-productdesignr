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
        if (model) {
            return model;
        }
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
        this._super(this.options.id);
        this.selfBase();
        this._add();
    },

    _addElements: function () {

        this._checkbox = $('<input />', {
            id: this.createUUID(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            type: 'checkbox'
        });
        if (this.checked) {
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
        var self = this;
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
        }
        if (fabricObj.layerMask) {
            this.updateMask(group_uid, media_id, fabricObj);
        }
        if (type === 'remove') {
            this.removeLayer(group_uid, media_id, fabricObj);
            return;
        }
        if(fabricObj.type === 'image' || fabricObj.type === 'text') {
            this.updateLayer(group_uid, media_id, fabricObj)
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
        var newImgConf = imgConf.splice(layer.index, 1);
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
    /*
     addEmptyGroupClick: function (obj) {
     var self = this;
     obj.on('click', function () {
     self.addGroup({'group_uid': self.createUUID(), 'imgs': []});
     });
     },
     */

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
    },

    addGroupSaveClick: function (obj) {
        var self = this;
        obj.on('click', function () {
            var groups = self.getGroups();
            console.log(groups);
            var jsonStr = JSON.stringify(groups);

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

var DD_admin_group_image_model = DD_Admin_ImagesSelected_Model.extend({

    setImageSize: function (img, group_id, media_id) {//group_index, media_id, conf
        var sizes = this.getImgSizes(img);
        return this.updateImageConf(group_id, media_id, 'sizes', sizes);
    },

    getImgSizes: function (element) {
        if (element.naturalWidth != undefined && element.naturalWidth != '' && element.naturalWidth != 0) {
            this.width = element.naturalWidth;
            this.height = element.naturalHeight;
        } else if (element.width != undefined && element.width != '' && element.width != 0) {
            this.width = element.width;
            this.height = element.height;
        } else if (element.clientWidth != undefined && element.clientWidth != '' && element.clientWidth != 0) {
            this.width = element.clientWidth;
            this.height = element.clientHeight;
        } else if (element.offsetWidth != undefined && element.offsetWidth != '' && element.offsetWidth != 0) {
            this.width = element.offsetWidth;
            this.height = element.offsetHeight;
        }

        return {
            'width': parseInt(this.width),
            'height': parseInt(this.height)
        }
    },

    clickRemove: function (el) {
        var self = this;
        el.on('click', function () {
            var group = el.attr('data-group');
            var media_id = el.attr('data-remove');
            self.removeImage(group, media_id);

        });
    },
    
    onUpdate: function(fabricObj, group_uid, media_id, type) {
        this.updateImgFabricConf(group_uid, media_id, fabricObj, type);
    },

    clickEdit: function (el, options) {
        var self = this;
        
        var urlUploadImages = this._s('urlUploadImages');
        var percentSizeImage = this._s('percentSizeImage');
        var defaultFontSize = this._s('defaultFontSize');
        var defaultFont = this._s('defaultFont');
        var defualtFontColor = this._s('defualtFontColor');
        var defaultLayerMaskWidth = this._s('defaultLayerMaskWidth');
        var percentSizeFromMask = this._s('percentSizeFromMask');
        var onUpdate = this.onUpdate.bind(this);
        var group_index = el.attr('data-group');
        var listFonts = this._s('listFonts');
        var myFilesPath = this._s('myFilesPath');
        
        el.on('click', function () {
            $('#dd_designer').html('');
            $('#dd_designer').empty();
            var designer = $('#dd_designer').dd_productdesigner({
                'src': options.src,
                'width': options.sizes.width,
                'height': options.sizes.height,

                'sku': options.sku,
                'product_id': options.product_id,
                'media_id': options.media_id,
                'group_index': group_index,
                'mask': options.mask,
                'conf': options.conf,
                'settings': {
                    'urlUploadImages': urlUploadImages,
                    'percentSizeImage': percentSizeImage,
                    'defualtFontColor': defualtFontColor,
                    'defaultFont': defaultFont,
                    'defaultFontSize': defaultFontSize, 
                    'defaultLayerMaskWidth': defaultLayerMaskWidth,
                    'percentSizeFromMask': percentSizeFromMask,
                    'listFonts': listFonts,
                    'myFilesPath': myFilesPath
                }
                
            });
            designer.onUpdate(onUpdate);
            self.getObject().designer = designer.init();
            
            self.getObject().designerMediaId = options.media_id;
            self.getObject().designerGroupId = group_index;
        });
    }

});

var DD_Admin_Image_Model = DD_Admin_ImagesSelected_Model.extend({

    class_selected: 'selected',

    registerImage: function (obj) {
        var imgCnt = obj.self;
        this.data = obj.imgOptions;
        if (this.getImgIndex(this.data.group_index, this.data.media_id) !== false) {
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
    }
});

var DD_Admin_ImagesLoader_Model = DD_ModelBase.extend({
    
    eventShow: 'show-admin-loader',
    eventHide: 'hide-admin-loader',
    
    init: function (obj) {
        this.obj = obj;
        this._super();
    },
    
    _registerEvents: function () {
        this._evnt().register(this.eventShow, this.obj);
        this._evnt().register(this.eventHide, this.obj);
    },
    
    _registerCalls: function(){
        var self = this;
        this._evnt().registerCallback(this.eventShow, function() {
            self.obj
                .get(0)
                .show();
        });
        this._evnt().registerCallback(this.eventHide, function() {
            self.obj
                .get(0)
                .hide();
        });
    }
    
});

var DD_Admin_loadimages_model = DD_Admin_ImagesSelected_Model.extend({

    class_container: 'dd-admin-loadimages-container',
    class_loading: 'dd-admin-loadimages-loading',

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('select_images');
    },

    setWindowContent: function (parent) {
        this.parent = parent;
        var container = new DD_panel({
            'class': this.class_container,
            'parent': parent
        });
        container.add();

        this.container = container.get();
        parent.append(this.container);
        this.loadImages();
    },

    prepareGroupsData: function () {
        var groups = this.getGroups();
        var dataGroups = {};
        if (groups && groups.length) {
            $.each(groups, function (i, group) {
                dataGroups[group.product_id] = group.group_uid;
            });
        }
        return dataGroups;
    },

    loadImages: function () {
        this.showLoading();
        var self = this;
        $.ajax({
            url: this._s('urlLoadImages')
                    + '?form_key=' + window.FORM_KEY,
            data: {
                'product_sku': this._s('psku'),
                'product_id': this._s('product_id'),
                'groups': this.prepareGroupsData()
            },
            success: function (data) {
                if (data.error) {
                    alert(data.errorMessage);
                    return;
                }
                if (data.success && data.parent) {
                    self.container.append($('<h2 />').html(self._('configure_images') + ' ' + data.parent.product_name + '(' + data.parent.psku + ')'));
                    $.each(data.data, function (i, row) {
                        new DD_admin_image_row(self.container, row.imgs, row.extra);
                    });
                }
            },
            error: function () {
                alert("Something went wrong!");
            },
            complete: function () {
                self.hideLoading();
            },
            cache: false
        }, 'json');
    },

    hideLoading: function () {
        this.loading.remove();
    },

    showLoading: function () {
        var loading = new DD_panel({
            'class': this.class_loading,
            'parent': this.container
        });
        loading.add();

        this.loading = loading.get();
    }
});


var DD_admin_group = DD_panel.extend({
    class_name: 'dd-admin-group',
    class_name_remove: 'dd-admin-group-remove fa fa-trash-o',
    class_name_select_img: 'dd-admin-select-img fa fa-picture-o',
    class_img_container: 'dd-admin-group-img-container',
    class_sorting_container: 'dd-admin-group-sorting-container sortable',
    class_sorting_icon: 'dd-admin-group-sorting-icon fa fa-arrows',

    model: 'DD_Admin_ImagesSelected_Model',
    //modelLoadImages: 'DD_Admin_loadimages_model',

    init: function (options) {
        this.options = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },

    _addElements: function () {
        this.addRemove();
        /*this.addSelectImage();*/
        this.addSortingPanel();
        this.addImages();
    },
    
    _callBackModel: function (model) {
        model.removeGroupClick(this.remove.get(0));
    },

    addSortingPanel: function () {
        var sorting = new DD_panel({
            class: this.class_sorting_container,
            parent: this.self
        });
        sorting.add();
        sorting.get().append($('<span />').addClass(this.class_sorting_icon));
    },

    addImages: function () {
        var imgContainer = new DD_panel({
            class: this.class_img_container,
            parent: this.self
        });
        imgContainer.add();

        var index = this.options.index;
        $.each(this.options.data.imgs, function (i, img) {
            img.group_index = index;
            new DD_admin_group_image(imgContainer.get(), img);
        });

        new Sortable(imgContainer.get().get(0), {

        });
    },

    addRemove: function () {
        this.remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });
        this.remove.get(0).attr({
            'data-remove': this.options.index
        });
    },

    /*
    addSelectImage: function () {
        var selectImg = new DD_button({
            'class': this.class_name_select_img,
            'text': this._('image'),
            'parent': this.self,
            'fa': true,
            'windowOpener': true,
            'windowPreview': true,
            'model': this.modelLoadImages

        });
        selectImg.get(0).attr({
            'data-group': this.options.index
        });
    }
    */
});

var DD_admin_loader_images = DD_panel.extend({
    
    class_name: 'dd-admin-designer-container',
    model: 'DD_Admin_ImagesLoader_Model',
    
    init: function (parent) {
        var self = this;
        this.parent = parent;
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    }
     
});

var DD_admin_main = DD_panel.extend({
    
    object_id: 'dd-admin-main-panel',
    class_name: 'dd-admin-main-container',
    
    init: function (parent, options) {
        var self = this;
        this.options = options;
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.addLoader();
        this.addImagesSelectedPanel();
    },
    
    addImagesSelectedPanel: function() {
        this.options.parent = this.self;
        this.modelSelectedImages = new DD_admin_selected_images({
            'parent': this.self,
            'urlImages': this.options.urlImages,
            'product_sku': this.options.psku
        });
    },
    
    addLoader: function() {
        new DD_admin_loader_images(this.self);
    },
    
    getSelectedImagesModel: function() {
        return this.modelSelectedImages;
    }
    
})

var DD_admin_selected_images = DD_panel.extend({
    
    class_name: 'dd-admin-designer-selected',
    model: 'DD_Admin_ImagesSelected_Model',
    class_no_image_selected: 'dd-admin-no-selected',
    class_button_customize: 'dd-admin-images-customize',
    class_group_container: 'dd-admin-group-container',
    groups: null,
    _onComplete: true, 
    
    init: function (options) {
        var self = this;
        this.options  = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },
    
    drawNoImagesSelected: function() {
        if(this.groupsPanel) {
           this.groupsPanel.remove(); 
        }
        if(this.groupContainer){
            this.groupContainer.remove();
        }
        this.p_noimages = $('<p />', {
            id: this.getId(),
            class: this.class_no_image_selected,
            text: this._('default_main_image')
        });
        this.self.append(this.p_noimages);
        this.panelCustomize = new DD_panel({
            'parent': this.self
        });
        this.panelCustomize.add();
        var buttonCustomize = new DD_button({
            'class': this.class_button_customize,
            'text': this._('configure_images'), 
            'parent': this.panelCustomize.get(),
            'fa_addon': 'fa fa-cogs'
        });
        return buttonCustomize.get();
    },
    
    drawCustomizePanel: function() {
        var groupsPanel = new DD_admin_groups_panel({parent: this.self});
        this.groupsPanel = groupsPanel.get();
        
        var groupContainer = new DD_panel({
            'parent': this.self,
            'class': this.class_group_container
        });
        groupContainer.add();
        this.groupContainer = groupContainer.get();
    }
    
});

var DD_admin_groups_panel = DD_panel.extend({
    
    class_name: 'dd-admin-groups-panel',
    model: 'DD_Admin_ImagesSelected_Model',
    
    init: function (options) {
        this.options  = options;
        this._super({
            'class': this.class_name
        });
        this.add();
    },
    
    _addElements: function() {
        this.addEditImgButton();
        this.addClearButton();
        this.addCancelButton();
        this.addSaveButton();
    },
   
    addEditImgButton: function(){
        new DD_admin_image_button(
            this.self
        );
    },
    
    addSaveButton: function(){
        new DD_admin_groupsave_button(
            this.self
        );
    },
    
    addClearButton: function() {
        new DD_admin_clear_button(
            this.self
        );
    },
    
    addCancelButton: function() {
        new DD_admin_groupcancel_button(
            this.self
        );
    }

});

var DD_admin_clear_button = DD_button.extend({
    class_name: 'dd-admin-clear-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('clear_all'),
            fa_addon: ' fa fa-times '
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        model.clearClickEvents(this.self);
    }


});

/*
 * var DD_admin_group_button= DD_button.extend({
    class_name: 'dd-admin-group-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('add_group'),
            fa_addon: 'fa fa-folder-open-o'
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.addEmptyGroupClick(this.self);
    }

});
*/


var DD_admin_group_image = DD_panel.extend({
    model: 'DD_admin_group_image_model',
    class_name_remove: 'dd-admin-image-remove fa fa-trash-o',
    class_name_edit: 'dd-admin-image-edit fa fa-pencil-square-o',

    class_name: 'dd-admin-group-image',

    init: function (imgContainer, options) {
        this.options = options;
        this._super({
            'class': this.class_name,
            'parent': imgContainer
        });
        this.add();
        
    },

    _callBackModel: function (model) {

        var self = this;
        this.img = $('<img />').attr('src', this.options.src)
                .load(function () {
                    self.options = model.setImageSize(this, self.options.group_index, self.options.media_id);
                    self.addRemove();
                    self.addEdit();
                    model.clickEdit(self.edit.get(0), self.options);
                    model.clickRemove(self.remove.get(0));
                });

        this.self.append(this.img);

    },
    
    addRemove: function () {
        if (this.remove) {
            return;
        }
        this.remove = new DD_button({
            'class': this.class_name_remove,
            'text': this._('remove'),
            'parent': this.self,
            'fa': true
        });

        this.remove.get(0).attr({
            'data-remove': this.options.media_id,
            'data-group': this.options.group_index
        });
    },

    addEdit: function () {
        if (this.edit) {
            return;
        }
        this.edit = new DD_button({
            'class': this.class_name_edit,
            'text': this._('edit'),
            'parent': this.self,
            'fa': true
        });

        this.edit.get(0).attr({
            'data-edit': this.options.media_id,
            'data-group': this.options.group_index
        });

    }

});

var DD_admin_groupcancel_button= DD_button.extend({
    class_name: 'dd-admin-groupcancel-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('cancel'),
            fa_addon: 'fa fa-minus-circle'
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        model.addGroupCancelClick(this.self);
    }

});


var DD_admin_groupsave_button= DD_button.extend({
    class_name: 'dd-admin-groupsave-button',
    model: 'DD_Admin_ImagesSelected_Model',

    init: function (parent) {
        var options = {
            parent: parent,
            class: this.class_name,
            text: this._('save'),
            fa_addon: 'fa fa-floppy-o'
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        model.addGroupSaveClick(this.self);
    }

});


var DD_admin_image_button = DD_button.extend({
    model: 'DD_Admin_loadimages_model',
    class_name: 'dd-admin-image-button',

    init: function (parent) {
        this._super({
            'class': this.class_name,
            'parent': parent,
            'text': this._('add_edit_image'),
            'fa_addon': 'fa fa-image',
            'windowOpener': true,
            'windowPreview': true
        });
        
    }

});

var DD_admin_image = DD_panel.extend({  
    class_name: 'dd-admin-product-image',
    class_selected: 'fa fa-check-square-o',
    class_unselected: 'fa fa-square-o',
    model: 'DD_Admin_Image_Model',
    
    init: function (parent, imgOptions) {
        this.imgOptions  = imgOptions;
        
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.addImage(this);
    },
    
    _callBackModel: function (model) {
        model.registerImage(this);
    },
    
    addImage: function(){
        this.img = $('<img />').attr('src', this.imgOptions.src);
        this.self.append(this.img);
        this.addSelectedIcons();
    },
    
    
    addSelectedIcons: function() {
        this.self.append($('<span />').addClass(this.class_selected));
        this.self.append($('<span />').addClass(this.class_unselected));
    }
});
var DD_admin_image_row = DD_panel.extend({

    class_name: 'dd-admin-product-image-row clearfix',

    init: function (parent, imgs, rowOptions) {
        this.imgs = imgs;
        if (rowOptions) {
            this.rowOptions = rowOptions;
            if (!this.rowOptions.group_index || this.rowOptions.group_index == 0) {
                this.rowOptions.group_index = this.createUUID();
            }
        }
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },

    _addElements: function () {
        if (typeof (this.imgs) == 'undefined' || this.imgs.length == 0) {
            this.self.append($('<div />').html(this.rowOptions.no_images_text));
            return;
        }
        this.self.append($('<h3 />').html(this.rowOptions.product_name + '(' + this.rowOptions.psku + ')'));
        this.addImages();
    },

    addImages: function () {
        var me = this;
        $.each(this.imgs, function (i, img) {
            img.group_index = me.rowOptions.group_index;
            new DD_admin_image(me.self, img);
        });
    }
})

$.fn.dd_productdesigner_admin = function (options) {
    this.options = $.extend({
        'urlImages': '',
        'translator': {
            'default_main_image': 'By default shows main product image',
            'configure_images': 'Configure Images',
            'add_group': 'Add Group',
            'clear_all': 'Clear All',
            'cancel': 'Cancel',
            'save': 'Save',
            'remove': 'Remove',
            'image': 'Image',
            'select_images': 'Select Images',
            'edit': 'Edit',
            'add_edit_image': 'Add/Edit Image',
            'configure_images': 'Configure Images'
        },
        
        'settings': {
            'psku': '',
            'urlLoadImages': '',
            'product_id': '',
            'urlUploadImages': '',
            
            'urlSaveData': '',
            'percentSizeImage': '',
            'percentSizeFromMask': 70,
            'defaultFont': 'Verdana,Geneva,sans-serif',
            
            'defualtFontColor': '#ffffff',
            'defaultFontSize': 20,
            'listFonts': [],
            'defaultLayerMaskWidth': 50
        }
    }, options);
    
    new DD_Translator(this.options.translator);
    new DD_Event();
    new DD_Settings(this.options.settings);
    
    new DD_admin_main(this, this.options);
    
    if(this.options.debug) {
        new DD_Debug(this);
    }
    
    
    return this;
    
};
})(jQuery);