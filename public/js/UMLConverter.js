

function matchBeginning (regex) {
    return function (cell) {
        return cell.getStyle() && cell.getStyle().match(regex);
    }
}

function matchValue (regex) {
    return function (cell) {
        return cell.value && cell.value.match(regex);
    }
}

function conjunction(...matchers) {
    return function(cell) {
        return Array.from(matchers).every(matcher => matcher(cell));
    }
}
 
function typeIs(str) {
    return function (cell) {
        return cell.type === str;
    }
}

function not(matcher) {
    return function(cell) {
        return !matcher(cell);
    }
}

function matchEdge(cell) {
    return cell.edge;
}

function darkenText(text) {
    return text.replace(/color: *#fafafa/g, "color: #000000")
}

function sortCellsByPosition(table1, table2) {
    const geometry1 = table1.geometry;
    const geometry2 = table2.geometry;

    if (geometry2.x > geometry1.x || (geometry2.x == geometry1.x && geometry1.y < geometry2.y)) 
        return 1;
     else if (geometry2.x === geometry1.x && geometry1.y === geometry2.y) 
        return 0;

    return -1;
}

function parseCardinality(text) {
    const cardinalityRe = /(\w*)(\s|<br>)*(\*|\w|\d+):(\*|\w|\d+)/i;
    const match = text.match(cardinalityRe)
    if (match) {
        return {relationship: match[1], indices: [match[3], match[4]] }
    }
    return {relationship: text}
}

function renderUMLCardinality(relationship, indices) {
    return indices[0] + '..' + indices[1] + '<br>' + relationship;
}

function averagePosition(positions) {
    var xSum = 0;
    var ySum = 0;
    for(const {x, y} of positions) {
        xSum += x;
        ySum += y; 
    }
    return {
        x: xSum / positions.length,
        y: ySum / positions.length,
    };
}

var UMLConverter = function(graph, cells) {
    this.cells = this.mapIds(cells);
    
    this.entities = this.selectElementsByCondition(matchBeginning(/^rounded/));
    this.entitySet = new Set(this.entities);
    
    this.attributes = this.selectElementsByCondition(matchBeginning(/^ellipse/));
    this.attributeSet = new Set(this.attributes);
    
    this.associations = this.selectElementsByCondition(conjunction(not(matchValue(mxConstants.IS_A_VALUE)), matchBeginning(/^rhombus;/)));
    this.associationSet = new Set(this.associations)

    this.edgeTextBoxes = this.selectElementsByCondition(matchBeginning(/^text;/));
    this.edgeTextBoxSet = new Set(this.edgeTextBoxes);

    this.specializations = this.selectElementsByCondition(conjunction(matchValue(mxConstants.IS_A_VALUE), matchBeginning(/^rhombus;/)));
    this.specializationSet = new Set(this.specializations);

    this.edges = this.selectElementsByCondition(matchEdge);
    this.umlTables = [];
    this.umlAssociations = { tables: [], attributes: [] };

    this.umlSpecializations = [];

    this.converted = {
        tables: null,
    }
    console.log(graph)
    this.graph = graph;
}

UMLConverter.prototype.isAttribute = function (cell) {
    return this.attributeSet.has(cell);
}

UMLConverter.prototype.isEntity = function (cell) {
    return this.entitySet.has(cell);
}

UMLConverter.prototype.isAssociation = function(cell) {
    return this.associationSet.has(cell);
}

UMLConverter.prototype.isEdgeTextBox = function(cell) {
    return this.edgeTextBoxSet.has(cell);
}

UMLConverter.prototype.isSpecialization = function(cell) {
    return this.specializationSet.has(cell);
}

UMLConverter.prototype.childrenOfEdge = function(edge) {
    // console.log("EDGE", edge)
    // return this.edgeTextBoxes.filter(txtBox => txtBox.parent === edge);
    return (edge.children || []).filter(c => this.isEdgeTextBox(c));
}

UMLConverter.prototype.mapIds = function (cells) {
    var cellMap = [];
    for (var i in cells) {
        cellMap[cells[i].id] = cells[i];
    }
    return cellMap;
}

UMLConverter.prototype.selectElementsByCondition = function (predicate) {
    var elements = [];
    for(var i in this.cells) {
        var cell = this.cells[i];
        if(predicate(cell)) {
            elements[cell.id] = cell;
        }
    }
    return elements;
}

UMLConverter.prototype.addAttribute = function (entity, attribute) {
    if(entity && attribute) {
        this.umlTables[entity.id].add(attribute);
    }
}

UMLConverter.prototype.addUMLEntityToAssociation = function (entity, association, edge) {
    
    const associatedTables = this.umlAssociations.tables;
    if (!associatedTables[association.id]) {
        associatedTables[association.id] = [{edge, id: entity.id}]
    } else {
        if (associatedTables.every(({id}) => id !== entity.id)) {
            associatedTables[association.id].push({edge, id: entity.id});
        } else {
            var entry = associatedTables[association.id];
            entry.recursive = true;
            if(!Array.isArray(entry.edge)) {
                entry.edge = [entry.edge, edge];
            }
        }
    }
}

UMLConverter.prototype.addUMLAttributeToAssociation = function (attribute, association) {
    
    const associationAttributes = this.umlAssociations.attributes;
    if (!associationAttributes[association.id]) {
        associationAttributes[association.id] = new Set([attribute])
    } else {
        associationAttributes[association.id].add(attribute);
    }
}

UMLConverter.prototype.addUMLEntityToSpecialization = function(entity, specialization, edge) {
    let associatedEntities = this.umlSpecializations[specialization.id]

    if(associatedEntities && !associatedEntities.find((v) => v.entity === entity)) {
        associatedEntities.push({entity, edge})
    } else if(!associatedEntities) {
        this.umlSpecializations[specialization.id] = [{ entity, edge}];

    }
}


UMLConverter.prototype.walkConnections = function (isFirstType, isSecondType, callback) {
    for (var i in this.edges) {
        var edge = this.edges[i];
        if (edge.source && edge.target) {
            var ends = [edge.source, edge.target]
            var firstPattern = ends.find(isFirstType);
            var secondPattern = ends.find(isSecondType);
            if (secondPattern && firstPattern) {
                callback(firstPattern, secondPattern, edge);
            }
        }
    }
}

UMLConverter.prototype.initUmlTables = function() {
    this.entities.forEach((cell) => {
        this.umlTables[cell.id] = new Set();
    });
}

UMLConverter.prototype.registerTables = function() {
    var cb = mxUtils.bind(this, this.addAttribute);
    var isAttribute = mxUtils.bind(this, this.isAttribute);
    var isEntity = mxUtils.bind(this, this.isEntity);
    this.initUmlTables();
    this.walkConnections(isEntity, isAttribute, cb);
}

UMLConverter.prototype.registerSpecializations = function () {
    var cb = mxUtils.bind(this, this.addUMLEntityToSpecialization);
    var isEntity = mxUtils.bind(this, this.isEntity);
    var isSpecialization = mxUtils.bind(this, this.isSpecialization);
    this.walkConnections(isEntity, isSpecialization, cb);
}

UMLConverter.prototype.registerAssociations = function () {
    var addEntityToAssoc = mxUtils.bind(this, this.addUMLEntityToAssociation);
    var addAttributeToAssoc = mxUtils.bind(this, this.addUMLAttributeToAssociation);
    var isAssociation = mxUtils.bind(this, this.isAssociation);
    var isAttribute = mxUtils.bind(this, this.isAttribute);
    var isEntity = mxUtils.bind(this, this.isEntity);
    this.walkConnections(isEntity, isAssociation, addEntityToAssoc);
    this.walkConnections(isAttribute, isAssociation, addAttributeToAssoc);
}

UMLConverter.prototype.createUMLTable = function(tableID, usedAttributes) {
    var attributes = Array.from(usedAttributes || this.umlTables[tableID]);
    if(!attributes.length) attributes = [{value: '(No columns)'}];
    var entityCell = this.cells[tableID];
    var entityGeometry = entityCell.getGeometry();
    var tableBuilder = new TableBuilder();
    var keyStyle = {
        style: 'width: 20px;'
    }
    // tableBuilder.createHeaderRow().addCell('key', keyStyle).addCell('name');
    var header = renderHTMLTag(
        'div', 
        { style : "box-sizing:border-box;width:100%;background:#e4e4e4;text-align:center;font-weight:bold;font-size:14pt;border-radius: 5px 5px 0 0;"},
        darkenText(entityCell.value)
    );



    attributes.forEach(function (v) { 
        tableBuilder.createRow().addCell(v.value, { style: 'text-align: center;'});
    });
    var cell = new mxCell(
        header + tableBuilder.renderHTML(),
        new mxGeometry(entityGeometry.x, entityGeometry.y, 200, 40 + attributes.length * 20),
        "verticalAlign=top;align=left;overflow=fill;html=1;rounded=1;",
    );
    cell.vertex = true;
    return cell;
}

UMLConverter.prototype.createUMLAssociationTable = function(associationID) {
    var associatedAttributes = this.umlAssociations.attributes[associationID];

    if(associatedAttributes) {
        const tableAttributes = Array.from(associatedAttributes);
        const associationTable = this.createUMLTable(associationID, tableAttributes);
        const {
            x, y
        } = averagePosition(tableAttributes.map(cell => cell.geometry));
        associationTable.geometry.x = x;
        associationTable.geometry.y = y;
        return associationTable;
    }
    return null;
}

UMLConverter.prototype.createTwoWayUMLAssociation = function(associationID, renderMiddleLabel) {
    var associatedTables = this.umlAssociations.tables[associationID];
    var connectionArray = Array.from(associatedTables);

    var tableArray = connectionArray.map(conn => this.convertedUMLTables[conn.id]).sort(sortCellsByPosition);

    var edgeBuilder = new EdgeBuilder(tableArray[0], tableArray[1] );
    var edges = connectionArray.map(c => c.edge);

    if([edges[0].source, edges[0].target].includes(tableArray[1])) {
        edges = edges.reverse()
    }



    var leftLabel = this.childrenOfEdge(edges[0])[0]; 
    var rightLabel = this.childrenOfEdge(edges[1])[0]
    leftLabel = parseCardinality(leftLabel? leftLabel.value : '');
    rightLabel = parseCardinality(rightLabel? rightLabel.value : '');

    var leftPrinted = rightLabel.indices ? renderUMLCardinality(leftLabel.relationship, rightLabel.indices): leftLabel.relationship;
    var rightPrinted = leftLabel.indices ? renderUMLCardinality(rightLabel.relationship, leftLabel.indices): rightLabel.relationship;

    edgeBuilder.setBeginText(leftPrinted).setEndText(rightPrinted);

    if(renderMiddleLabel) {
        edgeBuilder.setCenterText(this.associations[associationID].value);
    }

    return edgeBuilder.render();

}

UMLConverter.prototype.createMultiAssociation = function (associationID, associationTableCell) {
    var associatedTables = this.umlAssociations.tables[associationID];
    var connectionArray = Array.from(associatedTables);
    var tableArray = connectionArray.map(conn => this.convertedUMLTables[conn.id])
    var positions = tableArray.map(t => t.geometry);
    if(associationTableCell) positions.push(associationTableCell.geometry)
    const { x, y } = averagePosition(positions);
    var renderMiddleLabel = !associationTableCell

    var cell = new mxCell(
        renderMiddleLabel ? darkenText(this.cells[associationID].value) : '', 
        new mxGeometry(x, y, 100, 100), 
        "rhombus;whiteSpace=wrap;html=1;");
    cell.vertex = true;
    var rendered = [{
        cell: cell, 
        labels: [],
    }];

    for(let i = 0; i<tableArray.length; i++ ) {
        const table = tableArray[i];
        const edge = connectionArray[i].edge;
        var centerText = edge.children && edge.children.length ? edge.children.map(c => c.value).join(' ') : '';
        const edgeBuilder = new EdgeBuilder(table, cell).setCenterText(centerText)
        rendered.push(edgeBuilder.render());
    }
    return rendered;
}

UMLConverter.prototype.createRecursiveUMLAssociation = function(associationID, renderMiddleLabel) {
    var {edge, id} = this.umlAssociations.tables[associationID][0];
    var umlTable = this.convertedUMLTables[id];
    var label = this.cells[associationID].value

    // var label = (this.childrenOfEdge(edge) || []).map(l => l.value).join(' ');

    var edgeBuilder = new EdgeBuilder(umlTable, umlTable)
    if(label && renderMiddleLabel) edgeBuilder.setCenterText(label);

    if(edge[0].children && edge[0].children.length) {
        edgeBuilder.setBeginText(edge[0].children[0].value);
    }
    if(edge[1].children && edge[1].children.length) {
        edgeBuilder.setBeginText(edge[1].children[1].value);
    }

    return [ edgeBuilder.render() ];

}

UMLConverter.prototype.createUMLAssociation = function(associationID) {

    var associatedTables = Array.from(this.umlAssociations.tables[associationID] || [])

    var associationTableCell = this.createUMLAssociationTable(associationID);

    var generatedCells = [];
    if(associatedTables.length === 2) {
        generatedCells = [this.createTwoWayUMLAssociation(associationID, !associationTableCell)];
    } else if(associatedTables.length > 2) {
        generatedCells = this.createMultiAssociation(associationID, associationTableCell);
    } else if(associatedTables.length === 1 && associatedTables[0].recursive) {
        generatedCells = this.createRecursiveUMLAssociation(associationID, !associationTableCell);
    }

    if(associationTableCell) {
        generatedCells[0].table = associationTableCell;
        generatedCells[0].tableEdge = new EdgeBuilder(associationTableCell, generatedCells[0].cell).makeDashed().render().cell; 
    }

    console.log(generatedCells)

    return generatedCells;

}

UMLConverter.prototype.createUMLSubclass = function(specializationID) {
    var associatedTables = this.umlSpecializations[specializationID] || [];
    console.log("TABLES", associatedTables)
    if(associatedTables.length < 2) return null;

    let subclass = associatedTables[1].entity;
    let parentClass = associatedTables[0].entity;
    
    // table1 is the subclass
    if(associatedTables[0].edge.source === associatedTables[0].entity) {
        const aux = subclass;
        subclass = parentClass;
        parentClass = aux;

    }

    console.log("SUBCLASS", subclass, "parentClass", parentClass)

    const edgeBuilder = new EdgeBuilder(this.convertedUMLTables[subclass.id], this.convertedUMLTables[parentClass.id]).makeSubclass();

    const subclassEdge = edgeBuilder.render().cell;
    subclassEdge.value = ' ';

    return subclassEdge

}  



UMLConverter.prototype.convertTables = function() {
    return this.umlTables.reduce((acc, _, id) => { acc[id] = this.createUMLTable(id); return acc; }, {});    
}

UMLConverter.prototype.convertAssociations = function() {
    return this.umlAssociations.tables
           .map((_, id) => this.createUMLAssociation(id))
           .reduce((acc, arr) => acc.concat(arr), []);
}

UMLConverter.prototype.convertSubclasses = function () {
    return this.umlSpecializations.map((_, index) => this.createUMLSubclass(index)).filter(v => !!v);
}



UMLConverter.prototype.convert = function() {
    this.registerTables();
    this.registerAssociations();
    this.registerSpecializations();

    this.convertedUMLTables = this.convertTables();
    this.convertedUMLAssociations = this.convertAssociations();
    this.convertedUMLSubclasses = this.convertSubclasses();
    console.log(this.convertedUMLSubclasses)

    return mxUtils.bind(this, function (graph, model) {
        var tableCells = Object.values(this.convertedUMLTables)
        var associationEdges = this.convertedUMLAssociations.map(v => v.cell)
        var associationTables = this.convertedUMLAssociations
                                .filter(v => v.table)
                                .map(v => [v.tableEdge, v.table])
                                .reduce((acc, cells) => acc.concat(cells), []);
        console.log('Assoc tables', associationTables)
        var root = new mxCell();
        var mainLayer = new mxCell();
        root.insert(mainLayer);
        model.setRoot(root);
        graph.addCells(tableCells.concat(associationEdges));
        graph.addCells(associationTables)
        graph.addCells(this.convertedUMLSubclasses);


        for(const { cell, labels } of this.convertedUMLAssociations) {
            if(labels.length) {
                graph.addCells(labels, cell);
                graph.fireEvent(new mxEventObject('textInserted', 'cells', labels));
                labels.forEach((v) => graph.autoSizeCell(v));
            }
            // if(table) {
            //     graph.addCells([table, tableEdge])
            // }
        }
    })
}




function renderProps(props) {
    var result = []
    for(var prop in props) {
        result.push(prop + '="' + props[prop] + '"');
    }
    if(result.length) {
        return ' ' + result.join(' ');
    } else {
        return '';
    }
}

function renderHTMLTag(tag, props, content) {
    return '<' + tag + renderProps(props) + '>' + content + '</' + tag + '>';
}

var TableBuilder = function() {
    this.rows = [];
    this.headerRows = [];
    this.props = {
        style : 'width:100%;font-size:1em;',
        cellpadding: "2",
        cellspacing: 0,
        "border-collapse": 'collapse',
    }
}

TableBuilder.prototype.createRow = function () {
    var row = new RowBuilder('td');
    this.rows.push(row);
    return row;
} 

TableBuilder.prototype.createHeaderRow = function () {
    var row = new RowBuilder('th');
    this.rows.push(row);
    return row;
}

TableBuilder.prototype.setProp = function (key, value) {
    this.props[key] = value;
    return this;
}

TableBuilder.prototype.renderHTML = function () {
    var header = this.headerRows.map(function(row) { return row.renderHTML(); }).join('');
    var body = this.rows.map(function(row) { return row.renderHTML(); }).join('');
    var headerOuterHTML = header ? renderHTMLTag('thead', {}, header) : '';
    var bodyOuterHTML = body ? renderHTMLTag('tbody', {}, body) : '';
    return renderHTMLTag('table', this.props, headerOuterHTML + bodyOuterHTML);
}



var RowBuilder = function(cellTag) {
    this.cells = []
    this.props = {};
    this.cellTag = cellTag; 
}

RowBuilder.prototype.setProp = function(key, value) {
    this.props[key] = value;
    return this;
}

RowBuilder.prototype.addCell = function (value, props = {}) {
    this.cells.push({
        value: value,
        props: props,
    })
    return this;
}

RowBuilder.prototype.renderHTML = function () {
    var content = [];
    for(var i in this.cells) {
        var cell = this.cells[i];
        content.push(renderHTMLTag(this.cellTag, cell.props, cell.value));
    }
    return renderHTMLTag('tr', this.props, content.join(''));
}


var TEXT_MARGIN_OFFSET = 0.15 
var EdgeBuilder = function (source, target) {
    this.centerText = null;
    this.beginText = null;
    this.endText = null;
    this.source = source;
    this.target = target;
    this.style = 'endArrow=none;edgeStyle=orthogonalEdgeStyle;html=1;';

}

EdgeBuilder.prototype.setCenterText = function (txt) { 
    this.centerText = txt;
    return this;
}

EdgeBuilder.prototype.setBeginText = function (txt) { 
    this.beginText = txt;
    return this;
}

EdgeBuilder.prototype.setEndText = function (txt) { 
    this.endText = txt;
    return this;
}

EdgeBuilder.prototype.renderLabel = function(text, offset) {
    var geometry = new mxGeometry(offset,0,0,0);
    geometry.offset = new mxPoint(0,0);
    geometry.relative = true;
    var cell = new mxCell();
    cell.value = darkenText(text);
    cell.geometry = geometry;
    cell.style = "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];labelBackgroundColor=#ffffff;"
    cell.vertex = true;
    cell.connectable = false;
    return cell;
}

EdgeBuilder.prototype.makeDashed = function () {
    this.style = 'endArrow=none;dashed=1;html=1;edgeStyle=orthogonalEdgeStyle;';
    return this;
}

EdgeBuilder.prototype.makeSubclass = function () {
    this.style = 'endArrow=block;endSize=16;endFill=0;html=1;edgeStyle=orthogonalEdgeStyle;';
    return this;
}

EdgeBuilder.prototype.render = function () {
    var geometry = new mxGeometry();
    geometry.relative = true;
    var umlCell = new mxCell(null, geometry, this.style);
    umlCell.edge = true
    umlCell.source = this.target;
    umlCell.target = this.source;

    var result = { cell: umlCell, labels: [] }

    if(this.beginText && this.beginText.trim()) {
        result.labels.push(this.renderLabel(this.beginText, -1 + TEXT_MARGIN_OFFSET))
    }

    if(this.endText && this.endText.trim()) {
        result.labels.push(this.renderLabel(this.endText, 1 - TEXT_MARGIN_OFFSET))
    }

    if(this.centerText && this.centerText.trim()) {
        result.labels.push(this.renderLabel(this.centerText, 0 - TEXT_MARGIN_OFFSET  * 2))
    }

    return result;
}

