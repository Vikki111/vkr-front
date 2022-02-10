let graph;

let atlasTimeout;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function processData() {

  if(graph.isForceAtlas2Running())
    graph.killForceAtlas2();

  if(atlasTimeout)
    clearTimeout(atlasTimeout);

  const data = {};

  $('#input').val().split('\n').forEach(function(line){
    if(line.includes(':'))
      data[line.split(':')[0].trim()] = line.split(':')[1].split(',').map(x => x.trim()).filter(x => x);
  });

  const dataKeys = Object.keys(data);
  const added = [];
  const links = [];

  const graphData = {
    nodes:[],
    edges:[]
  };

  dataKeys.forEach(function(key){
    graphData.nodes.push({
      id: key,
      label: key,
      size: 5,
      color: getRandomColor(),
      x:Math.random(),
      y:Math.random(),
    });
    data[key].forEach(function(target){
      if(!dataKeys.includes(target) && !added.includes(target)){
        graphData.nodes.push({
          id: target,
          label: target,
          size: 5,
          color: getRandomColor(),
          x:Math.random(),
          y:Math.random(),
        });
        added.push(target);
      }
      let a = key < target ? key : target;
      let b = key < target ? target : key;
      if(!links.includes(a+''+b)){
       graphData.edges.push({
          id: a+b,
          source: a,
          target: b
        });
        links.push(a+''+b);
      }
    });
  });


  graph.graph.clear().read(graphData);

  graph.settings({
    edgeColor: 'default',
    defaultEdgeColor: '#9E9E9E',
    labelThreshold:0
  });

  graph.camera.goTo({
    x:0,
    y:0,
    ratio:1.1,
    angle:0
  });

  if(dataKeys.length){
    graph.startForceAtlas2({
      iterationsPerRender:1000,
      outboundAttractionDistribution:true
    });

    atlasTimeout = setTimeout(function(){
      graph.killForceAtlas2();
    }, 5000);
  }else{
    graph.refresh();
  }
}



$(document).ready(function(){
  graph = new sigma('container');
  processData();

  let timeout;
  $('#input').on('input', function(){
    clearTimeout(timeout);
    timeout = setTimeout(function(){
      processData();
    }, 500);
  });
});
