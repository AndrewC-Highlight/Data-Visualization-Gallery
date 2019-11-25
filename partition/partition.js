// Partition Chart
// Largely based off demo from class
const dataset = {
    "name": "News",
    "children": [
        {
            "name": "Federal",
            "children": [
                {
                    "name": "President",
                    "children": [
                        { "name": "Impeachment" }
                    ]
                },
                { "name": "Congress" },
            ]
        },
        {
            "name": "Metro",
            "children": [
                {
                    "name": "Boroughs",
                    "children": [
                        { "name": "Manhattan" }
                    ]
                }
            ]
        },
        {
            "name": "International",
            "children": [
                {
                    "name": "Asia",
                    "children": [
                        { "name": "Hong Kong " }
                    ]
                },
                {
                    "name": "Africa",
                    "children": [
                        { "name": "Ethiopia" }
                    ]
                },
                {
                    "name": "Europe",
                    "children": [
                        { "name": "Brexit" }
                    ]
                },
                {
                    "name": "Americas",
                    "children": [
                        { "name": "Chile" }
                    ]
                },

            ]
        },
        {
            "name": "Election",
            "children": [
                {
                    "name": "Presidential",
                    "children": [
                        { "name": "Debates" },
                        { "name": "Trump" }
                    ]
                },
                {
                    "name": "Congressional"
                }
            ]
        },
    ]
};
const width = 800;
const height = 700;
const colorScale = d3.scaleOrdinal(d3.schemePaired);


function createPartitionChart(data) {

    const root = d3.hierarchy(data)
        .count(); 

    console.log(root)

    const w = width,
        h = height;

    const svg = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Create Partition
    const partition = d3.partition() // <*>
        .size([h, w])
        .padding(1)
        .round(true);

    partition(root);
    console.log(root)

    // Rectangles
    svg.selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .style('fill', d => colorScale(d.depth))
        .style('opacity', '0.8')
        .attr('x', d => d.y0) // <*>
        .attr('y', d => d.x0)
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .attr("rx", "10")
        .attr("ry", "10");


    // Labels
    svg.selectAll('text')
        .data(root.descendants())
        .enter()
        .append('text')
        .classed('node-label', true)
        .style('font-weight', d => d.children ? 'bold' : 'normal')
        .style('font-size', d => d.children ? '1.2em' : '1em')
        .style('text-anchor', 'start')
        .attr('x', d => d.y0 + 3)
        .attr('y', d => d.x0 + 20)
        .text(d => `${d.data.name}`);
}



window.onload = createPartitionChart(dataset);

