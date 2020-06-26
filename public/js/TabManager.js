var DEFAULT_UNDO_MANAGER_STATE = {
    history: [],
    indexOfNextAdd: 0
};

TabManager = function (editorUi, container, tabData) {
    this.editorUi = editorUi;
    var root = new mxCell();
    var subRoot = new mxCell();
    root.insert(subRoot);
    this.tabData = tabData || [
        {
            label: 'ER Diagram 1',
            id: 0,
            diagramType: mxConstants.ER_DIAGRAM,
            focused: true,
            importCells: false,
        }, {
            label: 'ER Diagram 2',
            id: 1,
            diagramType: mxConstants.ER_DIAGRAM,
            focused: false,
            importCells : false,
            undoManagerState: this.copyUndoManagerState(),
            modelState: { 
                cells: {
                    0: root,
                    1: subRoot,
                },
                nextId: 2
            }
        },
    ];

    this.focusedTabIndex = 0;

    this.nextTabId = this.tabData.reduce(function (m, tab) { return Math.max(m, tab.id) }, 0) + 1;

    this.tabViewBar = new TabViewBar(container);
    
    setTimeout(mxUtils.bind(this, this.updatePalletes), 0)

    
}

TabManager.prototype.getModel = function() {
    return this.editorUi.editor.graph.model;
}

TabManager.prototype.getUndoManager = function () {
    return this.editorUi.editor.undoManager;
}

TabManager.prototype.copyModelState = function () {
    var model = this.getModel();
    return {
        cells: model.cells,
        nextId: model.nextId,
    }
}

TabManager.prototype.copyUndoManagerState = function() {
    var undoMgr = this.getUndoManager();
    return {
        history: undoMgr.history.slice(0),
        indexOfNextAdd: undoMgr.indexOfNextAdd,
    };
}

TabManager.prototype.getFocusedTab = function() {
    return this.tabData[this.focusedTabIndex];
}

TabManager.prototype.saveCurrentTabState = function () {
    var focusedTab = this.getFocusedTab();
    focusedTab.undoManagerState = this.copyUndoManagerState();
    focusedTab.modelState = this.copyModelState()
}

TabManager.prototype.loadTabState = function ({ undoManagerState, modelState, diagramType }) {
    var undoMgr = this.getUndoManager();
    var model = this.getModel()
    var graph = this.editorUi.editor.graph;
    graph.stopEditing();
    model.beginUpdate();
    if(modelState.importCells) {
        var root = new mxCell(); 
        var mainLayer = new mxCell();
        root.insert(mainLayer);
        model.setRoot(root);
        graph.importCells(modelState.importCells.filter(v =>v), 0, 0, mainLayer);

        delete modelState.importCells;
    } else {
        console.log(modelState)
        model.setRoot(modelState.cells[0]);
        model.nextId = modelState.nextId
    }
    model.endUpdate()
    setTimeout(() => console.log(graph.model.cells) || graph.startEditing(), 0);
    
    undoMgr.history = undoManagerState.history;
    undoMgr.indexOfNextAdd = undoManagerState.indexOfNextAdd;
}


TabManager.prototype.init = function () {
    this.tabViewBar.renderTabs(this.tabData);
    this.listenSelectTab();
    this.listenCloseTab();
}

TabManager.prototype.cloneSelectedTab = function(label) {
    this.saveCurrentTabState();
    var focusedTab = this.getFocusedTab();
    var modelState = focusedTab.modelState;
    var clone = {
        id: this.nextTabId,
        diagramType: focusedTab.diagramType,
        label: label,
        focused: false,
        undoManagerState: {
            history: [],
            indexOfNextAdd: 0,
        },
        modelState: {
            cells: [this.getModel().cloneCell(modelState.cells[0], true)],
            nextId: modelState.nextId,
        }
    }
    console.log(clone.modelState)
    this.tabData.push(clone);
    this.nextTabId++;
    this.tabViewBar.renderTabs(this.tabData);
} 

TabManager.prototype.convertToUml = function(label) {
    this.saveCurrentTabState();
    var modelState = this.getFocusedTab().modelState;
    var converter = new UMLConverter(this.editorUi.editor.graph, modelState.cells);

    var clone = {
        id: this.nextTabId,
        label: label,
        diagramType: mxConstants.UML_DIAGRAM,
        focused: false,
        undoManagerState: {
            history: [],
            indexOfNextAdd: 0,
        },
        modelState: {
            // cells: [this.getModel().cloneCell(modelState.cells[0], true)],
            importCells: converter.convert(),
            nextId: modelState.nextId,
        }
    }
    console.log(clone.modelState)
    this.tabData.push(clone);
    this.nextTabId++;
    this.tabViewBar.renderTabs(this.tabData);
} 

TabManager.prototype.listenSelectTab = function () {
    this.tabViewBar.addListener(mxConstants.SELECT_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        this.saveCurrentTabState();
        var chosenTabIndex = null;
        for (var i in this.tabData) {
            if (this.tabData[i].id === evt.getProperty('id')) {
                chosenTabIndex = i;
            }
            this.tabData[i].focused = this.tabData[i].id === evt.getProperty('id');
        }
        if(chosenTabIndex != this.focusedTabIndex) {
            this.focusedTabIndex = chosenTabIndex;
            this.loadTabState(this.getFocusedTab());
            this.tabViewBar.renderTabs(this.tabData);
            this.updatePalletes();
            this.affectMenuBar(this.getFocusedTab().diagramType)
        }
        console.log(this.getFocusedTab().modelState)
    }));
}

TabManager.prototype.updatePalletes = function() {
    var actions = {
        [mxConstants.UML_DIAGRAM] : mxUtils.bind(this, function () {
            this.editorUi.sidebar.hidePalette('general');
            this.editorUi.sidebar.showPalette('uml');
        }),
        [mxConstants.ER_DIAGRAM]: mxUtils.bind(this, function () {
            this.editorUi.sidebar.showPalette('general');
            this.editorUi.sidebar.hidePalette('uml');
        }),
    }
    actions[this.getFocusedTab().diagramType]();
}

TabManager.prototype.listenCloseTab = function() {
    this.tabViewBar.addListener(mxConstants.CLOSE_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        for (var i in this.tabData) 
            if (this.tabData[i].id === evt.getProperty('id')) {
                if (this.tabData[i].focused) {
                    const focusedIndex = i == 0 ? 1 : 0;
                    this.tabData[focusedIndex].focused = true;
                    this.focusedTabIndex = focusedIndex;
                }
                this.tabData.splice(i, 1);

                break;
            }
        this.loadTabState(this.getFocusedTab())
        this.tabViewBar.renderTabs(this.tabData);
    }));
}

TabManager.prototype.blockConvertEntry = function() {
    console.log(this.editorUi.actions.get('convertToUml'))

    this.editorUi.actions.get('convertToUml').setEnabled(false);
}
TabManager.prototype.unblockConvertEntry = function() {
    this.editorUi.actions.get('convertToUml').setEnabled(true);
}

TabManager.prototype.affectMenuBar = function(diagramType) {
    if (diagramType === mxConstants.UML_DIAGRAM) {
        this.blockConvertEntry();
    } else {
        this.unblockConvertEntry();
    }

}