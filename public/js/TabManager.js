var DEFAULT_UNDO_MANAGER_STATE = {
    history: [],
    indexOfNextAdd: 0
};

TabManager = function (editorUi, container, tabData) {
    this.editorUi = editorUi;
    this.capturePoster = editorUi.config.capturePoster;
    this.viewMode = editorUi.config.viewMode;
    var root = new mxCell();
    var subRoot = new mxCell();
    root.insert(subRoot);
    const editor = editorUi.editor;
    if (tabData && tabData.length) {
        const initialSchema = tabData[0].textSchema;
        setTimeout(() => {
            editor.graph.model.beginUpdate();
            this.createImportXmlCallback(initialSchema)()
            editor.graph.model.endUpdate();
        }, 0);
        this.tabData = tabData.map((tabElement, index) => ({
            label: tabElement.label,
            id: index,
            focused: index == 0,
            diagramType: tabElement.diagramType, // TODO: add diagramType to TabData model
            undoManagerState: this.copyUndoManagerState(),
            textSchema: tabElement.textSchema, //delete onload
            modelState: {
                importCells: index !== 0 ? this.createImportXmlCallback(tabElement.textSchema) : null,
                cells: [tabElement.schema],
            }
        }));
    } else {
        this.tabData = [
            {
                label: 'Main',
                id: 0,
                diagramType: mxConstants.ER_DIAGRAM,
                focused: true,
            }, 
        ];
    }



    this.focusedTabIndex = 0;

    this.nextTabId = this.tabData.reduce(function (m, tab) { return Math.max(m, tab.id) }, 0) + 1;

    this.tabViewBar = new TabViewBar(container);

    setTimeout(mxUtils.bind(this, this.updatePalletes), 0)


}

TabManager.prototype.serializeTabs = function () {
    return this.saveCurrentTabState().then(() => Promise.all(this.tabData.map((tab, index) => {
        const encoder = new mxCodec();
        let node = null;
        let currentPoster = Promise.resolve(tab.poster);
        if (index === this.focusedTabIndex) {
            node = encoder.encode(this.getModel());
            currentPoster = this.capturePoster();
        } else if (tab.textSchema) {
            return Promise.resolve({
                schema: tab.textSchema,
                poster: tab.poster,
                title: tab.label,
                type: tab.diagramType
            })
        } else {
            node = encoder.encode(tab.modelState);
        }
        return currentPoster.then((poster) => (
            {
                schema: mxUtils.getPrettyXml(node),
                poster: poster,
                title: tab.label,
                type: tab.diagramType
            }
        ));
    }))
    );
}

TabManager.prototype.createImportXmlCallback = function (xmlSchema) {
    const editor = this.editorUi.editor;
    const schema = mxUtils.parseXml(xmlSchema).documentElement
    return () => {
        editor.setGraphXml(schema);
        editor.setModified(false);
        editor.undoManager.clear();
    }
}

TabManager.prototype.getModel = function () {
    return this.editorUi.editor.graph.getModel();
}

TabManager.prototype.getUndoManager = function () {
    return this.editorUi.editor.undoManager;
}

TabManager.prototype.copyModelState = function () {
    var model = this.getModel();
    const obj = { ...model }
    Object.setPrototypeOf(obj, Object.getPrototypeOf(model));
    return obj;
}

TabManager.prototype.copyUndoManagerState = function () {
    var undoMgr = this.getUndoManager();
    return {
        history: undoMgr.history.slice(0),
        indexOfNextAdd: undoMgr.indexOfNextAdd,
    };
}

TabManager.prototype.getFocusedTab = function () {
    return this.tabData[this.focusedTabIndex];
}

TabManager.prototype.saveCurrentTabState = function () {
    var focusedTab = this.getFocusedTab();
    focusedTab.undoManagerState = this.copyUndoManagerState();
    focusedTab.modelState = this.copyModelState()
    if(!this.viewMode) {
        return this.capturePoster().then((poster) => focusedTab.poster = poster);
    } else {
        return Promise.resolve();
    }
}

