$.fx.speeds._default = 300;
var map = null;
var style = null;
var centerGps = [7.8764315,46.9104218]

var nodes = [];
var links = [];

var nodeForId = {};
var nodeIndexForId = {};

var itemForId = {};
var categoryForId = {};
var mediaNodeForId = {};

var currentLanguage = 'en';
var currentItemId;
var currentCategoryId;
var currentMediaNr;
var itemOverlayOpen = false;
var mediaOverlayOpen = false;

var startZoom = 15;
var x1px = 1;
var y1px = 1;
var worker = new Worker("./app/worker.js");

function getCurrentLanguage() { return currentLanguage; }
function setCurrentLanguage(l) { currentLanguage = l; }

function clearCurrent() { currentItemId = null; currentCategoryId = null; currentMediaNr = null; }

function setCurrentItem(itemId) {
  console.log("setCurrentItem", itemId);
  currentItemId = itemId;
}
function getCurrentItem() {
  console.log("getCurrentItem", currentItemId);
  return itemForId[currentItemId];
}

function setCurrentCategory(categoryId) {
  console.log("setCurrentCategory", categoryId);
  currentCategoryId = categoryId;
}
function getCurrentCategory() { return categoryForId[currentCategoryId]; }

function setCurrentMediaNr(mediaNr) {
  console.log("setCurrentMediaNr", mediaNr);
  currentMediaNr = mediaNr;
}
function getCurrentMediaNr() { return currentMediaNr; }

function getCurrentMediaNode() {
  var item = mediaNodeForId[currentItemId];
  var mediaNode = item[currentMediaNr];
  console.log("getCurrentMediaNode", currentItemId, currentMediaNr, item, mediaNode);
  return mediaNode;
}

function categoryVisible() {
  var a = !!currentCategoryId;
  return a;
}
function itemVisible() {
  var a = !!currentItemId;
  var b = !currentMediaNr;
  return a && b;
}
function mediaVisible() {
  var a = !!currentItemId;
  var b = !!currentMediaNr;
  return a && b;
}

var simulationRunning = false;

var zoomScale16 = 0.53;
var zoomScale17 = 0.5;
var zoomScale18 = 0.5;
var zoomScale19 = 0.5;
var zoomScale20 = 0.5;
var zoomScale21 = 0.5;
var zoomScale22 = 0.5;

var mediaRadius15 = mediaRadius * mediaOverlapFactor;
var mediaRadius16 = mediaRadius15 / zoomScale16;
var mediaRadius17 = mediaRadius16 / zoomScale17;
var mediaRadius18 = mediaRadius17 / zoomScale18;
var mediaRadius19 = mediaRadius18 / zoomScale19;
var mediaRadius20 = mediaRadius19 / zoomScale20;
var mediaRadius21 = mediaRadius20 / zoomScale21;
var mediaRadius22 = mediaRadius21 / zoomScale22;

var mediaStop15 = mediaRadius15 / spriteWidth;
var mediaStop16 = mediaRadius16 / spriteWidth;
var mediaStop17 = mediaRadius17 / spriteWidth;
var mediaStop18 = mediaRadius18 / spriteWidth;
var mediaStop19 = mediaRadius19 / spriteWidth; // time for image loading
var mediaStop20 = mediaRadius20 / spriteWidth;
var mediaStop21 = mediaRadius21 / spriteWidth;
var mediaStop22 = mediaRadius22 / spriteWidth;

var mediaStops = {
  15: mediaStop15,
  16: mediaStop16,
  17: mediaStop17,
  18: mediaStop18,
  19: mediaStop19,
  20: mediaStop20,
  21: mediaStop21,
  22: mediaStop22
};

var itemWidth15 = itemRadius * itemOverlapFactor;
var itemWidth16 = itemWidth15 / zoomScale16;
var itemWidth17 = itemWidth16 / zoomScale17;
var itemWidth18 = itemWidth17 / zoomScale18;
var itemWidth19 = itemWidth18 / zoomScale19;
var itemWidth20 = itemWidth19 / zoomScale20;
var itemWidth21 = itemWidth20 / zoomScale21;
var itemWidth22 = itemWidth21 / zoomScale22;

var itemOverlayWidth = {
  15:itemWidth15,
  16:itemWidth16,
  17:itemWidth17,
  18:itemWidth18,
  19:itemWidth19,
  20:itemWidth20,
  21:itemWidth21,
  22:itemWidth22
}

var itemStop15 = itemWidth15 / 10;
var itemStop16 = itemWidth16 / 10;
var itemStop17 = itemWidth17 / 10;
var itemStop18 = itemWidth18 / 10;
var itemStop19 = itemWidth19 / 10;
var itemStop20 = itemWidth20 / 10;
var itemStop21 = itemWidth21 / 10;
var itemStop22 = itemWidth22 / 10;

