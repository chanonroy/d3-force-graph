var width = 900,
    height = 700;

var links = [
    { source: 'Cat', target: 'Animal', value: 0.3 },
    { source: 'Dog', target: 'Animal', value: 4 },
    { source: 'Wolf', target: 'Animal', value: 6},
];

// create empty nodes array
var nodes = {};

// compute nodes from links data (create new node if needed)
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
    link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
    // link.value = +link.value;
});

// CANVAS
var svg =
  d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Draw Force Graph
var force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .gravity(0.05)
    .on("tick", tick)
    .linkDistance(300)
    .start();

// EDGES
var link = svg.selectAll('.link')
     .data(links)
     .enter().append('line')
     .attr('class', 'link');
    //  .style("stroke-width", function(d) { return Math.sqrt(d.value); });

// ----------------------------------------------

// NODES
var node = svg.selectAll('.node')
  .data(force.nodes())
  .enter()
  .append("g")
  .call(force.drag);

node.append("circle")
  .attr('class', 'node')
  .attr('r', width * 0.02);

// node.append("rectangle")
//   .attr('width', )

node.append("text")
  .attr("x", 20)
  .attr("dy", ".35em")
  .text(function(d) { return d.name; });

// EVENT HANDLER
function tick(e) {

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

}
