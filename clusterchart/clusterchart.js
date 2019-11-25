// Cluster Chart
// Primarily Used In class Demo and one other source
// https://observablehq.com/@d3/cluster-dendrogram (used to help get it horizontal/curvy lines)
let colorScale = d3.scaleOrdinal(d3.schemeSet2);

const width = 800;
const height = 700;
const heightPadding = 100;
const widthPadding = 100;
const xPadding = 60;
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

function createCluster(data) {
    const w = width, h = height;

    const chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Create Cluster
    const cluster = d3.cluster().size([w - widthPadding, h - heightPadding]);
    const root = d3.hierarchy(data);
    cluster(root);


    // Create curved connection lines
    const link = chart.append("g")
        .attr('class', 'lines')
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d => `
        M${d.target.y + xPadding},${d.target.x}
        C${d.source.y + (root.height+1) / 2 + xPadding},${d.target.x}
         ${d.source.y + (root.height+1) / 2 + xPadding},${d.source.x}
         ${d.source.y +xPadding},${d.source.x}
      `);

    // Create nodes
    const node = chart.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 30)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y + xPadding},${d.x})`);

    node.append("circle")
        .attr("fill", d => colorScale(d.depth))
        .attr("r", 4);

    // Create Labels
    node.append("text")
        .attr("dy", "0.25em")
        .attr("x", d => d.children ? -8 : 8)
        .text(d => d.data.name)
        .filter(d => d.children)
        .attr("text-anchor", "end")
        .clone(true).lower()
        .attr("stroke", "white");

}

window.onload = createCluster(dataset);


