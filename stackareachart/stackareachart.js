// Stacked Area Chart


let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let colorScale = d3.scaleOrdinal(d3.schemeSet2);
let chart;

const width = 800;
const height = 700;
const heightPadding = 40;
const widthPadding = 120;
let xPadding = 80;
// Pretend dataset, at least for now
const data = [
    { date: new Date(2019, 5), core: 98, print: 12, crosswords: 35, audio: 21 },
    { date: new Date(2019, 6), core: 75, print: 8, crosswords: 21, audio: 13 },
    { date: new Date(2019, 7), core: 77, print: 4, crosswords: 18, audio: 25 },
    { date: new Date(2019, 8), core: 103, print: 19, crosswords: 23, audio: 25 },
    { date: new Date(2019, 9), core: 120, print: 15, crosswords: 15, audio: 20 },
    { date: new Date(2019, 10), core: 134, print: 20, crosswords: 18, audio: 22 }
]

function createStackAreaChart(dataset) {
    const w = width;
    const h = height;
    // Create d3 stack layout
    const stack = d3.stack()
        .keys(['core', 'print', 'crosswords', 'audio']);

    console.table(stack(dataset));

    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Scales
    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.core + d.print + d.crosswords + d.audio)])
        .range([h - heightPadding, heightPadding]);

    xScale = d3.scaleTime()
        .domain([d3.min(dataset, d => d.date), (d3.max(dataset, d => d.date))])
        .rangeRound([0, w - widthPadding]);

    // Axes
    xAxis = d3.axisBottom(xScale)
        .ticks(dataset.length + 1)
        .tickFormat(d3.timeFormat('%b-%Y'));
    yAxis = d3.axisLeft(yScale);

    xAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${xPadding}, ${h - heightPadding})`)
        .call(xAxis);

    yAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${xPadding},0)`)
        .call(yAxis);


    const area = d3.area()
        .x(d => xScale(d.data.date) + xPadding)
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));


    var layer = chart.selectAll(".layer")
        .data(stack(data))
        .enter().append("g")
        .attr("class", "layer").call(attachMouseEvents);

    layer.append("path")
        .attr("class", "area")
        .style("fill", function (d) { return colorScale(d.key); })
        .attr("d", area)
        ;

    // Labels
    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('x', -h / 2)
        .attr('y', 20)
        .text("Number of Subscribers Gained (in 1000s)");

    chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${w / 2}, ${h - 5})`)
        .text("Dates");

    // LEGEND - built using Susie Lu's d3.svg.legend package
    const legendScale = d3.scaleOrdinal()
        .domain(['Core', 'Print', 'Crosswords', 'Audio'])
        .range(d3.schemeSet2);

    chart.append('g')
        .attr('class', 'legendOrdinal')
        .attr('transform', 'translate(300, 15)');


    // see https://github.com/d3/d3-shape#symbols for information about d3 symbol shapes
    var legendOrdinal = d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(600)())
        .shapePadding(50)
        .orient('horizontal')
        .scale(legendScale);

    chart.select('.legendOrdinal')
        .call(legendOrdinal);
}


function attachMouseEvents(sel) {
    sel
        .on('mouseover', function (d, i) {
            var totalSubs = d.reduce(function (acc, d) {
                return acc + (d[1] - d[0])
            }, 0);

            // Set up mouse tool tip on move
            sel.on('mousemove', () => {
                const bodyDOMElem = d3.select('body').node();
                const [mouseX, mouseY] = d3.mouse(bodyDOMElem);
                d3.select("#tooltip")
                    .style("left", `${mouseX + 20}px`)
                    .style("top", `${mouseY}px`)
                    .select("#value")
                    .text(`${d.key}: ${totalSubs}k total subscribers`);
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll('.layer').filter(function () {
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

            d3.selectAll('.layer')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}

window.onload = createStackAreaChart(data);