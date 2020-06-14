/** SETUP
  Define outer Container
  Add title
  Add SVG element
  Add axes
  Define range for axes wrt to width and height
 */

// SELECT
const container = d3.select(".container");

// TITLE
container
    .append("h1")
    .attr("id", "title")
    .text("Gross Domestic Product - GDP");

// FRAME
// get some gutter
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    // include a larger margin to the left as to show the values of GDP on the vertical axis
    left: 50
}

// width and height corrected for gutter
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// this is the outer container 800 x 400
const containerCanvas = container
                            .append("svg")
                            .attr("viewBox", `0 0 ${width + margin.left + margin.right}  ${height + margin.top + margin.bottom}`);

//Define inner box for chart
const canvasContents = containerCanvas
                            .append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);

// SCALES
// for the horizontal scale include a time scale
// remember to use corrected width
const xScale = d3
                .scaleTime()
                .range([0, width]);

// for the vartical scale include a linear scale
// range is height to 0
// corrected height
const yScale = d3
                .scaleLinear()
                .range([height, 0]);

// See the JSON carefully for time formats
const parseTime = d3
                    .timeParse("%Y-%m-%d");

// define a formatting function, which formats the date object obtained
const formatTime = d3.timeFormat("%Y-%m-%d");


//** DATA
// read data

// XMLHTTPREQUEST
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const request = new XMLHttpRequest();
request.open("GET", URL, true);
request.send();
// on load call a function to draw the bar chart wit 275 data points
request.onload = function() {
    let json = JSON.parse(request.responseText);
    drawBarChart(json.data);
}

// main function
function drawBarChart(data) {

    // FORMAT DATA and load in array
    data.forEach((d) => {
        d[0] = parseTime(d[0]);
        d[1] = +d[1];
    });

    // DOMAIN
    // the scales' domains are defined by the minimum and maximum values of each column
        xScale
        .domain(d3.extent(data, d => d[0]));

        yScale
        .domain(d3.extent(data, d => d[1]))
        .nice();

    // AXES
    // initialize the axes based on the scales
    const xAxis = d3
                    .axisBottom(xScale);
    const yAxis = d3
                    .axisLeft(yScale);

    // include the axes within group elements
    canvasContents
        .append("g")
        .attr("id", "x-axis")
        // for the horizontal axis, position it at the bottom of the area defined by the SVG canvas
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    canvasContents
        .append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // TOOLTIP
    // include a tooltip through a div element
    const tooltip = container
                        .append("div")
                        .attr("id", "tooltip");

    // PLOT CHART
    // include as many rectangle elements as required by the data array (275 data points)
    canvasContents
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .on("mouseenter", (d) => {
            tooltip
                .style("opacity", 1)
                .style("left", `${d3.event.layerX - 150}px`)
                .style("top", `${d3.event.layerY - 80}px`)
                .attr("data-date", formatTime(d[0]))
                .text(() => {
                    let year = d[0].getFullYear();
                    let quarter = (d[0].getMonth() == 0) ? "Q1" : (d[0].getMonth() == 3) ? "Q2" : (d[0].getMonth() == 6) ? "Q3" : "Q4";
                    return `${year} ${quarter} ${d[1]}`;
                });
        })
        .on("mouseout", () => {
            tooltip
                .style("opacity", 0);
        })
        .attr("data-date", (d) => formatTime(d[0]))
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d, i) => (width/ data.length) * i)
        .attr("width", (width/ data.length))
        .attr("y", (d) => yScale(d[1]))
        .attr("height", (d) => height - yScale(d[1]))
        .attr("class", "bar");
}
