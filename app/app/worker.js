importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

onmessage = function(event) {
  var nodes = event.data.nodes;
  var links = event.data.links;

  var distance = function(link,index){
    if(link.link.type==="category") {
      return event.data.categoryDistance;
    } else if(link.link.type==="item") {
      return event.data.itemDistance;
    } else if(link.link.type==="media") {
      return  event.data.mediaDistance;
    }
    return 20;
  };

  var strength = function(link,index){
    if(link.link.type==="category") {
      return event.data.categoryStrength;
    } else if(link.link.type==="item") {
      return event.data.itemStrength;
    } else if(link.link.type==="media") {
      return event.data.mediaStrength;
    }
    return 0.8;
  };

  var simulation = d3.forceSimulation(nodes)
    .alphaMin(0.05)
    .alphaDecay(0.05)
    .force("charge", d3.forceManyBody().strength(event.data.chargeStrength))
    .force("link", d3.forceLink(links).distance(distance).strength(strength).iterations(event.data.linkIterations))
    .force("center", d3.forceCenter())
    .force("collide", d3.forceCollide().radius(function(node,index) {
        if(node.node.type==="category") {
          return event.data.categoryRadius;
        } else if(node.node.type==="item") {
          return event.data.itemRadius;
        } else if(node.node.type==="media") {
          return event.data.mediaRadius;
        }
     }).iterations(event.data.collideIterations))

  var n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));

  if(event.data.mobile) {

    simulation.stop()
    for (var i = 0; i < n; ++i) {
      simulation.tick();
      postMessage({ type: "progress", i:i, n:n  });
    }
    postMessage({ type: "end", nodes: nodes, links: links, i:i, n:n  });

  } else {
    var i = 0;
    simulation.on('tick',function(){
      postMessage({ type: "tick", nodes: nodes, links: links, i:i, n:n });
      i += 1;
    })
    simulation.on('end', function(){
      postMessage({ type: "end", nodes: nodes, links: links });
    })
  }
};