var itemStops = {
  15: itemStop15,
  16: itemStop16,
  17: itemStop17,
  18: itemStop18,
  19: itemStop19,
  20: itemStop20,
  21: itemStop21,
  22: itemStop22
};

var int15to16 = d3.interpolate(itemWidth15,itemWidth16);
var int16to17 = d3.interpolate(itemWidth16,itemWidth17);
var int17to18 = d3.interpolate(itemWidth17,itemWidth18);
var int18to19 = d3.interpolate(itemWidth18,itemWidth19);
var int19to20 = d3.interpolate(itemWidth19,itemWidth20);
var int20to21 = d3.interpolate(itemWidth20,itemWidth21);
var int21to22 = d3.interpolate(itemWidth21,itemWidth22);


function calcItemWidth(z) {
  var ret = Math.round(itemWidth15);
  if       (z>15 && z<16) {
    ret = Math.round(int15to16(z-15));
  } else if(z>16 && z<17) {
    ret = Math.round(int16to17(z-16));
  } else if(z>17 && z<18) {
    ret = Math.round(int17to18(z-17));
  } else if(z>18 && z<19) {
    ret = Math.round(int18to19(z-18));
  } else if(z>19 && z<20) {
    ret = Math.round(int19to20(z-19));
  } else if(z>20 && z<21) {
    ret = Math.round(int20to21(z-20));
  } else if(z>21 && z<22) {
    ret = Math.round(int21to22(z-21));
  }
  return Math.min(ret, window.innerWidth, window.innerHeight);
}

var mediaStopsMapbox = _.map(mediaStops,function(v,k) {
  return [parseInt(k), v];
});

var itemStopsMapbox = _.map(itemStops,function(v,k) {
  return [parseInt(k), v];
});

function calcNrNewLinesAfter(c1, c2) {
  var a = 0;
  if(c1>=0 && c1 < 5) {
    if(c2>28) { a = 1; } else { a = 0; }
  } else if(c1>=5 && c1 < 8) {
    if(c2<24) { a = 0; } else if (c2>=24 && c2 < 43){ a = 1; } else { a = 2; }
  } else if (c1 >= 8 ) {
    if(c2>50) { a = 3; } else { a = 2; }
  }
  return a;
}

function calcNrNewLinesBefore(c1, c2) {
  var a = 0;
  if(c1>=0 && c1 < 5) {
    a = 3;
  } else if(c1>=5 && c1 < 10) {
    a = 4;
  } else if(c1>=10 && c1 < 15) {
    if(c2>90) { a = 6; } else { a = 5; }
  } else if(c1>=15 && c1 < 20) {
    a = 6;
  } else if(c1>=20 && c1 < 30) {
    if(c2<170) { a = 8; } else if(c2>=170 && c2 < 200) { a = 9; } else if(c2>=200 && c2 < 210) { a = 10; } else if(c2>=210 && c2 < 250) { a = 12; } else if(c2>=250){ a = 13; }
  } else if(c1>=30) {
    if(c2<170) { a = 8; } else if(c2>=170 && c2 < 200) { a = 9; } else if(c2>=200 && c2 < 210) { a = 10; } else if(c2>=210 && c2 < 250) { a = 12; } else if(c2>=250){ a = 13; }
  }
  return a;
}
function updateDataNodes() {
  if(!map) { return; }
  var toGPS = function (p) {
    return [(p[0]*x1px)+centerGps[0],(p[1]*y1px)+centerGps[1]]
  }
  var nodesSource = map.getSource('nodes')
  if(!nodesSource) {return;}
  var spriteData = map.style.sprite.data;
  var nodesFeatures = [];
  _.each(nodes,function(node) {
    var l = getCurrentLanguage();
    var content = node.node['content_preview_'+l]||node.node['content_preview_en']||node.node['content_preview_nl']||node.node['content_preview_de']||"";
    var title = node.node['title_' + l] || node.node['title_en']  || node.node['title_de']  || node.node['title_nl'] || "";
    var caption = node.node['caption_' + l] || node.node['caption_en'] || node.node['caption_de'] || node.node['caption_nl'] || "";
    var readMore = ""
    if(l==="en") {
      readMore = "> READ MORE <";
    } else if(l==="de") {
      readMore = "> MEHR LESEN <";
    } else if(l==="nl") {
      readMore = "> MEER LEZEN <";
    }
    var titleCharCount = title.length;
    var titleWordCount = title.split(" ").length;
    var contentCharCount = content.length;
    var contentWordCount = content.split(" ").length;
    var newlinesBefore = calcNrNewLinesBefore(contentWordCount, contentCharCount);
    var newlinesAfter = calcNrNewLinesAfter(titleWordCount, titleCharCount);
    node.node['content'] = content;
    node.node['title'] = title;
    node.node['caption'] = caption;
    node.node['has_content'] = content.length > 3 ? 'yes': 'no';
    node.node["newlines_before"] = _.reduce(_.range(newlinesBefore), function(ret){ return ret+'\n'; }, "");
    node.node["newlines_after"] = _.reduce(_.range(newlinesAfter), function(ret){ return ret+'\n'; }, "");
    node.node["read_more"] = readMore;
    node.node["info"] = "[" + [titleCharCount, titleWordCount, contentCharCount, contentWordCount, newlinesBefore, newlinesAfter].join(', ') + "]";
    node.node["found"] = "no";
    var gps = toGPS([node.x, node.y]);
    node.node["x"] = node.x;
    node.node["y"] = node.y;
    node.node["gps"] = gps;
    var type = node.node["type"];
    var id = node.node['id'];

    if(type==="item") {
      if(!_.has(itemForId,id)) { itemForId[id] = node.node; }
    } else if(type==="category") {
      if(!_.has(categoryForId,id)) { categoryForId[id] = node.node; }
    } else if(type==="media") {
      var nr = node.node["media_nr"];
      if(!_.has(spriteData, node.node.sprite)) {return;}
      _.set(mediaNodeForId,[id,nr], node.node)
    }

    nodesFeatures.push({
      "type":"Feature",
      "properties": node.node,
      "geometry": {
        "type": "Point",
        "coordinates": gps
      }
    });
  })
  nodesSource.setData({
    type: "FeatureCollection",
    features: nodesFeatures
  });
}
function updateDataLinks() {
  if(!map) { return; }
  var toGPS = function (p) {
    return [(p[0]*x1px)+centerGps[0],(p[1]*y1px)+centerGps[1]]
  }
  var linksSource = map.getSource('links');
  if(!linksSource) { return; }
  linksSource.setData({
    type: "FeatureCollection",
    features: _.map(links,function(link){
      link.link["found"] = "no";
      return {
        "type":"Feature",
        "properties": link.link,
        "geometry": {
          "type": "LineString",
          "coordinates": [toGPS([link.source.x, link.source.y]), toGPS([link.target.x, link.target.y])]
        }
      }
    })
  });
  if(simulationRunning) {
    requestAnimationFrame(updateDataLinks);
  }
}

