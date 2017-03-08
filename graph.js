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
    { source: 'Cat', target: 'Animal', value: 0.3 },
    { source: 'Dog', target: 'Animal', value: 4 },
    { source: 'Wolf', target: 'Animal', value: 6 },
    { source: 'Kitten', target: 'Animal', value: 6 },
    { source: 'Whale', target: 'Animal', value: 6 },
    { source: 'Max', target: 'Cat', value: 3 },
    { source: 'Fred', target: 'Cat', value: 6 },
    { source: 'George', target: 'Cat', value: 6 },
    { source: 'Marty', target: 'Wolf', value: 6 },
    { source: 'Vector', target: 'Wolf', value: 16 },
    { source: 'Spike', target: 'Dog', value: 6 },
    { source: 'Bruce', target: 'Whale', value: 6 },
    { source: 'George', target: 'Wolf', value: 6 },
    { source: 'Billy', target: 'Cat', value: 5},
    { source: 'Billy', target: 'Dog', value: 5},
    { source: 'Billy', target: 'Wolf', value: 5}
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

console.log(JSON.stringify(nodes));

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
    .linkDistance(config.linkDistance)
    .start();

// EDGES
var link = svg.selectAll('.link')
     .data(links)
     .enter().append('line')
     .attr('class', 'link');

// ----------------------------------------------

// NODES
var node = svg.selectAll('.node')
  .data(force.nodes())
  .enter()
  .append("g")
  .call(force.drag);

node.append("circle")
  .attr('class', 'node')
  .attr('r', function(d) { return 10 * d.group; })
  .style("fill", function(d) { return color(d.group); });

node.append("text")
  .attr("x", -20) // TODO, make function here to change based on group
  .attr("y", -40)
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
