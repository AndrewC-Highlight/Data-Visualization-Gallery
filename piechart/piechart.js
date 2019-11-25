// Scatterplot Chart
let dataset;
let colorScale = d3.scaleOrdinal(d3.schemeSet2);
let chart;

const width = 800;
const height = 700;
const innerRadius = 0;
const outerRadius = height / 3;


// Converter
function rowConverter(row) {
    return {
        sub_entry: row.sub_entry,
        num_subs: parseInt(row.num_subs)
    }
}

function makePieChart(dataset) {
    const w = width;
    const h = height;

    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Pie Chart Layout
    const pie = d3.pie()
        .value(d => d.num_subs);

    // Arcs for Pie Layout
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const arcs = chart.selectAll('g.arc')
        .data(pie(dataset))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', `translate(${w / 2}, ${h / 2})`)
        .call(attachMouseEvents);

    // append an SVG path to g elements in pie
    arcs.append('path')
        .attr('fill', (d, i) => colorScale(i))
        .attr('d', arc)
        .append('title')
        .text(d => d.sub_entry);

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.value);

    chart.append('g')
        .attr('id', 'legendOrdinal')
        .attr('transform', 'translate(675,80)');

    // LEGEND - built using Susie Lu's d3.svg.legend package

    const pieData = pie(dataset);
    console.log(pieData);
    const legendScale = d3.scaleOrdinal()
        .domain(pieData.map(d => d.data.sub_entry))
        .range(d3.schemeSet2);

    console.log(legendScale.domain());
    console.log(legendScale.range());
    chart.append('g')
        .attr('id', 'legendOrdinal')
        .attr('transform', 'translate(320,20)');

    // see https://github.com/d3/d3-shape#symbols for information about d3 symbol shapes
    var legendOrdinal = d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(600)())
        .shapePadding(10)
        .orient('vertical')
        .scale(legendScale);

    chart.select('#legendOrdinal')
        .call(legendOrdinal);

    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${w / 2 - 150}, ${50})`)
        .text("New Subscribers by Entry Point - Q3 2019 (in 1000s)");

}

function attachMouseEvents(sel) {
    sel
        .on('mouseover', function (d) {
            console.log(d);
            // Set up mouse tool tip on move
            sel.on('mousemove', () => {
                const bodyDOMElem = d3.select('body').node();
                const [mouseX, mouseY] = d3.mouse(bodyDOMElem);
                d3.select("#tooltip")
                    .style("left", `${mouseX + 20}px`)
                    .style("top", `${mouseY}px`)
                    .select("#value")
                    .text(`Area:${d.data.sub_entry} Subscribers:${d.data.num_subs}k`);
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll('.arc').filter(function () {
                return !this.classList.contains('selected')
            })
                .transition('hover')
                .duration(1000)
                .style('opacity', 0.25);
        })
        .on('mouseout', function () {
            // On Mouseout, we revert the selected to false on that particular bar 
            d3.select(this)
                .classed('selected', false);

            d3.select("#tooltip")
                .classed('hidden', true);

            d3.selectAll('.arc')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}

function initGraph() {
    d3.csv(require('./piechart-data.csv'), rowConverter)
        .then((data) => {
            dataset = data;
            console.log(dataset)
            makePieChart(dataset)
        })
}

window.onload = initGraph();