var config = {
  'linkDistance': 100,
  'charge': -500,
  'gravity': 0.05
};

var width = 1200,
    height = 700;

var color = d3.scale.category10();

// Links Array
var links = [
    { source: 'Cat', target: 'Animal', value: 100 },
    { source: 'Dog', target: 'Animal', value: 4 },
    { source: 'Wolf', target: 'Animal', value: 60 },
    { source: 'Kitten', target: 'Animal', value: 6 },
    { source: 'Whale', target: 'Animal', value: 6 },
    { source: 'Max', target: 'Cat', value: 3 },
    { source: 'Fred', target: 'Cat', value: 6 },
    { source: 'George', target: 'Cat', value: 6 },
    { source: 'Marty', target: 'Wolf', value: 6 },
    { source: 'Vector', target: 'Wolf', value: 100 },
    { source: 'Spike', target: 'Dog', value: 6 },
    { source: 'Bruce', target: 'Whale', value: 6 },
    { source: 'George', target: 'Wolf', value: 6 },
    { source: 'Billy', target: 'Cat', value: 5},
    { source: 'Billy', target: 'Dog', value: 5},
    { source: 'Billy', target: 'Wolf', value: 5},
    { source: 'Spike', target: 'Animal', value: 3}
];

// Create empty nodes array (need to append fixed category items first)

var nodes = {
  "Animal": { name: 'Animal', group: 3 },
  "Wolf": { name: "Wolf", group: 2 },
  "Dog": { name: "Dog", group: 2 },
  "Cat": { name: "Cat", group: 2 },
  "Kitten": { name: "Kitten", group: 2 },
  "Whale": { name: "Whale", group: 2 },
};

// Compute nodes from links data (create new node if needed)
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = { name: link.source, group: 1 });
    link.target = nodes[link.target] || (nodes[link.target] = { name: link.target, group: 1 });
    // link.value = +link.value;
});

// Setup Canvas
var svg = d3.select('.container').append('svg')
    .attr('width', width)
    .attr('height', height);

// Draw Force Graph
var force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .charge(config.charge)
    .gravity(config.gravity)
    .on("tick", tick)
    .linkDistance(config.linkDistance) // function(d) { return  d.value; }
    .start();

// EDGES
var link = svg.selectAll('.link')
     .data(links)
     .enter().append('line')
     .attr('class', 'link');

// ----------------------------------------------

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
    return  d.name + "";
});
svg.call(tip);

// NODES
var node = svg.selectAll('.node')
  .data(force.nodes())
  .enter()
  .append("g")
  .call(force.drag);

node.append("circle")
  .attr('class', 'node')
  .attr('r', function(d) { return 10 * d.group; })
  .style("stroke", "transparent")
  .style("fill", function(d) { return color(d.group); })
  .on('dblclick', connectedNodes)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

// node.append("text")
//   .attr("y", function(d) {
//     if (d.group === 1) {
//       return -20;
//     } else if (d.group === 2) {
//       return -25;
//     } else {
//       return -35;
//     }
//   })
//   .attr("dy", ".35em")
//   .style("opacity", function(d) { return d.group === 1 ? 0 : 1; })
//   .text(function(d) { return d.name; });

// EVENT HANDLER
function tick(e) {

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

}

// ------------- UTILITY ------------------------------

//Toggle stores whether the highlighting is on
var toggle = 0;

//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
}

links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}

function connectedNodes() {

    if (toggle === 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;

        node.style("opacity", function (o) { // If neighboring, keep opacity on.
            if (o.name === d.name) { return 1; }  // if node is the one being clickeds
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });

        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;

    } else {
        //Put them back to opacity=1
        node.style("opacity", 1);
        link.style("opacity", 0.3);
        toggle = 0;
    }
}
