//import * as d3 from "./d3.js";

/** SETUP
 * select the element in which to plot the data visualization
 * include a title through a header element
 * include the frame of an SVG canvas, in which to draw the data as it is queried
 * define the scales for the horizontal and vertical axes
 * define the range for both axes. These rely on the width and height values of the SVG and can be set prior to retrieving the data
 */


// SELECT
const width = 600;
const height = 400;

const container = d3.select(".container");

// TITLE
container
    .append("h1")
    .attr("id", "title")
    .text("Gross Domestic Product - GDP");

// Get the Data
// XMLHTTPREQUEST
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%Y-%m-%d");

const xScale = d3
                .scaleTime()
                .range([0, width]);

// for the vartical scale include a linear scale
// since elements are drawn from the top down though, the range is reversed, with the smallest value being at the bottom of the SVG canvas and the highest value at the top
const yScale = d3
                .scaleLinear()
                .range([height, 0]);

const request = new XMLHttpRequest();
request.open("GET", URL, true);
request.send();
// on load call a function to draw the bar chart
// pass as argument the array containing 250+ data arrays
request.onload = function() {
    let json = JSON.parse(request.responseText);
    drawBarChart(json.data);
}

function drawBarChart(data) {

  // format the data
  data.forEach((d) => {
    d[0] = parseTime(d[0]);
    d[1] = +d[1];
  });

  xScale
  // d3.extent returns the minimum and maximum value
  // this is equivalent to
  // .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])]);
  .domain(d3.extent(data, d => d[0]));

  yScale
  .domain(d3.extent(data, d => d[1]))
  // thanks to the nice() function, the scale is set to start at 0 and end at 20.000
  // applied to a domain, the function allows to avoid using the precise data points in favour of round, understandable numbers
  .nice();

  const containerCanvas = container
                          .append("svg")
                          .attr("viewbox","0 0 1100 600");

  containerCanvas.selectAll("rect")
                 .data(data)
                 .enter()
                 .append("rect")
                 .attr("x",(d,i) => (width/ data.length) * i)
                 .attr("width", width/ data.length)
                 .attr("height", (d) => height - yScale(d[1]))
                 .attr("y", (d) => yScale(d[1]))
                 .attr("class","bar");
}




// Chart Frame
