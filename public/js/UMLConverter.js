

function matchBeginning (regex) {
    return function (cell) {
        return cell.getStyle() && cell.getStyle().match(regex);
    }
}

function matchEdge(cell) {
    return cell.edge;
}

var UMLConverter = function(graph, cells) {
    this.cells = this.mapIds(cells);
    this.entities = this.selectElementsByCondition(matchBeginning(/^rounded/));
    this.entitySet = new Set(this.entities);
    this.attributes = this.selectElementsByCondition(matchBeginning(/^ellipse/));
    this.attributeSet = new Set(this.attributes);
    this.edges = this.selectElementsByCondition(matchEdge);
    this.tables = [];
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
    if(!this.tables[entity.id]) {
        this.tables[entity.id] = new Set([ attribute ]);
    } else {   
        this.tables[entity.id].add(attribute);
    }
}

UMLConverter.prototype.registerTables = function() {
    for(var i in this.edges) {
        var edge = this.edges[i];
        if(edge.source && edge.target) {
            var ends = [edge.source, edge.target]
            var attribute = ends.find((elem) => this.isAttribute(elem));
            var entity = ends.find((elem) => this.isEntity(elem));
            if(attribute && entity) {
                this.addAttribute(entity, attribute);
            }
        }
    }
}

UMLConverter.prototype.generateTableCell = function(tableID) {
    var entityCell = this.entities[tableID];
    var entityGeometry = entityCell.getGeometry();
    var tableBuilder = new TableBuilder();
    tableBuilder.createHeaderRow().addCell('key').addCell('name');
    var header = renderHTMLTag(
        'div', 
        { style : "box-sizing:border-box;width:100%;background:#e4e4e4"},
        entityCell.value
    );



    Array.from(this.tables[tableID]).forEach(function (v) { 
        tableBuilder.createRow().addCell('').addCell(v.value);
    });
    var cell = new mxCell(
        header + tableBuilder.renderHTML(),
        new mxGeometry(entityGeometry.x, entityGeometry.y, entityGeometry.width, entityGeometry.height),
        "verticalAlign=top;align=left;overflow=fill;html=1;",
    );
    cell.vertex = true;
    return cell;
}

UMLConverter.prototype.convertTables = function(parent) {
    return this.tables.map((_, id) => console.log(id) || this.generateTableCell(id, parent));    
}

UMLConverter.prototype.convert = function() {
    this.registerTables();
    // const root = new mxCell();
    // const subroot = new mxCell();
    // root.insert(subroot);
    console.log("TABLES", this)

    return this.convertTables()
    // console.log(subroot)
    // return root;
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