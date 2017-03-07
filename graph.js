var width = 1040,
    height = 780;

var links = [
    { source: 'Joe', target: 'Rain' },
    { source: 'Marisa', target: 'Rain' },
    { source: 'Sarah', target: 'Joe' },
    { source: 'Sarah II', target: 'Sarah' },
    { source: 'Enzo', target: 'Joe'},
    { source: 'Giuseppie', target: 'Joe'},
    { source: 'Giuseppie', target: 'Sarah'},
];

// create empty nodes array
var nodes = {};

// compute nodes from links data (create new node if needed)
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
    link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
});

var svg =
  d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var force =
  d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .on("tick", tick)
    .linkDistance(300)
    .start();

var link =
  svg.selectAll('.link')
     .data(links)
     .enter().append('line')
     .attr('class', 'link');

var node =
  svg.selectAll('.node')
     .data(force.nodes())
     .enter().append('circle')
     .attr('class', 'node')
     .attr('r', width * 0.02);

function tick(e) {

    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .call(force.drag);

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

}
