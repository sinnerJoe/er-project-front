TabManager = function (editorUi, container, tabData) {
    this.tabData = tabData || [
        {
            label: 'ER Diagram 1',
            id: 0,
            focused: true
        }, {
            label: 'ER Diagram 2',
            id: 1,
            focused: false
        },
    ];

    this.tabViewBar = new TabViewBar(editorUi, container);


    this.editorUi = editorUi;
}

TabManager.prototype.init = function () {
    this.tabViewBar.renderTabs(this.tabData);
    this.listenSelectTab();
    this.listenCloseTab();
}

TabManager.prototype.listenSelectTab = function () {
    this.tabViewBar.addListener(mxConstants.SELECT_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        for (var i in this.tabData) 
            this.tabData[i].focused = this.tabData[i].id === evt.getProperty('id');
        
        this.tabViewBar.renderTabs(this.tabData);
    }));
}

TabManager.prototype.listenCloseTab = function() {
    this.tabViewBar.addListener(mxConstants.CLOSE_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        for (var i in this.tabData) 
            if (this.tabData[i].id === evt.getProperty('id')) {
                if (this.tabData[i].focused) {
                    const focusedIndex = i == 0 ? 1 : 0;
                    this.tabData[focusedIndex].focused = true;
                }
                this.tabData.splice(i, 1);

                break;
            }
        
        this.tabViewBar.renderTabs(this.tabData);
    }));
}