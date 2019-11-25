// Partition Chart
// Largely based off demo from class
const dataset = {
    "name": "News",
    "value": 225,
    "children": [
        {
            "name": "Federal",
            value: 85,
            "children": [
                {
                    "name": "President",
                    value: 65,
                    "children": [
                        {
                            "name": "Impeachment",
                            value: 50
                        }
                    ]
                },
                {
                    "name": "Congress",
                    value: 20
                },
            ]
        },
        {
            "name": "Metro",
            value: 30,
            "children": [
                {
                    "name": "Boroughs",
                    value: 25,
                    "children": [
                        { "name": "Manhattan", value: 20 }
                    ]
                }
            ]
        },
        {
            "name": "International",
            value: 40,
            "children": [
                {
                    "name": "Asia",
                    value: 20,
                    "children": [
                        { "name": "Hong Kong", value: 15 }
                    ]
                },
                {
                    "name": "Africa",
                    value: 10,
                    "children": [
                        { "name": "Ethiopia", value: 10 }
                    ]
                },
                {
                    "name": "Europe",
                    value: 5,
                    "children": [
                        { "name": "Brexit", value: 3 }
                    ]
                },
                {
                    "name": "Americas",
                    value: 5,
                    "children": [
                        { "name": "Chile", value: 4 }
                    ]
                },

            ]
        },
        {
            "name": "Election",
            value: 70,
            "children": [
                {
                    "name": "Presidential",
                    value: "45",
                    "children": [
                        { "name": "Debates", value: 20 },
                        { "name": "Trump", value: 25 }
                    ]
                },
                {
                    "name": "Congressional",
                    value: 30
                }
            ]
        },
    ]
};
const width = 800;
const height = 700;
const colorScale = ["#d3f6d1", "#a7d7c5", "#74b49b", "#5c8d89"]


function createTreeMap(data) {

    const root = d3.hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value)
        .count();

    console.log(root)

    const w = width,
        h = height;

    const svg = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Create Partition
    const treemap = d3.treemap() // <*>
        .size([h, w])
        .paddingInner(10)
        .paddingOuter(20)
        .round(true);

    treemap(root);
    console.log(root)

    // Rectangles
    svg.selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .style('fill', d => colorScale[d.depth])
        .attr('x', d => d.y0) // <*>
        .attr('y', d => d.x0)
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .style('stroke', 'white')
        .style('stroke-width', '1px')


    // Labels
    svg.selectAll('text')
        .data(root.descendants())
        .enter()
        .append('text')
        .classed('node-label', true)
        .style('text-anchor', 'start')
        .attr('x', d => d.y0 + 5)
        .attr('y', d => d.x0 + 15)
        .text(d => `${d.data.name}: ${d.data.value} views`)
        .style('font-size', '16px')
        .style('fill', 'black')
}



window.onload = createTreeMap(dataset);

