
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
        this.addTab(data[i].label, data[i].id, data[i].focused, data[i].editingLabel)
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

TabViewBar.prototype.addTab = function (label, id, focused, editingLabel) {
    var tabElement = document.createElement('a');
    tabElement.className = [
        mxConstants.TAB_CLASS,
        focused ? mxConstants.TAB_FOCUSED_CLASS : ''
    ].join(' ');
    if(!editingLabel) {
        var labelSpan = document.createElement('div');
        mxUtils.write(labelSpan, label);
        tabElement.appendChild(labelSpan)
    } else {
        var input = this.renderRenameInput(label, id);
        tabElement.appendChild(input);
    }
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


    if(!editingLabel) {
        // TODO: add check for focus
        mxEvent.addListener(tabElement, 'click', mxUtils.bind(this, function (evt) {
            this.focusTab(id);
        }))
    
        mxEvent.addListener(tabElement, 'dblclick', mxUtils.bind(this, function(evt) {
            this.startRenaming(id);
        }))
    }
}

TabViewBar.prototype.renderRenameInput = function(label, id) {
    var element = document.createElement('input');
    
    element.value = label;
    
    element.addEventListener('blur', mxUtils.bind(this, function(evt) {
        this.stopRenaming(id);
        evt.preventDefault();
        evt.stopPropagation();
    }))

    mxEvent.addListener(element, 'keyup', mxUtils.bind(this, function(evt) {
        if(evt.key === 'Enter' || evt.keyCode === 13) {
            this.saveRenaming(id, element.value);
        }
    }))

    return element;
}

TabViewBar.prototype.focusTab = function (id) {
        const eventObject = new mxEventObject(mxConstants.SELECT_TAB_EVENT, 'id', id);
        this.fireEvent(eventObject);
}

TabViewBar.prototype.startRenaming = function(id) {
    const eventObject = new mxEventObject(mxConstants.START_RENAME_TAB_EVENT, 'id', id);
    this.fireEvent(eventObject)
}

TabViewBar.prototype.stopRenaming = function(id) {
    const eventObject = new mxEventObject(mxConstants.STOP_RENAME_TAB_EVENT, 'id', id);
    this.fireEvent(eventObject);
}

TabViewBar.prototype.saveRenaming = function(id, label) {
    const eventObject = new mxEventObject(mxConstants.SAVE_RENAME_TAB_EVENT, 'id', id, 'label', label);
    this.fireEvent(eventObject);
}