TabManager.prototype.loadTabState = function ({ undoManagerState, modelState }) {
    var undoMgr = this.getUndoManager();
    var model = this.getModel()
    var graph = this.editorUi.editor.graph;
    // graph.stopEditing();
    model.beginUpdate();
    if (modelState.importCells) {
        modelState.importCells(graph, model);
        delete modelState.importCells;
    } else {
        model.setRoot(modelState.cells[0]);
        model.nextId = modelState.nextId
    }
    const tab = this.tabData[this.focusedTabIndex];
    if (tab.textSchema) delete tab.textSchema;
    model.endUpdate()
    // graph.startEditing();
    undoMgr.history = undoManagerState.history;
    undoMgr.indexOfNextAdd = undoManagerState.indexOfNextAdd;
}


TabManager.prototype.init = function () {
    this.tabViewBar.renderTabs(this.tabData);
    this.listenSelectTab();
    this.listenCloseTab();
    this.listenStartLabelEdit();
    this.listenStopLabelEdit();
    this.listenSaveLabelEdit();
}

TabManager.prototype.cloneSelectedTab = function (label) {
    this.saveCurrentTabState().then(() => {

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
        this.tabData.push(clone);
        this.selectTab(this.nextTabId)
        this.nextTabId++;
    });
    // this.tabViewBar.renderTabs(this.tabData);
}

TabManager.prototype.convertToUml = function (label) {
    this.saveCurrentTabState().then(() => {

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
        this.tabData.push(clone);
        this.selectTab(this.nextTabId);
        this.nextTabId++;

    })

    // this.tabViewBar.renderTabs(this.tabData);

}

TabManager.prototype.selectTab = function (id) {
    this.saveCurrentTabState().then( () => {
            var chosenTabIndex = null;
            for (var i in this.tabData) {
                if (this.tabData[i].id === id) {
                chosenTabIndex = i;
            }
            this.tabData[i].focused = this.tabData[i].id === id;
            this.tabData[i].editingLabel = false;
        }
        if (chosenTabIndex != this.focusedTabIndex) {
            this.focusedTabIndex = chosenTabIndex;
            this.loadTabState(this.getFocusedTab());
            this.tabViewBar.renderTabs(this.tabData);
            this.updatePalletes();
            this.affectMenuBar(this.getFocusedTab().diagramType)
        }
    });
}

TabManager.prototype.listenSelectTab = function () {
    this.tabViewBar.addListener(mxConstants.SELECT_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        this.selectTab(evt.getProperty('id'))
    }));
}

TabManager.prototype.updatePalletes = function () {
    var actions = {
        [mxConstants.UML_DIAGRAM]: mxUtils.bind(this, function () {
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

TabManager.prototype.listenCloseTab = function () {
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
        this.updatePalletes();
        this.tabViewBar.renderTabs(this.tabData);
    }));
}

TabManager.prototype.blockConvertEntry = function () {

    this.editorUi.actions.get('convertToUml').setEnabled(false);
}
TabManager.prototype.unblockConvertEntry = function () {
    this.editorUi.actions.get('convertToUml').setEnabled(true);
}

TabManager.prototype.affectMenuBar = function (diagramType) {
    if (diagramType === mxConstants.UML_DIAGRAM) {
        this.blockConvertEntry();
    } else {
        this.unblockConvertEntry();
    }

}

TabManager.prototype.listenStartLabelEdit = function () {
    this.tabViewBar.addListener(mxConstants.START_RENAME_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        var id = evt.getProperty('id');
        if (!this.tabData[id].editingLabel) {
            this.tabData[id].editingLabel = true;
        }
        this.tabViewBar.renderTabs(this.tabData);
    }))
}

TabManager.prototype.listenStopLabelEdit = function () {
    this.tabViewBar.addListener(mxConstants.STOP_RENAME_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        var id = evt.getProperty('id');
        this.tabData[id].editingLabel = false;
        this.tabViewBar.renderTabs(this.tabData);
    }));
}

TabManager.prototype.listenSaveLabelEdit = function () {
    this.tabViewBar.addListener(mxConstants.SAVE_RENAME_TAB_EVENT, mxUtils.bind(this, function (_, evt) {
        var id = evt.getProperty('id');
        var label = evt.getProperty('label');
        this.tabData[id].editingLabel = false;
        this.tabData[id].label = label;
        this.tabViewBar.renderTabs(this.tabData);
    }));
}