function simulationProgress(data) {
  $('#progress').html(parseInt((data.i/data.n)*100) + '%')
}

function simulationEnded(data) {
  nodes = data.nodes;
  links = data.links;
  simulationRunning = false;
  requestAnimationFrame(function(){
    updateDataNodes();
    $('#progress').css('visibility', 'hidden');
    historyBoot();
  }.bind(this));
}

function simulationTicked(data) {
  nodes = data.nodes;
  links = data.links;
}

worker.onmessage = function(event) {
  switch (event.data.type) {
    case "tick": return simulationTicked(event.data);
    case "progress": return simulationProgress(event.data);
    case "end": return simulationEnded(event.data);
  }
};

function postNodesAndLinks() {
  var itemNodes = _.map(items,function _map(node, index) {
    return {
      id: node.resource_uri,
      node:_.set(node,'type','item')
    };
  });
  var mediaNodes = [];
  _.each(items,function _map(node, index) {
    _.range(1, 10).map(function _map(k, i2) {
      var url = node['mediafile'+i2];
      if (!url) {
        return;
      }
      var parts = url.split("/");
      var filename = parts[parts.length - 1];
      var base = filename.split(".")[0];
      var ext = filename.split(".")[1];
      var mediatype;
      if(ext === "mp4") {
        mediatype = "video";
      } else if(ext === "mp3") {
        mediatype = "audio";
      } else if(ext === "jpg") {
        mediatype = "image";
      }
      if(_.includes(["video", "audio", "image"], mediatype)) {
        mediaNodes.push({
          id: ''+node.resource_uri+'m'+i2,
          node: {
            id: node.id,
            resource_uri: node.resource_uri,
            mediatype: mediatype,
            mediafile: url,
            media_nr: i2,
            caption_en: node['mediafile_caption_en'+i2],
            caption_nl: node['mediafile_caption_nl'+i2],
            caption_de: node['mediafile_caption_de'+i2],
            aspect_ratio: node['mediafile_aspect_ratio'+i2],
            sprite: base,
            type: "media",
          }
        });
      }
    });
  });
  var categoryNodes = _.map(categories,function _map(node, index) {
    return {
      id: node.resource_uri,
      searchId: node.resource_uri,
      node: _.set(node,'type','category')
    };
  });

  var nodes = _.concat(itemNodes,categoryNodes,mediaNodes);

  _.map(nodes,function _map(node, index) {
    nodeIndexForId[node.id] = index;
    nodeForId[node.id] = node;
    node.index = index;
  });

  var links = [];

  _.each(items,function _map(node) {
    return _.range(1, 10).map(function _map2(k, i2) {
      var url = node['mediafile'+i2];
      var url = node['mediafile'+i2];
      if (!url) {
        return;
      }
      var parts = url.split("/");
      var filename = parts[parts.length - 1];
      var base = filename.split(".")[0];
      var ext = filename.split(".")[1];
      var mediatype;
      if(ext === "mp4") {
        mediatype = "video";
      } else if(ext === "mp3") {
        mediatype = "audio";
      } else if(ext === "jpg") {
        mediatype = "image";
      }
      if(_.includes(["video", "audio", "image"], mediatype)) {
        links.push({
          source: nodeIndexForId[node.resource_uri],
          target: nodeIndexForId[node.resource_uri+'m'+i2],
          link: {type: 'media'}
        });
      }
    });
  });

  _.each(items,function _map(node) {
    _.map(node.categories,function _map(category) {
      links.push({
        source: nodeIndexForId[category],
        target: nodeIndexForId[node.resource_uri],
        link: {type: 'node'}
      });
    });
  });

  _.each(categories,function _map(node, index) {
    if (!node || !node.parent) {
      return null;
    }
    var sourceNode = nodeForId[node.parent];
    var targetNode = nodeForId[node.resource_uri];
    if(sourceNode.node.slug_en=="root"&&filterRoot) {
      return null;
    }
    if(targetNode.node.slug_en=="root"&&filterRoot) {
      return null;
    }
    links.push({
      source: nodeIndexForId[node.parent],
      target: nodeIndexForId[node.resource_uri],
      link: {type: 'category'}
    });
  });
  if(is_safari||is_firefox) {
    $('#progress').css('visibility', 'visible');
  }
  worker.postMessage({
  nodes: nodes,
    links: links,
    mobile: is_safari || is_firefox || mobile,
    itemRadius: itemRadius,
    mediaRadius: mediaRadius,
    itemDistance: itemDistance,
    mediaDistance: mediaDistance,
    categoryDistance: categoryDistance,
    itemStrength: itemStrength,
    mediaStrength: mediaStrength,
    categoryStrength: categoryStrength,
    chargeStrength: chargeStrength,
    collideIterations: collideIterations,
    linkIterations: linkIterations
  });
  simulationRunning = true;
  window.requestAnimationFrame(updateDataLinks)
}

