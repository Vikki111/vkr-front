let graph;

let atlasTimeout;

let edgeLabels = {};

let greenNodeIds = {};

let greenEdgeIds = {};

let redNodeIds = {};

let selectedEdgeId;

var nId = 0;

function myTest() {
    alert('Welcome to custom js');
}

function processData(test) {

    if (graph.isForceAtlas2Running())
        graph.killForceAtlas2();

    if (atlasTimeout)
        clearTimeout(atlasTimeout);

    const data = {};

    //TODO можно убрать
    //старое добавление вершин
    $('#input').val().split('\n').forEach(function(line) {
        if (line.includes(':'))
            data[line.split(':')[0].trim()] = line.split(':')[1].split(',').map(x => x.trim()).filter(x => x);
    });

    const dataKeys = Object.keys(data);
    const tagIds = [];

    const graphData = {
        nodes: [],
        edges: []
    };


    dataKeys.forEach(function(key) { //добавление вершин слева
        if (!tagIds.includes(key)) { //если их не было еще
            graphData.nodes.push({
                id: key,
                label: key,
                size: 10,
                color: '#00838F',
                x: Math.random(),
                y: Math.random(),
            });
            tagIds.push(key);
        }
        data[key].forEach(function(tag) { //добавление вершин справа
            if (!tagIds.includes(tag)) { //если их не было еще
                graphData.nodes.push({
                    id: tag,
                    label: tag,
                    size: 10,
                    color: '#00695C',
                    x: Math.random(),
                    y: Math.random()
                });
                tagIds.push(tag);
            }
            if (key === tag) {
                graphData.edges.push({ //добавление связей
                    id: key + tag,
                    source: key,
                    size: 12,
                    target: tag,
                    color: '#ccc',
                    hover_color: '#000',
                    type: 'curve'
                });
            } else {
                graphData.edges.push({ //добавление связей
                    id: key + tag,
                    source: key,
                    size: 12,
                    target: tag,
                    color: '#ccc',
                    hover_color: '#000'
                });
            }
        });
    });

    if (edgeLabels != null) {
        console.log('!!!!!');
        graphData.edges.forEach(function(edge) {
            if (edgeLabels[edge.id] != null) {
                edge.label = edgeLabels[edge.id];
            }
        });
    }


    //  graph.graph.clear().read(graphData);

    //  graph.settings({
    //    edgeColor: 'default',
    //    defaultEdgeColor: '#9E9E9E',
    //    labelThreshold:0
    //  });

    //  graph.camera.goTo({
    //    x:0,
    //    y:0,
    //    ratio:1.1,
    //    angle:0
    //  });

    //TODO разобраться
    if (dataKeys.length) {
        graph.startForceAtlas2({
            iterationsPerRender: 1000,
            outboundAttractionDistribution: true
        });

        atlasTimeout = setTimeout(function() {
            graph.killForceAtlas2();
        }, 5000);
    } else {
        graph.refresh();
    }
}


