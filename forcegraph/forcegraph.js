// Force Graph
// Code is primarily based off of the in-class demo
// Two other sources used to help w/ labels
// 1: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// 2: https://observablehq.com/@garciaguillermoa/force-directed-graph
const w = 800;
const h = 700;
let colorScale = d3.scaleOrdinal(d3.schemeSet2);
const dataset = {
    nodes: [
        { name: 'News', group: 0 }, // 0
        { name: 'Politics', group: 1 }, // 1
        { name: 'Metro', group: 2 }, // 2
        { name: 'Sports', group: 3 }, // 3
        { name: 'Entertainment', group: 4 }, // 4
        { name: 'Business', group: 5 }, // 5
        { name: 'Election', group: 1 },
        { name: 'Government', group: 1 },
        { name: 'Local', group: 1 },
        { name: 'Congress', group: 1 },
        { name: 'President', group: 1 },
        { name: 'Courts', group: 1 },
        { name: 'Brooklyn', group: 2 },
        { name: 'Manhattan', group: 2 },
        { name: 'Queens', group: 2 },
        { name: 'The Bronx', group: 2 },
        { name: 'Staten Island', group: 2 },
        { name: 'Football', group: 3 },
        { name: 'Hockey', group: 3 },
        { name: 'Soccer', group: 3 },
        { name: 'Baseball', group: 3 },
        { name: 'Basketball', group: 3 },
        { name: 'Other', group: 3 },
        { name: 'T.V.', group: 4 },
        { name: 'Movies', group: 4 },
        { name: 'Theatre', group: 4 },
        { name: 'Games', group: 4 },
        { name: 'Celebrities', group: 4 },
        { name: 'Stocks', group: 5 },
        { name: 'Economy', group: 5 },
        { name: 'Tech', group: 5 },
    ],
    edges: [
        { source: 'News', target: 'Politics' },
        { source: 'News', target: 'Metro' },
        { source: 'News', target: 'Sports' },
        { source: 'News', target: 'Entertainment' },
        { source: 'News', target: 'Business' },
        { source: 'Politics', target: 'Election' },
        { source: 'Politics', target: 'Government' },
        { source: 'Government', target: 'President' },
        { source: 'Government', target: 'Congress' },
        { source: 'Government', target: 'Courts' },
        { source: 'Government', target: 'Local' },
        { source: 'Metro', target: 'Manhattan' },
        { source: 'Metro', target: 'Brooklyn' },
        { source: 'Metro', target: 'Queens' },
        { source: 'Metro', target: 'The Bronx' },
        { source: 'Metro', target: 'Staten Island' },
        { source: 'Sports', target: 'Football' },
        { source: 'Sports', target: 'Hockey' },
        { source: 'Sports', target: 'Soccer' },
        { source: 'Sports', target: 'Baseball' },
        { source: 'Sports', target: 'Basketball' },
        { source: 'Sports', target: 'Other' },
        { source: 'Entertainment', target: 'T.V.' },
        { source: 'Entertainment', target: 'Movies' },
        { source: 'Entertainment', target: 'Theatre' },
        { source: 'Entertainment', target: 'Games' },
        { source: 'Entertainment', target: 'Celebrities' },
        { source: 'Business', target: 'Stocks' },
        { source: 'Business', target: 'Economy' },
        { source: 'Business', target: 'Tech' },
    ]
};

// Interactivity
const drag = (simulation) => {
    const onDragStart = d => {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        // use fx and fy as fixed x and y values; when set, overrides computed x/y
        d.fx = d.x;
        d.fy = d.y;
    };

    const onDrag = d => {
        debugger; console.log(simulation.alpha());
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    const onDragEnd = d => {
        if (!d3.event.active) {
            simulation.alphaTarget(0).restart();
        }
        // clear fx and fy so that computed x/y is used once again
        d.fx = null;
        d.fy = null;
    };

    return d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd)
};


function createForceGraph(dataset) {
    const svg = d3
        .select('#chart')
        .attr('width', w)
        .attr('height', h);

    // Create forces
    const force = d3.forceSimulation(dataset.nodes)
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide()
            .radius(5)
        )
        .force('link', d3.forceLink(dataset.edges)
            .id(d => d.name)
            .distance(100)
        )
        .force('center', d3.forceCenter()
            .x(w / 2)
            .y(h / 2)
        );

    // Create edges
    const edges = svg.append('g')
        .selectAll('.edge')
        .data(dataset.edges)
        .enter()
        .append('line')
        .classed('edge', true);

    // Create groups for nodes
    // Assign force to groups
    var nodes = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(dataset.nodes)
        .enter()
        .append('g')
        .call(drag(force));

    nodes.append('circle')
        .attr('r', 10)
        .attr('fill', (d) => colorScale(d.group))
        

    // Labels
    nodes.append("text")
        .text(function (d) {
            return d.name;
        })
        .attr('x', 10)
        .attr('y', 3);


    force.on('tick', () => {
        console.log(force.alpha());
        edges
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        nodes
            .attr('transform', (d) => `translate(${d.x},${d.y})`);
    })
}

window.onload = createForceGraph(dataset);