function mapLoaded() {
  var t = map.transform;
  var wh = t.width/2;
  var hh = t.height/2;
  var c1 = map.unproject([wh,hh]);
  var c2 = map.unproject([wh+1,hh+1]);
  startZoom = t.zoom;
  x1px = c2.lng - c1.lng;
  y1px = c1.lat - c2.lat;

  map.addSource('links', {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    },
    maxzoom:22
  });
  map.addSource('nodes', {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    },
    maxzoom:22
  });
  map.addLayer({
    "id": "links_category",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 5.0,
      "line-opacity": {'base':1.3, 'stops': [[15,0.2],[17.0,0.2]]}
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "category"], ["==", "found", "no"]]
  });
  map.addLayer({
    "id": "links_node",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 2.0,
      "line-opacity": {'base':1.3, 'stops': [[15,0.2],[18.0,0.2]]}
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "node"], ["==", "found", "no"]]
  });
  map.addLayer({
    "id": "links_media",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 1,
      "line-opacity": {'base':1.3, 'stops': [[15,0.2],[18.0,0.2]]}
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "media"], ["==", "found", "no"]]
  });

  map.addLayer({
    "id": "nodes_media",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "text-allow-overlap": true,
      "icon-allow-overlap": true,
      "icon-rotation-alignment":"viewport",
      "icon-image": {'stops':[
        [15,"{sprite}"],
        [16,"{sprite}"],
        [17,"{sprite}"],
      ]},
      "icon-size": {
        'base':1.3,
        'stops':mediaStopsMapbox
      },
    },
    "paint": {
      "icon-opacity": {'base':1.3, 'stops': [[15,0.4],[16,0.4],[17,0.7],[18.0,1.0]]},
    },
    "minzoom": 14,
    "maxzoom": 22.1,
    "filter": ["all", ["==", "type", "media"], ["==", "found", "no"]]
  });

  map.addLayer({
    "id": "nodes_category_1",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "text-allow-overlap": true,
      "icon-allow-overlap": true,
      "icon-optional": false,
      "text-field": "{title}",
      "text-size": {'base': 1.3, 'stops': [[15.0, 6], [15.5, 8], [16, 12], [16.5, 16], [17,20], [18, 22]]},
      "text-font": ["Open Sans Bold"]
    },
    "paint": {
      "text-halo-width": 2.5,
      "text-halo-blur": 1.5,
      "text-halo-color": "#FFFFFF",
      "text-opacity": {'base': 1.3, 'stops': [[14,0],[15.0, 0.1], [15.5, 1.0], [17.7,1.0], [17.8,0.0]]}
    },
    "minzoom":14.0,
    "filter": ["all", ["==", "type", "category"], ["==", "found", "no"]]
  });

  map.addLayer({
    "id": "nodes_item",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "text-allow-overlap": true,
      "icon-allow-overlap": true,
      "icon-image": 'item_10',
      "icon-size": {
        'base':1.0,
        'stops':itemStopsMapbox
      }
    },
    "minzoom": 17.0,
    "maxzoom": 22.1,
    "paint": {
      'icon-opacity': { 'base': 1.3, 'stops': [[17.7,0.0], [17.8,1.0]] }
    },
    "filter": ["all", ["==", "type", "item"], ["==", "has_content", "yes"], ["==", "found", "no"]],
  });

  map.addLayer({
    "id": "nodes_item_title2",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "text-field": "{title}{newlines_before}{read_more}{newlines_after}",
      "text-size": 15,
      "text-font": ["Open Sans Bold"],
      "text-justify": "center",
      "text-anchor": "center"
    },
    "minzoom": 16.5,
    "maxzoom": 22.1,
    "paint": {
      "text-color":"black",
      "text-opacity": {'base': 1.3, 'stops': [[17.7, 0.0], [17.8, 1.0]]}
    },
    "filter": ["all", ["==", "type", "item"], ["==", "has_content", "yes"], ["==", "found", "no"]],
  });

  map.addLayer({
    "id": "nodes_item_title2_no_content",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "text-field": "{title}",
      "text-size": 15,
      "text-font": ["Open Sans Bold"],
      "text-justify": "center",
      "text-anchor": "center"
    },
    "minzoom": 16.5,
    "maxzoom": 22.1,
    "paint": {
      "text-color":"black",
      "text-opacity": {'base': 1.3, 'stops': [[17.7, 0.0], [17.8, 1.0]]}
    },
    "filter": ["all", ["==", "type", "item"], ["==", "has_content", "no"], ["==", "found", "no"]],
  });

  map.addLayer({
    "id": "nodes_item_text",
    "source": "nodes",
    "type": "symbol",
    "layout": {
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "text-field": "{content}",
      "text-size": 12,
      "text-justify": "left",
      "text-anchor": "center"
    },
    "minzoom": 16.5,
    "maxzoom": 22.1,
    "paint": {
      "text-opacity": {'base': 1.3,
        'stops': [[17.7, 0.0],
                  [17.8, 1.0]]}
    },
    "filter": ["all", ["==", "type", "item"], ["==", "found", "no"]],
  });

  map.addLayer({
    "id": "links_category_found",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 10.0,
      "line-opacity": 1.0,
      "line-color": "#89cff0",
      "line-blur": 3
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "category"], ["==", "found", "yes"]]
  });
  map.addLayer({
    "id": "links_node_found",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 5.0,
      "line-opacity": 1.0,
      "line-color": "#89cff0",
      "line-blur": 3
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "node"], ["==", "found", "yes"]]
  });
  map.addLayer({
    "id": "links_media_found",
    "source": "links",
    "type": "line",
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-width": 2.0,
      "line-opacity": 1.0,
      "line-color": "#89cff0",
      "line-blur": 3
    },
    "minzoom": is_safari?16:14,
    "filter": ["all",["==", "type", "media"], ["==", "found", "yes"]]
  });

  if(false) {
    map.addLayer({
      "id": "nodes_item_title_info",
      "source": "nodes",
      "type": "symbol",
      "layout": {
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
        "text-field": "{info}",
        "text-size": 25,
        "text-font": ["Open Sans Bold"],
        "text-justify": "center",
        "text-anchor": "center"
      },
      "minzoom": 16.5,
      "maxzoom": 22.1,
      "paint": {
        "text-color":"blue",
        "text-opacity": {'base': 1.3,
          'stops': [[17.7, 0.0],
                    [17.8, 1.0]]}
      },
      "filter": ["all", ["==", "type", "item"], ["==", "has_content", "yes"]],
    });


  }

  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    var done = false;
    _.each(features, function(f) {
      if(f &&
         f.layer &&
         f.layer.id &&
         (f.layer.id === "nodes_media"||
          f.layer.id === "nodes_item_title2"||
          f.layer.id === "nodes_item_text") &&
         f.properties &&
         f.properties.type &&
         f.properties.id &&
         !done) {
          var id = f.properties.id;
          if(f.properties.type === "media"&&f.properties.media_nr) {
            navigateMedia(id, f.properties.media_nr);
            done = true;
          } else if(f.properties.type === "item") {
            navigateItem(id);
            done = true;
          } else if(f.properties.type === "category") {
            navigateCategory(id);
            done = true;
          }
      }
    });
  });
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    var displayPointer = false;
    _.each(features, function(f) {
      if(f && f.layer && f.layer.id && (f.layer.id==="nodes_media"||f.layer.id === "nodes_item_title2"||f.layer.id === "nodes_item_text")) {
        // console.log(JSON.stringify(f, null, 2));
        displayPointer = true;
      }
    });
    map.getCanvas().style.cursor = displayPointer?'pointer':'';
  });

  postNodesAndLinks();
}