//создание редактора
$(document).ready(function() {

    graph = new sigma({
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },
        settings: {
            doubleClickEnabled: false,
            minEdgeSize: 0.5,
            maxEdgeSize: 7,
            maxNodeSize: 20,
            enableEdgeHovering: true,
            edgeHoverColor: 'edge',
            defaultEdgeHoverColor: '#000',
            edgeHoverSizeRatio: 1,
            edgeHoverExtremities: true,
            labelThreshold: 0,
            edgeLabelSize: 'fixed',
            defaultEdgeLabelSize: 18,
            defaultLabelSize: 20
        }
    });
    var dragListener = sigma.plugins.dragNodes(graph, graph.renderers[0]);

    //  graph = new sigma('container');
    processData();

    //TODO непонятно
    //постоянное чтение из тэга input и выполнение processData
    let timeout;
    $('#input').on('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            processData();
        }, 500);
    });

    //TODO бесполезен сейчас
    //евент двойного клика по ребру
    graph.bind('doubleClickEdge', function(e) {
        console.log(e.data.edge.id);
        selectedEdgeId = e.data.edge.id;
    });

    //евент нажатия правой кнопкой по ребру
    graph.bind('rightClickEdge', function(e) {
        console.log(e.data.edge.id);
        if (e.data.edge.isSelected) {
            e.data.edge.color = '#ccc';
            e.data.edge.isSelected = false;
            if (greenEdgeIds[0] == e.data.edge.id) {
                greenEdgeIds[0] = null;
                $('#inputEdge').val('');
            }
        } else {
            e.data.edge.color = "#0A0"; //зеленый
            e.data.edge.isSelected = true;
            if (greenEdgeIds[0] == null) {
                greenEdgeIds[0] = e.data.edge.id;
            } else {
                graph.graph.edges().forEach(function(edge) {
                    if (edge.id != e.data.edge.id) {
                        edge.color = '#ccc';
                        edge.isSelected = false;
                    }
                });
                greenEdgeIds[0] = e.data.edge.id;
            }
            $('#inputEdge').val(e.data.edge.label);
        }
        graph.refresh();
    });

    //евент нажатия правой кнопкой по вершине
    graph.bind('rightClickNode', function(e) {
        console.log(e.data.node.id);
        if (e.data.node.isSelected) {
            e.data.node.color = "#000";
            e.data.node.isSelected = false;
            if (redNodeIds[0] == e.data.node.id) {
                redNodeIds[0] = null;
            }
        } else {
            e.data.node.color = "#f00"; //красный
            e.data.node.isSelected = true;
            if (redNodeIds[0] == null) {
                redNodeIds[0] = e.data.node.id;
            } else {
                if(existsEdge(redNodeIds[0] + "-" + e.data.node.id) == false) {
                    graph.graph.addEdge({ //добавление связей
                        id: redNodeIds[0] + "-" + e.data.node.id,
                        source: redNodeIds[0],
                        size: 12,
                        target: e.data.node.id,
                        color: '#ccc',
                        hover_color: '#000',
                        type: "arrow"
                    });
                }
                if(existsEdge(e.data.node.id + "-" + redNodeIds[0])) {
                    graph.graph.dropEdge(e.data.node.id + "-" + redNodeIds[0]);
                }
                graph.graph.nodes().forEach(function(node) {
                    if (node.id == e.data.node.id || node.id == redNodeIds[0]) {
                        node.color = '#000';
                        node.isSelected = false;
                    }
                });
                redNodeIds[0] = null;
            }
        }
        graph.refresh();
    });

    //функция проверки наличия вершины по id
    function existsNode(id) {
        graph.graph.nodes().forEach(function(node) {
            if (node.id == id) {
                return true;
            }
        });
        return false;
    }

    //функция проверки наличия ребра по id
    function existsEdge(id) {
        var flag = false;
        graph.graph.edges().forEach(function(edge) {
            if (edge.id == id) {
                flag = true;
            }
        });
        return flag;
    }

    //функция нахождения противоположного ребра
    function existsInverseEdge(id) {
            var flag = false;
            var arrayOfStrings = id.split("-");
            graph.graph.edges().forEach(function(edge) {
                if (edge.id == arrayOfStrings[0]) {
                    flag = true;
                }
            });
            return flag;
        }


    //евент именения названия ребра
    $('#changeEdgeNameButton').click(function() {
        console.log($('#inputEdge').val());
        if(greenEdgeIds[0] != null) {
            graph.graph.edges().forEach(function(edge) {
                if (edge.id == greenEdgeIds[0]) {
                    edge.label = $('#inputEdge').val();
                }
            });
        }
        graph.refresh();

//        edgeLabels[selectedEdgeId] = $('#inputEdge').val();
//        console.log(Object.keys(edgeLabels));
//        console.log(Object.values(edgeLabels));
    });



    //берем тэг конструктора графов
    var dom = document.querySelector('#graph-container canvas:last-child');

    //убираем контекстное меню по нажатю на ПКМ
    dom.addEventListener('contextmenu', event => event.preventDefault());

    //добавление новой вершины
    dom.addEventListener('dblclick', function(e) {

        var x,
            y,
            p,
            id,
            neighbors;

        x = sigma.utils.getX(e) - dom.offsetWidth / 2;
        y = sigma.utils.getY(e) - dom.offsetHeight / 2;

        p = graph.camera.cameraPosition(x, y);
        x = p.x;
        y = p.y;
        var test = ++nId;

        graph.graph.addNode({
            id: test,
            size: 50,
            label: test + "",
            x: x + Math.random() / 10,
            y: y + Math.random() / 10,
            dX: 0,
            dY: 0,
        });
        graph.refresh();
    }, false);

    //удаление вершин
    $('html').keyup(function(e) {
        if (e.keyCode == 46) { //если нажата клавиша delete
            if (redNodeIds[0] != null) {
                graph.graph.dropNode(redNodeIds[0]);
                redNodeIds[0] = null;
            }
            if (greenEdgeIds[0] != null) {
                graph.graph.dropEdge(greenEdgeIds[0]);
                greenEdgeIds[0] = null;
            }
            graph.refresh();
        }
    });

    //распечатка джейсона графа
        $('#save').click(function() {
//            console.log(JSON.stringify({nodes: graph.graph.nodes(), edges: graph.graph.edges()}));
            savejson();
        });

        //POST запрос на бэк, чтобы сохранить json с графом
        async function savejson() {
            let response = await fetch('/savejson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    nodes: graph.graph.nodes(),
                    edges: graph.graph.edges()
                })
            });

            let result = await response.json();
            //         alert(result.toString());
            console.log(result);
        }

});
