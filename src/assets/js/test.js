let graph;

//let atlasTimeout;

//let edgeLabels = {};

let selectedEdgeIds = {};

let selectedNodeIds = {};

let endNodeIds = {};

//let selectedEdgeId;
//console.log($('#inputEdge').val());


//создание редактора
$(document).ready(function() {

    function ajax(url) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(this.responseText);
          };
          xhr.onerror = reject;
          xhr.open('GET', url);
          xhr.send();
        });
    }

    var studentId = window.location.href.split('graph-editor/')[1];
    if (studentId == null) {
        studentId = window.location.href.split('graph-viewer/')[1];
    }
    ajax("http://localhost:8080/students/graph/"+studentId)
    .then(function(result) {
      if (result == "") {
          mainFunc()
      } else {
          const obj = JSON.parse(result);
          recover(obj);
      }
    })
      .catch(function() {
    });

//data3 = {"nodes":[{"size":50,"label":"1","x":54.51593031012319,"y":-203.4484449595114,"dX":0,"dY":0,"id":1,"read_cam0:size":20,"read_cam0:x":0,"read_cam0:y":0,"renderer1:x":445.5,"renderer1:y":479.5,"renderer1:size":20}],"edges":[]};
function mainFunc() {
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
            defaultLabelSize: 20,
            autoRescale: ['nodeSize', 'edgeSize'],
            zoomingRatio: 5
        }
    });

        //евент нажатия правой кнопкой по ребру
        graph.bind('rightClickEdge', function(e) {
            console.log(e.data.edge.id);
            if (e.data.edge.isSelected) {
                e.data.edge.color = '#ccc';
                e.data.edge.isSelected = false;
                if (selectedEdgeIds[0] == e.data.edge.id) {
                    selectedEdgeIds[0] = null;
                    $('#inputEdge').val('');
                }
            } else {
                e.data.edge.color = "#0000FF"; //зеленый
                e.data.edge.isSelected = true;
                if (selectedEdgeIds[0] == null) {
                    selectedEdgeIds[0] = e.data.edge.id;
                } else {
                    graph.graph.edges().forEach(function(edge) {
                        if (edge.id != e.data.edge.id) {
                            edge.color = '#ccc';
                            edge.isSelected = false;
                        }
                    });
                    selectedEdgeIds[0] = e.data.edge.id;
                }
                $('#inputEdge').val(e.data.edge.label);
            }
            graph.refresh();
        });

        //евент нажатия правой кнопкой по вершине
        graph.bind('rightClickNode', function(e) {
//            console.log(e.data.node.id);
            if (e.data.node.isSelected) { //если вершина была выделена, то убираем выделение
                e.data.node.color = "#000";
                e.data.node.isSelected = false;
                if (selectedNodeIds[0] == e.data.node.id) {
                    selectedNodeIds[0] = null;
                }
            } else { //если была не выделена - выделяем
                e.data.node.color = "#f00"; //красный
                e.data.node.isSelected = true;
                if (selectedNodeIds[0] == null) {
                    selectedNodeIds[0] = e.data.node.id;
                } else {
                    if(existsEdge(selectedNodeIds[0] + "-" + e.data.node.id) == false) { //если не было такого ребра, то добавляем
                        graph.graph.addEdge({ //добавление связей
                            id: selectedNodeIds[0] + "-" + e.data.node.id,
                            source: selectedNodeIds[0],
                            size: 12,
                            target: e.data.node.id,
                            color: '#ccc',
                            hover_color: '#000',
                            type: "arrow"
                        });
                    }
                    if(existsEdge(e.data.node.id + "-" + selectedNodeIds[0])) { //если было обратное ребро, то удаляем его
                        graph.graph.dropEdge(e.data.node.id + "-" + selectedNodeIds[0]);
                    }
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == e.data.node.id || node.id == selectedNodeIds[0]) { //убираем выделение вершины
                            node.color = '#000';
                            node.isSelected = false;
                        }
                    });
                    selectedNodeIds[0] = null;
                }
            }
            graph.refresh();
        });

        //евент нажатия кнопкой по одной и той же вершине вершине
        graph.bind('clickNode', function(e) {
//            console.log(e.data.node.id);
            if (e.data.node.isSelected) { //если вершина была выделена, то добавляем ребро, само на себя
                e.data.node.color = "#000";
                e.data.node.isSelected = false;
                if (selectedNodeIds[0] == e.data.node.id) {
                   if(existsEdge(selectedNodeIds[0] + "-" + e.data.node.id) == false) { //если не было такого ребра, то добавляем
                       graph.graph.addEdge({ //добавление связей
                           id: selectedNodeIds[0] + "-" + e.data.node.id,
                           source: selectedNodeIds[0],
                           size: 12,
                           target: e.data.node.id,
                           color: '#ccc',
                           hover_color: '#000',
                           type: 'curve'
                       });
                     }
                     selectedNodeIds[0] = null;
                }
            }
            graph.refresh();
        });

        //евент именения названия ребра
        $('#changeEdgeNameButton').click(function() {
//            console.log($('#inputEdge').val());
            if(selectedEdgeIds[0] != null) {
                graph.graph.edges().forEach(function(edge) {
                    if (edge.id == selectedEdgeIds[0]) {
                        edge.label = $('#inputEdge').val();
                    }
                });
            }
            graph.refresh();
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
                neighbors,
                commonNodeId;

            x = sigma.utils.getX(e) - dom.offsetWidth / 2;
            y = sigma.utils.getY(e) - dom.offsetHeight / 2;

            p = graph.camera.cameraPosition(x, y);
            x = p.x;
            y = p.y;

        commonNodeId = fillCommonNodeId() + 1;

        if (commonNodeId == 1) {
            graph.graph.addNode({
                id: commonNodeId,
                size: 60,
                label: commonNodeId + "",
                    x: x + Math.random() / 10,
                    y: y + Math.random() / 10,
                    dX: 0,
                    dY: 0,
                });
                graph.refresh();
        }
        graph.graph.addNode({
            id: commonNodeId,
            size: 40,
            label: commonNodeId + "",
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
                if (selectedNodeIds[0] != null && selectedEdgeIds[0] != null) {
                    changeNodeColor(selectedNodeIds[0]);
                    changeEdgeColor(selectedEdgeIds[0]);
                    selectedNodeIds[0] = null;
                    selectedEdgeIds[0] = null;
                }
                if (selectedNodeIds[0] != null) {
                    graph.graph.dropNode(selectedNodeIds[0]);
                    selectedNodeIds[0] = null;
                }
                if (selectedEdgeIds[0] != null) {
                    graph.graph.dropEdge(selectedEdgeIds[0]);
                    selectedEdgeIds[0] = null;
                }
                graph.refresh();
            }
            if (e.keyCode == 13) { //если нажата клавиша enter
                if (selectedNodeIds[0] != null && endNodeIds[0] == null) {
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == selectedNodeIds[0]) {
                            endNodeIds[0] = node.id;
                            node.size = 60;
                            node.color = "#000";
                        }
                    });
                    selectedNodeIds[0] = null;
                }
                if (selectedNodeIds[0] != null && endNodeIds[0] != null && selectedNodeIds[0]==endNodeIds[0]) {
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == selectedNodeIds[0]) {
                            node.size = 40;
                            endNodeIds[0] = null;
                        }
                    });
                    selectedNodeIds[0] = null;
                }
                if (selectedEdgeIds[0] != null) {
                    selectedEdgeIds[0] = null;
                }
                graph.refresh();
            }
            if (e.keyCode == 9) { //если нажата клавиша tab
                graph.graph.nodes().forEach(function(node) {
                    changeNodeColor(node.id);
                });
                graph.graph.edges().forEach(function(edge) {
                    changeEdgeColor(edge.id);
                });
                selectedNodeIds[0] = null;
                selectedEdgeIds[0] = null;
                graph.refresh();
            }
        });

        //распечатка джейсона графа
            $('#save').click(function() {
        //    console.log(JSON.stringify({nodes: graph.graph.nodes(), edges: graph.graph.edges()}));
                savejson();
            });

            //POST запрос на бэк, чтобы сохранить json с графом
            async function savejson() {
            var studentId = window.location.href.split('graph-editor/')[1];
                let response = await fetch('http://localhost:8080/savejson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'student-id':studentId
                    },
                    body: JSON.stringify({
                        nodes: graph.graph.nodes(),
                        edges: graph.graph.edges()
                    })
                });

                let result = await response.json();