function switchLanguage(l) {
  console.log("switchLanguage",l);
  $('#language-en-button').css('font-weight', l==='en' ? 'bolder' : 'normal')
  $('#language-de-button').css('font-weight', l==='de' ? 'bolder' : 'normal')
  $('#language-nl-button').css('font-weight', l==='nl' ? 'bolder' : 'normal')
  setCurrentLanguage(l);

  requestAnimationFrame(updateDataNodes);
}

var navControlAdded = false;
var navControl = new mapboxgl.NavigationControl();
function addNavControl() {
  if(!map) {return;}
  if(navControlAdded) {return;}
  navControlAdded = true;
  map.addControl(navControl);
}
function removeNavControl() {
  if(!map) {return;}
  if(!navControlAdded) {return;}
  navControlAdded = false;
  map.removeControl(navControl);
}

function boot() {
  if(!categories || !items ||!sprite || !style) { return; }

  switchLanguage('en');

  style.sprite = sprite;
  style.glyphs = "mapbox://fonts/mapbox/{fontstack}/{range}.pbf";

  map = new mapboxgl.Map({
    container: 'map',
    style: style,
    center: centerGps,
    zoom: startZoom
  });
  map.on('load', mapLoaded);

  addNavControl();

  $('#language-en-button').click(function() {switchLanguage('en');})
  $('#language-de-button').click(function() {switchLanguage('de');})
  $('#language-nl-button').click(function() {switchLanguage('nl');})

  $('#item-close-overlay').on('mousemove',function(event){
    if(!itemOverlayOpen) {
      return;
    }
    event.stopPropagation();
  });
  $('#item-close-overlay').click(function() {
    event.stopPropagation();
  });
  $('#search-close-button').click(function(){
  });
  $('#search-button').click(function(){
  });
  $('#media-close-button').click(function(){
    History.back();
  });
  $('#item-close-button').click(function(){
    History.back();
  });
  $(".item-overlay-slider").slick({
    variableWidth: true,
    infinite: false,
    arrows: false,
    dots: false
  });
}

