// Chord Chart
// TWO Main References Here
// Used https://www.d3-graph-gallery.com/graph/chord_colors.html as the basic code
// Used https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html for arc labels
let dataset;
let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let colorScale = d3.scaleOrdinal(d3.schemeSet2);
let chart;

const width = 800;
const height = 700;
const heightPadding = 40;
const widthPadding = 100;

// Sample Data
var matrix = [
    [0, 73, 44, 20, 13, 43, 13],
    [65, 0, 78, 61, 50, 51, 24],
    [46, 52, 0, 17, 47, 52, 51],
    [67, 11, 22, 0, 12, 66, 14],
    [14, 79, 65, 34, 0, 17, 76],
    [67, 41, 62, 28, 59, 0, 32],
    [18, 16, 54, 42, 33, 65, 0],
];

var groupNames =
    ['WSJ', 'New York Times', 'Washington Post', 'USA Today', 'CNN', 'FOX News', 'Associated Press']

function createChordChart() {
    const w = width;
    const h = height;

    chart = d3.select("#chart")
        .attr('width', w)
        .attr('height', h)
        .append("g")
        .attr("transform", "translate(400,350)");

    // matrix for where people switched subscriptions to for Q3 2019
    // rows = media publisher
    // columns = media publisher too?
    // 4 groups, so create a vector of 4 colors


    // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
        (matrix)
    console.log(chord);
    // add the groups on the outer part of the circle
    chart
        .datum(chord)
        .append("g")
        .selectAll("g")
        .data((d) => d.groups)
        .enter()
        .append("g")
        .append("path")
        .attr('class', 'outer')
        .style("fill", (d, i) => colorScale([i]))
        .attr("d", d3.arc()
            .innerRadius(300)
            .outerRadius(320)
        )
        .call(attachMouseEvents, 'outer')
        .each(function (d, i) {
            // This solution for CENTERED arc text found here:
            // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
            // Capture arc path data
            var firstArcSection = /(^.+?)L/;

            var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];

            newArc = newArc.replace(/,/g, " ");

            //Invisible arc to flow
            chart.append("path")
                .attr("class", "hiddenOuterArcs")
                .attr("id", "arcText" + i)
                .attr("d", newArc)
                .style("fill", "none");
        });

    // Create outside arc text
    chart.selectAll('.outerText')
        .data(chord)
        .enter()
        .append('text')
        .attr('class', 'outerText')
        .attr('dy', -15)
        .append('textPath')
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .attr('xlink:href', (d, i) => '#arcText' + i)
        .text((d, i) => groupNames[i])

    // Add the links between groups
    chart
        .datum(chord)
        .append("g")
        .selectAll("path")
        .data((d) => d)
        .enter()
        .append("path")
        .attr('class', (d) => `group_${d.source.index}`)
        .attr("d", d3.ribbon()
            .radius(300)
        )
        .style("fill", (d) => colorScale([d.source.index])) // colors depend on the source group. Change to target otherwise.
        .style('opacity', 0.7)
        .call(attachMouseEvents, 'inner');
}

function attachMouseEvents(sel, bool) {
    sel
        .on('mouseover', function (d) {
            console.log(d)
            // Set up mouse tool tip on move
            sel.on('mousemove', () => {
                const bodyDOMElem = d3.select('body').node();
                const [mouseX, mouseY] = d3.mouse(bodyDOMElem);
                // These names seem confusing. But the source is always the 
                // greater of the two, and is reflected by having the greater chord end width
                // as well as the categories color.
                // Here, the lesser of the two, target, has a property subindex that points back to the source
                // vice versa for source
                console.log(bool)
                // Change labels depending on what's selected w/ the help of a handy
                if (bool === 'inner') {
                    const source = groupNames[d.target.subindex];
                    const target = groupNames[d.source.subindex];
                    d3.select("#tooltip")
                        .style("left", `${mouseX + 20}px`)
                        .style("top", `${mouseY}px`)
                        .select("#value")
                        .text(`${target} --> ${source}: ${d.source.value}`);
                    d3.select("#value2")
                        .style('display', 'initial')
                        .text(`${source} --> ${target}: ${d.target.value}`)
                }
                else if (bool === 'outer') {
                    d3.select("#tooltip")
                        .style("left", `${mouseX + 20}px`)
                        .style("top", `${mouseY}px`)
                        .select("#value")
                        .text(`${groupNames[d.index]}`);
                    d3.select("#value2")
                        .style('display', 'none')
                }

            });
            // Show tooltip
            d3.select("#tooltip")
                .classed("hidden", false);

            // Class the moused over one as true
            d3.select(this)
                .classed('selected', true);
            d3.selectAll('.outer')
                .classed('selected', true);
            d3.selectAll(`.group_${d.index}`)
                .classed('selected', true);

            // Filter out of all the bars that aren't selected
            d3.selectAll(`.outer, path`).filter(function () {
                return !this.classList.contains('selected')
            })
                .transition('hover')
                .duration(1000)
                .style('opacity', 0.1);
        })
        .on('mouseout', function (d) {
            // On Mouseout, we revert the selected to false on that particular bar 
            d3.select(this)
                .classed('selected', false);
            d3.selectAll(`.group_${d.index}`)
                .classed('selected', false);

            d3.select("#tooltip")
                .classed('hidden', true);

            d3.selectAll('path')
                .transition('hover')
                .duration(500)
                .style('opacity', 0.7);
            d3.selectAll('.outer')
                .transition('hover')
                .duration(500)
                .style('opacity', 1);

            sel.on('mousemove', null);

        })
}

window.onload = createChordChart();