//                console.log(result);
            }

            $('#validate').click(function() {
                ajax("http://localhost:8080/graph/validate/"+ studentId)
                    .then(function(result) {
                        if (result == "") {
                            console.log("error");
                        } else {
                            changeNodesColorByIds(result);
                            console.log(result);
                        }
                    }).catch(function() {

                    });
              });


        var dragListener = sigma.plugins.dragNodes(graph, graph.renderers[0]);

}
function recover(data) {
        graph = null;
        graph = new sigma({
            graph: data,
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
                defaultLabelSize: 20,
                autoRescale: ['nodeSize', 'edgeSize'],
                zoomingRatio: 2
            }
        });

        //евент нажатия правой кнопкой по ребру
        graph.bind('rightClickEdge', function(e) {
//            console.log(e.data.edge.id);
            if (e.data.edge.isSelected) {
                e.data.edge.color = '#ccc';
                e.data.edge.isSelected = false;
                if (selectedEdgeIds[0] == e.data.edge.id) {
                    selectedEdgeIds[0] = null;
                    $('#inputEdge').val('');
                }
            } else {
                e.data.edge.color = "#0000FF"; //зеленый
                e.data.edge.isSelected = true;
                if (selectedEdgeIds[0] == null) {
                    selectedEdgeIds[0] = e.data.edge.id;
                } else {
                    graph.graph.edges().forEach(function(edge) {
                        if (edge.id != e.data.edge.id) {
                            edge.color = '#ccc';
                            edge.isSelected = false;
                        }
                    });
                    selectedEdgeIds[0] = e.data.edge.id;
                }
                $('#inputEdge').val(e.data.edge.label);
            }
            graph.refresh();
        });

        //евент нажатия правой кнопкой по вершине
        graph.bind('rightClickNode', function(e) {
//            console.log(e.data.node.id);
            if (e.data.node.isSelected) { //если вершина была выделена, то убираем выделение
                e.data.node.color = "#000";
                e.data.node.isSelected = false;
                if (selectedNodeIds[0] == e.data.node.id) {
                    selectedNodeIds[0] = null;
                }
            } else { //если была не выделена - выделяем
                e.data.node.color = "#f00"; //красный
                e.data.node.isSelected = true;
                if (selectedNodeIds[0] == null) {
                    selectedNodeIds[0] = e.data.node.id;
                } else {
                    if(existsEdge(selectedNodeIds[0] + "-" + e.data.node.id) == false) { //если не было такого ребра, то добавляем
                        if(existsEdge(e.data.node.id + "-" + selectedNodeIds[0])) {
                            graph.graph.addEdge({ //добавление связей
                                id: selectedNodeIds[0] + "-" + e.data.node.id,
                                source: selectedNodeIds[0],
                                size: 12,
                                target: e.data.node.id,
                                color: '#ccc',
                                hover_color: '#000',
                                type: "curvedArrow"
                            });
                        } else {
                            graph.graph.addEdge({ //добавление связей
                                id: selectedNodeIds[0] + "-" + e.data.node.id,
                                source: selectedNodeIds[0],
                                size: 12,
                                target: e.data.node.id,
                                color: '#ccc',
                                hover_color: '#000',
                                type: "arrow"
                            });
                        }
                    }
//                    if(existsEdge(e.data.node.id + "-" + selectedNodeIds[0])) { //если было обратное ребро, то удаляем его
//                        graph.graph.dropEdge(e.data.node.id + "-" + selectedNodeIds[0]);
//                    }
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == e.data.node.id || node.id == selectedNodeIds[0]) { //убираем выделение вершины
                            node.color = '#000';
                            node.isSelected = false;
                        }
                    });
                    selectedNodeIds[0] = null;
                }
            }
            graph.refresh();
        });

        //евент нажатия кнопкой по одной и той же вершине вершине
        graph.bind('clickNode', function(e) {
//            console.log(e.data.node.id);
            if (e.data.node.isSelected) { //если вершина была выделена, то добавляем ребро, само на себя
                e.data.node.color = "#000";
                e.data.node.isSelected = false;
                if (selectedNodeIds[0] == e.data.node.id) {
                   if(existsEdge(selectedNodeIds[0] + "-" + e.data.node.id) == false) { //если не было такого ребра, то добавляем
                       graph.graph.addEdge({ //добавление связей
                           id: selectedNodeIds[0] + "-" + e.data.node.id,
                           source: selectedNodeIds[0],
                           size: 12,
                           target: e.data.node.id,
                           color: '#ccc',
                           hover_color: '#000',
                           type: 'curvedArrow'
                       });
                     }
                     selectedNodeIds[0] = null;
                }
            }
            graph.refresh();
        });

            //евент именения названия ребра
            $('#changeEdgeNameButton').click(function() {
//                console.log($('#inputEdge').val());
                if(selectedEdgeIds[0] != null) {
                    graph.graph.edges().forEach(function(edge) {
                        if (edge.id == selectedEdgeIds[0]) {
                            edge.label = $('#inputEdge').val();
                        }
                    });
                }
                graph.refresh();
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
                neighbors,
                commonNodeId;

            x = sigma.utils.getX(e) - dom.offsetWidth / 2;
            y = sigma.utils.getY(e) - dom.offsetHeight / 2;

            p = graph.camera.cameraPosition(x, y);
            x = p.x;
            y = p.y;

            commonNodeId = fillCommonNodeId() + 1;
            if (commonNodeId == 1) {
                graph.graph.addNode({
                    id: commonNodeId,
                    size: 60,
                    label: commonNodeId + "",
                    x: x + Math.random() / 10,
                    y: y + Math.random() / 10,
                    dX: 0,
                    dY: 0,
                });
            }
            graph.graph.addNode({
                id: commonNodeId,
                size: 40,
                label: commonNodeId + "",
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
                if (selectedNodeIds[0] != null && selectedEdgeIds[0] != null) {
                    changeNodeColor(selectedNodeIds[0]);
                    changeEdgeColor(selectedEdgeIds[0]);
                    selectedNodeIds[0] = null;
                    selectedEdgeIds[0] = null;
                }
                if (selectedNodeIds[0] != null) {
                    graph.graph.dropNode(selectedNodeIds[0]);
                    selectedNodeIds[0] = null;
                }
                if (selectedEdgeIds[0] != null) {
                    graph.graph.dropEdge(selectedEdgeIds[0]);
                    selectedEdgeIds[0] = null;
                }
                graph.refresh();
            }
            if (e.keyCode == 13) { //если нажата клавиша enter
                if (selectedNodeIds[0] != null && endNodeIds[0] == null) {
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == selectedNodeIds[0]) {
                            endNodeIds[0] = node.id;
                            node.size = 60;
                            node.color = "#000";
                        }
                    });
                    selectedNodeIds[0] = null;
                }
                if (selectedNodeIds[0] != null && endNodeIds[0] != null && selectedNodeIds[0]==endNodeIds[0]) {
                    graph.graph.nodes().forEach(function(node) {
                        if (node.id == selectedNodeIds[0]) {
                            node.size = 40;
                            endNodeIds[0] = null;
                        }
                    });
                    selectedNodeIds[0] = null;
                }
                if (selectedEdgeIds[0] != null) {
                    selectedEdgeIds[0] = null;
                }
                graph.refresh();
            }
            if (e.keyCode == 9) { //если нажата клавиша tab
                graph.graph.nodes().forEach(function(node) {
                    changeNodeColor(node.id);
                });
                graph.graph.edges().forEach(function(edge) {
                    changeEdgeColor(edge.id);
                });
                selectedNodeIds[0] = null;
                selectedEdgeIds[0] = null;
                graph.refresh();
            }
        });

        //сохранение графа для студента
            $('#save').click(function() {
        //    console.log(JSON.stringify({nodes: graph.graph.nodes(), edges: graph.graph.edges()}));
                savejson();
            });
            //POST запрос на бэк, чтобы сохранить json с графом
            async function savejson() {
            var studentId = window.location.href.split('graph-editor/')[1];
                let response = await fetch('http://localhost:8080/savejson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'student-id':studentId
                    },
                    body: JSON.stringify({
                        nodes: graph.graph.nodes(),
                        edges: graph.graph.edges()
                    })
                });

                let result = await response.json();