d3.json(base_url+"/api/v1/category/?format=json&limit=5000").get(function (a,b) {
  categories = b.objects;
  boot();
});

d3.json(base_url+"/api/v1/item/?format=json&limit=5000").get(function (a,b) {
  items = b.objects;
  boot();
});

d3.json(base_url+"/api/v1/atlas/?format=json&limit=5000").get(function (a,b) {
  var s = _.first(_.filter(b.objects, function _filter(obj,index){
    return obj.pixel_ratio == pixelRatio && obj.sprite_width == spriteWidth;
  }));
  sprite = base_url+s['atlas_map_url'].replace('.json','');
  boot();
})
var u = normalizeStyleURL(mapboxglStyle);

d3.json(u).get(function(a,b) {
  console.log("style", b);
  style = b;
  boot();
})

function navigateHome() {
  console.log('navigateHome');
  History.replaceState({}, "", "/");
}

function showHome() {
  console.log("showHome");
  addNavControl();
  hideMedia();
  hideItem();
}

function navigateItem(itemId) {
  console.log('navigateItem',itemId);
  var node = itemForId[itemId];
  if(!node) {return;}
  var title = node['title_' + getCurrentLanguage()] || node['title_en']  || node['title_de']  || node['title_nl'] || ">EMPTY<";
  History.pushState({itemId:itemId}, document.title + " - " + title, "?item=" + itemId);
}

function hideItem() {
  if(!itemOverlayOpen) { return; }
  itemOverlayOpen = false;
  $('#item-overlay-inner').html('');
  $('#item-overlay-close').css('visibility', 'hidden');
  $('#item-buttons').css('visibility', 'hidden');
  $('#item-overlay-slider-container').css('height','100px').transition({
    height: 0
  }, function(){
    $('#item-overlay-slider-container').css('visibility', 'hidden')
  });
  $('#item-overlay').transition({
    'width': '10px',
    'height': '10px',
    'opacity': 0.0
  }, function() {
    $('#item-close-overlay').transition({
     'background-color': 'rgba(255,255,255,0.0)'
    }, function(){
      $('#item-close-overlay').css('visibility', 'hidden');
      navigateHome();
    });
  })
}

