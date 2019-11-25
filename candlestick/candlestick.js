// Candlestick! 
// Largely based off of this example here: https://observablehq.com/@d3/candlestick-chart
// With some changes to fit the dataset, and generally how I code. 

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

let formatDate = d3.timeFormat("%B %-d, %Y");
let formatValue = d3.format(".2f");
let parseDate = d3.timeParse("%Y-%m-%d");

// Convert CSV
function rowConverter(row) {
    return {
        date: parseDate(row.date),
        high: parseFloat(row.high),
        low: parseFloat(row.low),
        open: parseFloat(row.open),
        close: parseFloat(row.close)
    }
}

function makeCandleStick(data) {
    // Set up chart
    let w = width;
    let h = height;

    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h);

    // Scales
    // Utilize scaleband for week days only
    xScale = d3.scaleBand()
        .domain(d3.timeDay
            .range(data[data.length - 1].date, +data[0].date + 1)
            .filter(d => d.getDay() !== 0 && d.getDay() !== 6))
        .rangeRound([0, w - widthPadding])
        .padding(0.3)

    // Simple linear scale for lows versus highs on market
    yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
        .rangeRound([h - heightPadding, heightPadding]);

    // Initiate the first line range
    const g = chart.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr('class', 'candleline')
        .attr("transform", (d) => `translate(${xScale(d.date) + widthPadding},0)`);

    g.append("line")
        .attr("y1", d => yScale(d.low))
        .attr("y2", d => yScale(d.high));

    // Thicker line, indicate if open or close was greater through visual color
    g.append("line")
        .attr("y1", d => yScale(d.open))
        .attr("y2", d => yScale(d.close))
        .attr("stroke", d => d.open > d.close ? "#ef4339"
            : d.close > d.open ? "#52de97" : "grey")
        .attr("stroke-width", xScale.bandwidth() / 2);

    // Hover effects
    g.call(attachMouseEvents);


    // Axes
    // Tick values to only count the monday of the week
    xAxis = d3.axisBottom(xScale)
        .tickValues(d3.timeMonday
            .every(width > 720 ? 1 : 2)
            .range(data[data.length - 1].date, +data[0].date + 1))
        .tickFormat(d3.timeFormat("%-m/%-d"));
    yAxis = d3.axisLeft(yScale)
        .ticks(8, ".1f");

    // Display Axes
    xAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(80, ${h - heightPadding})`)
        .call(xAxis);

    yAxisGroup = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(80,0)`)
        .call(yAxis);

    //  Label
     chart.append('text')
         .attr('class', 'axis-label')
         .attr('transform', `rotate(-90)`)
         .attr('text-anchor', 'middle')
         .attr('x', -h / 2)
         .attr('y', 20)
         .text("Stock price at end of day");
}

function attachMouseEvents(sel) {
    sel
        .on('mouseover', function (d, i) {
            console.log(d);
            // Set up mouse tool tip on move
            sel.on('mousemove', () => {
                const bodyDOMElem = d3.select('body').node();
                const [mouseX, mouseY] = d3.mouse(bodyDOMElem);
                d3.select("#tooltip")
                    .style("left", `${mouseX + 20}px`)
                    .style("top", `${mouseY}px`)
                    .select("#value")
                    .text(`${formatDate(d.date)}
                          Open: ${formatValue(d.open)}
                          Close: ${formatValue(d.close)}
                          Low: ${formatValue(d.low)}
                          High: ${formatValue(d.high)}`);
            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll('.candleline').filter(function () {
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

            d3.selectAll('.candleline')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}

function initGraph() {
    d3.csv(require('./candlestick.csv'), rowConverter)
        .then((data) => {
            dataset = data;
            console.log(dataset)
            makeCandleStick(dataset);
        })
}

window.onload = initGraph();