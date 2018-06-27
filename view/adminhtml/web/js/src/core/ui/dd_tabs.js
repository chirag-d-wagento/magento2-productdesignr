var DD_Tabs = DD_Uibase.extend({
    mainClass: 'tabs-container',
    classTabs: 'tabs',
    classTabsContentContainer: 'tab-content-container',
    classTabsContent: 'tab-content',
    classTabCurrent: 'current',

    isAccordion: false,
    accordionAnimation: 350,

    tabs: {},
    tabsContent: {},

    init: function (options) {
        if (options.isAccordion) {
            this.isAccordion = true;
            this.mainClass += ' accordion';
        }
        this.options = options;
        this._super(this.options.id);
        this.selfBase();
        this._add();
    },

    _addElements: function () {
        this.addTabs();
    },

    _callBackModel: function (model) {
        var self = this;
        this.setEvents(model);
        
        if (this.current && model.tabActive) {
            setTimeout(function () {
                if (!self.isAccordion) {
                    model.tabActive(self.current.attr('id'), self.currentContent);
                }else{
                    self.current.find('.toggle')
                            .trigger('click');
                }
            }, 100);
        }
    },

    addTabs: function () {
        var self = this;
        this.createTabPanel();
        if (!this.isAccordion) {
            this.createTabContent();
        }
        $.each(this.options.tabs, function (a, tab) {
            self.tabsContent[tab.id] = $('<div />')
                    .attr('id', 'content-' + tab.id)
                    .addClass(self.classTabsContent);

            self.tabs[tab.id] = $('<li />')
                    .attr('id', tab.id)
                    //.text(tab.text)
                    .attr('data-index', tab.id);
            
            if (self.isAccordion) {
                self.tabs[tab.id].append($('<a />').text(tab.text).addClass('toggle'));
            } else {
                self.tabs[tab.id].text(tab.text)
            }
            if (a == 0 && !self.options.activeTab) {
                self.tabs[tab.id].addClass('current');
                self.tabsContent[tab.id].addClass('current');
                self.current = self.tabs[tab.id];
                self.currentContent = self.tabsContent[tab.id];
            }
            if (self.isAccordion) {
                self.tabsContent[tab.id].addClass('inner');
                self.tabs[tab.id]
                        .append(self.tabsContent[tab.id]);
            } else {
                self.tabContent.append(self.tabsContent[tab.id]);
            }
            self.tabPanel.append(self.tabs[tab.id]);
            
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
        if (!this.isAccordion) {
            this.tabPanel.find('li').on('click', function () {
                var id = $(this).attr('id');
                if (!self.isAccordion) {
                    self.tabPanel.find('.current')
                            .removeClass('current');
                    self.tabContent.find('.current')
                            .removeClass('current');
                    var index = parseInt($(this).attr('data-index'));
                    self.tabsContent[id]
                            .addClass('current');
                    $(this).addClass('current');
                }

                if (model.tabActive) {
                    model.tabActive(id, self.tabsContent[id]);
                }

            });
        } else {
            this.tabPanel.find('.toggle').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);
                var id = $this.parent().attr('id');
                
                if (model.tabActive) {
                    model.tabActive(id, self.tabsContent[id]);
                }
                if ($this.next().hasClass('show')) {
                    $this.next().removeClass('show');
                    $this.next().slideUp(self.accordionAnimation);
                } else {
                    $this.parent().parent().find('li .inner').removeClass('show');
                    $this.parent().parent().find('li .inner').slideUp(self.accordionAnimation);
                    $this.next().toggleClass('show');
                    $this.next().slideToggle(self.accordionAnimation);
                }
            });
        }
    }
});