function showItem() {
  console.log("showItem");
  if(itemOverlayOpen) { hideMedia(); return; }
  if(!map) {return;}
  var node = getCurrentItem();
  if(!node) {return;}
  removeNavControl();
  itemOverlayOpen = true;

  var loadContent = function() {
    var title = node['title_' + getCurrentLanguage()] || node['title_en']  || node['title_de']  || node['title_nl'] || ">EMPTY<";
    var setContent = function() {
      var content = node['content_'+getCurrentLanguage()]||node['content_en']||node['content_nl']||node['content_de']||"";
      $('#item-overlay-inner').html('<h2>'+title+'</h2><p>'+ content+'</p>');
    };
    if(node.detail_loaded) {
      setContent();
    } else {
      node.detail_loading = true;
      d3.json(base_url + node.resource_uri + "?format=json").get(function (a,b) {
        node.content_en = b.content_en;
        node.content_nl = b.content_nl;
        node.content_de = b.content_de;
        node.detail_loaded = true;
        node.detail_loading = false;
        setContent();
      });
    }
  }
  var showBox = function() {
    $('#item-overlay').css('width','10px').css('height','10px').css('opacity',0.0)
    $('#item-close-overlay').css('background-color','rgba(255,255,255,0.0)').css('visibility','visible');
    $('#item-close-overlay').transition({
      'background-color':'rgba(255,255,255,0.9)',
    });
    $('#item-overlay').transition({
      opacity: 1.0,
      width: '320px',
      height: '320px'
    }, function(){
      loadContent();
      $('#item-overlay-slider-container').css('height','0px').css('visibility', 'visible').transition({
        height: 100
      });
      $('#item-buttons').css('visibility', 'visible');
    });
  };

  var diff = Math.abs(map.transform.center.lng-node.gps[0]);

  if(diff < 0.00000000001) {
    showBox();
  } else {
    map.flyTo({
      center: node.gps,
      zoom: 19,
      speed: 5,
      curve: 1,
      easing: function(t) {
        if(t>=1) {
          _.delay(showBox,100);
        }
        return t;
      }
    });
  }

  $(".item-overlay-slider").slick('removeSlide', null, null, true);
  _.range(1, 10).map(function _map(k, i2) {
    var url = node['mediafile'+i2];
    if (!url) {
      return;
    }
    var parts = url.split("/");
    var filename = parts[parts.length - 1];
    var base = filename.split(".")[0];
    var ext = filename.split(".")[1];

    var url;
    if(pixelRatio>1) {
      url = base_url+'/media/thumbnails/' + base + '_120.png';
    } else {
      url = base_url+'/media/thumbnails/' + base + '_60.png';
    }
    $(".item-overlay-slider").slick('slickAdd','<div class="slide"><a href="#?item=' + node.id + '&media=' + i2 + '"><div class="slide-number">'+(i2+1)+'</div><img onerror="this.parentNode.style.display=\'none\'" src="'+url+'"/></a></div>');
  });
}

function navigateCategory(categoryId) {
  console.log("navigateCategory",categoryId);
  var node = categoryForId[categoryId];
  if(!node) {return;}
  var title = node['title_' + getCurrentLanguage()] || node['title_en']  || node['title_de']  || node['title_nl'] || ">EMPTY<";
  History.pushState({categoryId:categoryId}, History.options.initialTitle + " - " + title, "?category=" + categoryId);
}

function showCategory() {
  console.log("showCategory");

}

function navigateMedia(itemId,mediaNr) {
  console.log("navigateMedia", itemId, mediaNr);
  var node = itemForId[itemId];
  if(!node) {
    console.error("no item for id",itemId);
    return;
  }
  var title = node['title_' + getCurrentLanguage()] || node['title_en']  || node['title_de']  || node['title_nl'] || ">EMPTY<";
  var captions = {
    en: node['mediafile_caption_en'+mediaNr],
    nl: node['mediafile_caption_nl'+mediaNr],
    de: node['mediafile_caption_de'+mediaNr],
  };
  var caption = captions[getCurrentLanguage()] || "";
  var o = {itemId:itemId,mediaNr:mediaNr}
  console.log("navigateMedia o=", o);
  var fullTitle = History.options.initialTitle  + " - "+(title||caption)
  var url = "?item=" + itemId + "&media=" + mediaNr;
  console.log("navigateMedia", o, fullTitle, url);
  History.pushState(o, fullTitle, url);
}

