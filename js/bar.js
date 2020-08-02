let margin = ({top: 0, right: 20, bottom: 50, left: 50});
let height = 500;
let width = 800;

d3.csv(
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMHM-rI4V3j2d3Uqeg9qza2d0pBnyEW5jc6o19lxP82XFJG9dDFzPq5yFXafZdLoz79MjUsq1M4mTv/pub?gid=0&single=true&output=csv'
)
.then(function(data) { return data; })
.then(function(raw) {
  var countryList = new Array();
  raw.forEach(function(dataRow){
    countries.push(dataRow.Country);
  });

  d3.select("#country-picker")
    .selectAll("option")
    .data(countryList)
    .enter()
    .append("option")
    .text(function(countryName) { return countryName; });

  var countryInput = d3.select("#country-picker").property("value");
  
  d3.select("#country-picker").on("change", function() {
    var picked = d3.select("#country-picker").property("value");
    drawChart(picked, raw);
  });
  
});

function drawChart(picked, raw) {
  let countryObj = raw.filter(countryData => countryData.Country == picked);
  let rawCountryData = Object.entries(countryObj[0]);
  rawCountryData.forEach(function(dataPoint, i){
    if (isNaN(dataPoint[1])) { rawCountryData[i][1] = 0; }
  });
  rawCountryData.pop();
  let data = rawCountryData;
  console.log(data);
  
  let numYears = 71;
  let is = [...Array(numYears).keys()];
  let years = is.map(i => i + 1949);
      
  d3.select("#barchart").select("svg").remove();

  let svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  
  let x = d3.scaleBand().domain(years).range([0, width]).padding(0.2);
  let ymax = d3.max(data, function(d) { return parseFloat(d[1]); });
  let y = d3.scaleLinear().domain([0, ymax]).range([height, 0]);
  
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));
  
  svg.append("g")
    .selectAll("asdfasdfasdfasdf")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d, i) { return x(d[0]); })
      .attr("y", function(d, i) { return y(d[1]); })
      .attr("height", function(d, i) { return height - y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("fill", "red")
}
