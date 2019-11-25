// Scatterplot Chart
let dataset;
let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let colorScale;
let chart;

const width = 800;
const height = 700;
const heightPadding = 40;
const widthPadding = 100;
let xPadding = 80;

// Converter
function rowConverter(row) {
    return {
        marketing_budget: parseInt(row.marketing_budget),
        subs: parseInt(row.subs)
    }
}

function makeScatterPlot(dataset) {
    const w = width;
    const h = height;

    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Scales
    xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.marketing_budget)])
        .range([0, w - widthPadding]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.subs)])
        .range([h - heightPadding, heightPadding]);

    // Circle Positions
    chart.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.marketing_budget) + xPadding)
        .attr('cy', d => yScale(d.subs))
        .attr('r', 6)
        .attr('fill', 'rgb(150, 215, 137)')
        .call(attachMouseEvents);

    // Axes
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    xAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${xPadding}, ${h - heightPadding})`)
        .call(xAxis);

    yAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${xPadding},0)`)
        .call(yAxis);

    // Labels
    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('x', -h / 2)
        .attr('y', 20)
        .text("Number of Subscribers (in 1000s)");

    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${w / 2}, ${h - 5})`)
        .text("Marketing Budget (in 1000s)");


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
                    .text(`Subscribers: ${d.subs}k, Budget: ${d.marketing_budget}k`);
                
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll('circle').filter(function () {
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

            d3.selectAll('circle')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}

function initGraph() {
    d3.csv(require('./scatterplot-data.csv'), rowConverter)
        .then((data) => {
            dataset = data;
            console.log(dataset)
            makeScatterPlot(dataset)
        })
}

window.onload = initGraph();