function hideMedia() {
  console.log("hideMedia");
  if(!mediaOverlayOpen) { return; }
  mediaOverlayOpen = false;

  $('#media-overlay-inner').html('');
  $('#media-overlay').transition({opacity:0.0},500).transition({'visibility': 'hidden'},0);
  $('#media-overlay-header').transition({opacity:0.0},500).transition({'visibility': 'hidden'});
  $('#media-buttons').css('visibility', 'hidden');
}

function showMedia() {
  console.log("showMedia 1");
  var node = getCurrentItem();
  var mediaNode = getCurrentMediaNode();
  if(mediaOverlayOpen) {console.error("showMedia mediaOverlayOpen"); return;}
  if(!node) {console.error("showMedia !node"); return;}
  if(!mediaNode) {console.error("showMedia !mediaNode"); return;}
  if(!map) {console.error("showMedia !map"); return;}
  removeNavControl();
  mediaOverlayOpen = true;

  $('#media-buttons').css('visibility', 'visible');
  var captions = {
    en: node['mediafile_caption_en'+getCurrentMediaNr()],
    nl: node['mediafile_caption_nl'+getCurrentMediaNr()],
    de: node['mediafile_caption_de'+getCurrentMediaNr()],
  };

  var title = node['title_' + getCurrentLanguage()] || node['title_en']  || node['title_de']  || node['title_nl'] || ">EMPTY<";
  var caption = captions[getCurrentLanguage()] || title;
  var mediafile = node['mediafile'+getCurrentMediaNr()];
  var mediafileParts = mediafile.split("/")[2].split(".")
  var mediahash = mediafileParts[0];
  var mediatype = mediafileParts[1];
  var thumbnailUrl = base_url+'/media/thumbnails/' + mediahash + '_960.png';
  $('#media-overlay-header-inner').html(caption);

  if(mediatype==="jpg") {
    $('#media-overlay-inner').html("<img src='" + thumbnailUrl + "'/>");
  } else if(mediatype==="mp4") {
    var videoUrl = base_url+mediafile;
    $('#media-overlay-inner').html("<video controls autoplay><source src=\"" + videoUrl + "\" type=\"video/mp4\"></video>");
  } else if(mediatype==="mp3") {
    var audioUrl = base_url+mediafile;
    $('#media-overlay-inner').html("<img src='" + thumbnailUrl + "'/><div class='audio-wrapper'><audio controls autoplay><source src=\"" + audioUrl + "\" type=\"audio/mpeg\"></audio></div>");
  }

  var showMediaBox = function() {
      $('#media-overlay-header').css('opacity',0).css('visibility', 'visible').transition({
        opacity: 1.0
      },1000)
      $('#media-overlay').css('opacity',0).css('visibility', 'visible').transition({
        opacity: 1.0
      },1000)
  }

  var diff = Math.abs(map.transform.center.lng-mediaNode.gps[0]);

  if(diff < 0.00000000001 || itemOverlayOpen) {
    showMediaBox();
  } else {
    map.flyTo({
      center: mediaNode.gps,
      zoom: 19,
      speed: 5,
      curve: 1,
      easing(t) {
        if(t==1) {
          _.delay(showMediaBox,100);
        }
        return t;
      }
    });
  }
}

function handleUrl(url) {
  var right = url.split('?')[1]
  if(!right) { showHome(); return; }
  var parts = right.split('&');
  clearCurrent();
  _.each(parts, function(p) {
    var kv = p.split('=');
    var k = kv[0];
    var v = kv[1];
    if(k==="item") {
      setCurrentItem(parseInt(v));
    } else if(k==="media") {
      setCurrentMediaNr(parseInt(v));
    } else if(k==="category") {
      setCurrentCategory(parseInt(v));
    }
  });
  var v = [categoryVisible(), mediaVisible(), itemVisible()];
  if(v===[false,false,false]) { showHome(); }
  if(categoryVisible()) { showCategory(); }
  if(mediaVisible()) { showMedia(); }
  if(itemVisible()) { showItem(); }
}

function historyBoot() {
  console.log("historyBoot");
  var right = location.href.split('?')[1]
  if(!right) { return; }
  var parts = right.split('&');
  var itemId, mediaNr, categoryId;
  _.each(parts, function(p) {
    var kv = p.split('=');
    var k = kv[0];
    var v = kv[1];
    if(k==="item") { itemId = parseInt(v); }
    else if(k==="media") { mediaNr = parseInt(v); }
    else if(k==="category") { categoryId = parseInt(v); }
  });
  navigateHome();
  if(itemId&&mediaNr) {
    navigateMedia(itemId, mediaNr);
  } else if(itemId && !mediaNr) {
    navigateItem(itemId);
  }
}

History.Adapter.bind(window,'statechange',function() {
  console.log('historyStateChange');
  var s = History.getState();
  handleUrl(s.url);
});
