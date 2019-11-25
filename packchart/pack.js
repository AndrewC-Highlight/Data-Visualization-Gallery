// Circle Pack
// Used class demo and part of another source for sample data structure
// https://observablehq.com/@fanxiao001/d3-circle-packing
const dataset = {
    "name": "Views on 11/10/2019",
    "children": [
        {
            "name": "trending",
            "children": [
                { "name": "Congress", "value": 17010 },
                { "name": "Kentucky", "value": 5842 },
                {
                    "name": "election",
                    "children": [
                        { "name": "Debates", "value": 1983 },
                        { "name": "Trump", "value": 2047 },
                        { "name": "Polls", "value": 2042 }
                    ]
                },
                { "name": "Chile", "value": 1041 },
                { "name": "Hong Kong", "value": 5176 },
                { "name": "Tech", "value": 449 },
                { "name": "Ukraine", "value": 5593 },
                { "name": "Pelosi", "value": 5534 },
                { "name": "Biden", "value": 9201 },
                { "name": "Impeachment", "value": 19975 },
                { "name": "Black Cat", "value": 1116 },
                { "name": "Ok Boomer", "value": 6006 }
            ]
        },
        {
            "name": "metro",
            "children": [
                {
                    "name": "boroughs",
                    "children": [
                        { "name": "Manhattan", "value": 10721 },
                        { "name": "Brooklyn", "value": 4294 },
                        { "name": "Queens", "value": 3800 },
                        { "name": "Staten Island", "value": 1314 },
                        { "name": "The Bronx", "value": 2220 }
                    ]
                },
                { "name": "MTA", "value": 1759 },
                { "name": "De Blasio", "value": 2165 },
                { "name": "Tourism", "value": 586 },
                { "name": "Economy", "value": 3331 },
            ]
        },
        {
            "name": "sports",
            "children": [
                { "name": "Football", "value": 8833 },
                { "name": "Hockey", "value": 5732 },
                { "name": "Basketball", "value": 3623 },
                { "name": "Baseball", "value": 10066 },
                { "name": "Soccer", "value": 7831 }
            ]
        }
    ]
}
let colorScale = ["#5878ff", "#5edfff", "#b2fcff", "#ecfcff"]
const width = 800;
const height = 700

function createPack(data) {
    const root = d3.hierarchy(data)
        .sum(d => d.value || 0);


    console.log(root)

    const w = width,
        h = height;

    const svg = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Create Circle Pack
    const partition = d3.pack()
        .size([w, h])
        .padding(5);

    partition(root);


    // Create Circles
    svg.selectAll('circle')
        .data(root.descendants())
        .enter()
        .append('circle')
        .style('fill', d => colorScale[d.depth])
        .attr('cx', d => d.x) // <*>
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .call(attachMouseEvents);


    // Create Labels
    svg.selectAll('text')
        .data(root.descendants())
        .enter()
        .filter(d => !d.children) // <*>
        .append('text')
        .classed('node-label', true)
        .style('text-anchor', 'middle')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .text(d => d.data.name);
}


function attachMouseEvents(sel) {
    sel
        .on('mouseover', function (d) {
            // Set up mouse tool tip on move
            sel.on('mousemove', () => {
                const bodyDOMElem = d3.select('body').node();
                const [mouseX, mouseY] = d3.mouse(bodyDOMElem);
                d3.select("#tooltip")
                    .style("left", `${mouseX + 20}px`)
                    .style("top", `${mouseY}px`)
                    .select("#value")
                    .text(`${d.data.name}: ${d.value}`);
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            d3.select(this)
                .style('stroke', 'black')
                .style('stroke-wdith', '3px');
        })
        .on('mouseout', function () {
            // On Mouseout, we revert the selected to false on that particular bar 
            d3.select(this)
                .style('stroke', 'none')

            d3.select("#tooltip")
                .classed('hidden', true);

            sel.on('mousemove', null);

        })
}

window.onload = createPack(dataset);
