// Bar Chart

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

function rowConverter(row) {
    return {
        sub_type: row.sub_type,
        subs: parseInt(row.subs)
    }
}

function makeBarChart(dataset) {
    // Set up chart
    let w = width;
    let h = height;
    let barWidth = w / dataset.length;
    colorScale= d3.scaleOrdinal(d3.schemeSet3);
    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Scales
    xScale = d3.scaleBand()
        .domain(dataset.map(d => d.sub_type))
        .paddingOuter(0.1)
        .paddingInner(0.1)
        .rangeRound([0, w - widthPadding]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.subs)])
        .rangeRound([h - heightPadding, heightPadding]);

    chart.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.sub_type) + 80)
        .attr('y', d => yScale(d.subs))
        .attr('width', barWidth - 50) // change to bandwidth
        .attr('height', d => h - yScale(d.subs) - heightPadding)
        .attr('fill', (d,i) => colorScale(i))
        .call(attachMouseEvents)

    // Axes
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    xAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(80, ${h - heightPadding})`)
        .call(xAxis);

    yAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(80,0)`)
        .call(yAxis);

    // Label
    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('x', -h / 2)
        .attr('y', 20)
        .text("Total Number of Subscribers Today (in 1000s)");

    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${w / 2}, ${h - 5})`)
        .text("Area of Subscription");
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
                    .text(`${d.sub_type}: ${d.subs}k`);
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll('rect').filter(function () {
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

            d3.selectAll('rect')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}


function initGraph() {
    d3.csv(require('./bar-data.csv'), rowConverter)
        .then((data) => {
            dataset = data;
            console.log(dataset)
            makeBarChart(dataset);
        })
}

window.onload = initGraph();