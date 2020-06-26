
function TabViewBar(container) {
    this.container = container;
}

mxUtils.extend(TabViewBar, mxEventSource);

TabViewBar.prototype.clear = function () {
    while (this.container.lastElementChild) {
        this.container.removeChild(this.container.lastElementChild);
    }
}

TabViewBar.prototype.renderTabs = function (data) {
    this.clear();
    for (var i = 0; i < data.length; i++) {
        this.addTab(data[i].label, data[i].id, data[i].focused)
    }
}

TabViewBar.prototype.renderDeleteButton = function (parentElement) {
    var closeTabButton = document.createElement('img');
    closeTabButton.setAttribute('src', Dialog.prototype.closeImage);
    closeTabButton.setAttribute('title', mxResources.get('close'));
    closeTabButton.className = mxConstants.CLOSE_BUTTON_CLASS; 
    parentElement.appendChild(closeTabButton);
    return closeTabButton;
}

TabViewBar.prototype.addTab = function (label, id, focused) {
    var tabElement = document.createElement('a');
    tabElement.className = [
        mxConstants.TAB_CLASS,
        focused ? mxConstants.TAB_FOCUSED_CLASS : ''
    ].join(' ');
    var labelSpan = document.createElement('div');
    mxUtils.write(labelSpan, label);
    tabElement.appendChild(labelSpan)
    var closeTabButton = this.renderDeleteButton(tabElement);

    this.container.appendChild(tabElement);

    mxEvent.addListener(closeTabButton, 'click', mxUtils.bind(this, function (evt) {
        const answer = confirm('Are you sure you want to close the tab? The data within the tab will be lost.');
        if (answer) {
            const eventObject = new mxEventObject(mxConstants.CLOSE_TAB_EVENT, 'id', id);
            tabElement.remove();
            this.fireEvent(eventObject);
        }
        evt.preventDefault();
        evt.stopPropagation();
    }));


    mxEvent.addListener(tabElement, 'click', mxUtils.bind(this, function (evt) {
        const eventObject = new mxEventObject(mxConstants.SELECT_TAB_EVENT, 'id', id);
        // tabElement.className = [mxConstants.TAB_CLASS, mxConstants.SELECTED_TAB_CLASS].join(' ');
        this.fireEvent(eventObject);
    }))
}