//                console.log(result);
            }

            $('#validate').click(function() {
              ajax("http://localhost:8080/graph/validate/"+ studentId)
                .then(function(result) {
                  if (result == "") {
                      console.log("error");
                  } else {
                      changeNodesColorByIds(result);
                      console.log(result);
                  }
                })
                  .catch(function() {
                });
            });

    var dragListener = sigma.plugins.dragNodes(graph, graph.renderers[0]);

}

    function changeNodesColorByIds(stringToSplit) {
        var array = stringToSplit.split(",");
        array.forEach(function(id) {
            graph.graph.nodes().forEach(function(node) {
                if (node.label == id) {
                    node.color = "#32CD32";
                }
            });
        });
    }

   //функция заполнения сквозного id для нод
    function fillCommonNodeId() {
        if (graph.graph.nodes() != null) {
            var maxValue = 0;
            graph.graph.nodes().forEach(function(node) {
                if (node.id >= maxValue) {
                    maxValue = node.id;
                }
            });
        }
        return maxValue;
    }

        //функция изменения цвета вершины по id
        function changeNodeColor(id) {
            graph.graph.nodes().forEach(function(node) {
                if (node.id == id) {
                    node.color = "#000";
                    node.isSelected = false;
                }
            });
        }

        //функция изменения цвета ребра по id
        function changeEdgeColor(id) {
            graph.graph.edges().forEach(function(edge) {
                if (edge.id == id) {
                    edge.color = "#ccc";
                    edge.isSelected = false;
                }
            });
        }

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


});

