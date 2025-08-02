var treeData = {
  "name": "Forestprints",
  "type": "root",
  "children": [
    {      
      "name": "Australia",
      "type": "geolocation", 
            "children": [
        { "name": "Eucalyptus Forests",
          "children": [
        { "name": "Location",
          "children": [
        { "name": "Eastern, southern, southwestern, and northern Australia" },
          ]
        },
            
        { "name": "Main feature" ,
              "children": [
        { "name": "Dominated by Eucalyptus species, fire-adapted" },
          ]
        },
        { "name": "Soil" ,
             "children": [
        { "name": "Typically nutrient-poor, sandy/loamy; often acidic, low organic matter" },
          ]
      },
        { "name": "Economic value" ,
          "children": [
        { "name": "Forestry, essential oils (eucalyptus oil), honey production" },
          ]
         },
        { "name": "Fire ecology" ,
          "children": [
        { "name": "Many eucalypts require or benefit from fire to regenerate (epicormic buds, lignotubers, fire-triggered seed release)."}, 
          ]
         },
        { "name": "Ecological threats",
          "children": [
        { "name": "Invasive species (e.g. feral herbivores), fragmentation, changes in fire regimes, myrtle rust fungus, land clearing and logging."}, 
          ]
        },
        { "name": "Predominant Species",
         "children": [
        { "name": "Eucalyptus regnans (Mountain Ash) "},
           { "name": "Eucalyptus globulus (Blue Gum) "},
           { "name": "Eucalyptus marginata (Jarrah)"},
           { "name": "Eucalyptus camaldulensis (River Red Gum)"}
          ]
        },
        { "name": "Endangered Species",
        "children": [
        { "name": "Eucalyptus conglomerata (Swamp Stringybark – threatened tree species)"},
          { "name": "Leadbeater’s Possum (Gymnobelideus leadbeateri)"},
          { "name": "Greater Glider (Petauroides volans)"},
          { "name": "Swift Parrot (Lathamus discolor)"}
                ]
            },
            ]
         },
        { "name": "Tropical Rainforests (Daintree)"},
        { "name": "Temperate Rainforests (Tasmania)"},
        { "name": "Mulga & Acacia Woodlands"}
            
                 ]
    },
              
    {      "name": "Southeast Asia & Oceania",
     "type": "geolocation", 
            "children": [
        { "name": "Dipterocarp Forests (Borneo, Sumatra)"},
        { "name": "Peat Swamp Forests (Indonesia, Malaysia)"},
        { "name": "Mangrove Forests (Indonesia, Philippines, Papua New Guinea)"},
                        ]
    },
   {      "name": "East Asia",
     "type": "geolocation", 
            "children": [
        { "name": "Temperate Deciduous Forests (China, Japan, Korea)"},
        { "name": "Subtropical Evergreen Forests (China, Taiwan)"},
                               ]
    },
      {      "name": "Central & South Asia",
     "type": "geolocation", 
            "children": [
        { "name": "Himalayan Coniferous Forests (Nepal, Bhutan, India)"},
        { "name": "Tropical Dry Forests (India, Sri Lanka)"},
                               ]
    },
    {      "name": "Middle East & North Africa",
     "type": "geolocation", 
            "children": [
        { "name": "Mediterranean Forests (Lebanon, Turkey, Morocco)"},
        { "name": "Saharan Oases Forests (Egypt, Algeria)"}
      ]   
     },
     {      "name": "Sub-Saharan Africa",
     "type": "geolocation", 
            "children": [
        { "name": "Congo Rainforest (DRC, Gabon, Cameroon)"},
        { "name": "Miombo Woodlands (Zambia, Tanzania, Mozambique)"}
      ] 
       },
     {      "name": "North America",
     "type": "geolocation", 
            "children": [
        { "name": "Pacific Temperate Rainforests (Canada, USA)"},
        { "name": "Eastern Deciduous Forests (USA, Canada)"},
        { "name": "Boreal Forests (Canada, Alaska)"}
      ] 
        },
     {      "name": "Central & South America",
     "type": "geolocation", 
            "children": [
        { "name": "Amazon Rainforest (Brazil, Peru, Colombia)"},
        { "name": "Atlantic Forest (Brazil, Paraguay, Argentina)"},
        { "name": "Andean Cloud Forests (Ecuador, Colombia, Peru)"}
      ] 
      }
    ] 
};

// Set the dimensions and margins of the diagram
var margin = {top: 40, right: 120, bottom: 40, left: 120},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the tree container
var svg = d3.select("#tree-container").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the first level (show only main ecosystems initially)
if (root.children) {
  root.children.forEach(collapse);
}

update(root);

// Collapse the node and all its children
function collapse(d) {
  if(d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function update(source) {
  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 200});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", "#023ad9");

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
        return d.children || d._children ? -15 : 15;
      })
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .attr("class", function(d) {
        if (d.data.type === "root") return "main-title";
        if (d.data.type === "ecosystem") return "ecosystem-title";
        return "detail-text";
      })
      .text(function(d) { return d.data.name; })
.each(function(d) {
  if (d.children || d._children) {
    d3.select(this).call(wrap, 200); // Apply wrap only if node has children
  }
});

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', function(d) {
      if (d.data.type === "root") return 8;
      if (d.data.type === "ecosystem") return 6;
      return 4;
    })
    .style("fill", "#023ad9")
    .attr('cursor', 'pointer');

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0};
        return diagonal(o, o);
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal(o, o);
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
    return path;
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
  }
}

// Function to wrap text
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
    
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}