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
        this.addTabs();
        this.setEvents();
        var self = this;
        if (this.current && this.model.tabActive) {
            setTimeout(function () {
                self.model.tabActive(self.current.attr('id'), self.currentContent);
            }, 100);
        }
    },

    addTabs: function () {
        this.createTabPanel();
        this.createTabContent();
        for (var a in this.options.tabs) {
            var tab = this.options.tabs[a];
            this.tabsContent[a] = $('<div />')
                    .attr('id', 'content-' + tab.id)
                    .addClass(this.classTabsContent);
            this.tabs[a] = $('<li />')
                    .attr('id', tab.id)
                    .text(tab.text)
                    .attr('data-index', a);
            if (a == 0 && !this.options.activeTab) {
                this.tabs[a].addClass('current');
                this.tabsContent[a].addClass('current');
                this.current = this.tabs[a];
                this.currentContent = this.tabsContent[a];
            }
            this.tabPanel.append(this.tabs[a]);
            this.tabContent.append(this.tabsContent[a]);
        }
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

    setEvents: function () {
        var self = this;
        this.tabPanel.find('li').on('click', function () {
            self.tabPanel.find('.current')
                    .removeClass('current');
            self.tabContent.find('.current')
                    .removeClass('current');
            var index = parseInt($(this).attr('data-index'));
            self.tabsContent[index]
                    .addClass('current');
            $(this).addClass('current');

            if (self.model.tabActive) {
                self.model.tabActive($(this).attr('id'), self.tabsContent[index]);
            }

        });
    }
});