/////////////////////////безсполезно сейчас

    //TODO бесполезен сейчас
    //евент двойного клика по ребру
//    graph.bind('doubleClickEdge', function(e) {
//        console.log(e.data.edge.id);
//        selectedEdgeId = e.data.edge.id;
//    });

        //TODO непонятно
        //постоянное чтение из тэга input и выполнение processData кажется не нужно
//        let timeout;
//        $('#input').on('input', function() {
//            clearTimeout(timeout);
//            timeout = setTimeout(function() {
//                processData();
//            }, 500);
//        });


//function processData() {
//
//    if (graph.isForceAtlas2Running())
//        graph.killForceAtlas2();
//
//    if (atlasTimeout)
//        clearTimeout(atlasTimeout);
//
//    const data = {};
//
//    //TODO можно убрать
//    //старое добавление вершин
//    $('#input').val().split('\n').forEach(function(line) {
//        if (line.includes(':'))
//            data[line.split(':')[0].trim()] = line.split(':')[1].split(',').map(x => x.trim()).filter(x => x);
//    });
//
//    const dataKeys = Object.keys(data);
//    const tagIds = [];
//
//    const graphData = {
//        nodes: [],
//        edges: []
//    };
//
//
//    dataKeys.forEach(function(key) { //добавление вершин слева
//        if (!tagIds.includes(key)) { //если их не было еще
//            graphData.nodes.push({
//                id: key,
//                label: key,
//                size: 10,
//                color: '#00838F',
//                x: Math.random(),
//                y: Math.random(),
//            });
//            tagIds.push(key);
//        }
//        data[key].forEach(function(tag) { //добавление вершин справа
//            if (!tagIds.includes(tag)) { //если их не было еще
//                graphData.nodes.push({
//                    id: tag,
//                    label: tag,
//                    size: 10,
//                    color: '#00695C',
//                    x: Math.random(),
//                    y: Math.random()
//                });
//                tagIds.push(tag);
//            }
//            if (key === tag) {
//                graphData.edges.push({ //добавление связей
//                    id: key + tag,
//                    source: key,
//                    size: 12,
//                    target: tag,
//                    color: '#ccc',
//                    hover_color: '#000',
//                    type: 'curve'
//                });
//            } else {
//                graphData.edges.push({ //добавление связей
//                    id: key + tag,
//                    source: key,
//                    size: 12,
//                    target: tag,
//                    color: '#ccc',
//                    hover_color: '#000'
//                });
//            }
//        });
//    });
//
//    if (edgeLabels != null) {
//        graphData.edges.forEach(function(edge) {
//            if (edgeLabels[edge.id] != null) {
//                edge.label = edgeLabels[edge.id];
//            }
//        });
//    }
//
//
//    //  graph.graph.clear().read(graphData);
//
//    //  graph.settings({
//    //    edgeColor: 'default',
//    //    defaultEdgeColor: '#9E9E9E',
//    //    labelThreshold:0
//    //  });
//
//    //  graph.camera.goTo({
//    //    x:0,
//    //    y:0,
//    //    ratio:1.1,
//    //    angle:0
//    //  });
//
//    //TODO разобраться
//    if (dataKeys.length) {
//        graph.startForceAtlas2({
//            iterationsPerRender: 1000,
//            outboundAttractionDistribution: true
//        });
//
//        atlasTimeout = setTimeout(function() {
//            graph.killForceAtlas2();
//        }, 5000);
//    } else {
//        graph.refresh();
//    }
//}
