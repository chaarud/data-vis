let margin = ({top: 0, right: 20, bottom: 30, left: 10});
let height = 500;
let width = 800;

d3.csv(
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMHM-rI4V3j2d3Uqeg9qza2d0pBnyEW5jc6o19lxP82XFJG9dDFzPq5yFXafZdLoz79MjUsq1M4mTv/pub?gid=0&single=true&output=csv'
)
.then(function(data) { return data; })
.then(function(raw) {
  var result = new Object();
  var countries = new Array();

  let baseYear = 1949;
  let numYears = 2020 - baseYear;
  let is = [...Array(numYears).keys()];
  is.forEach(i => result[i] = { year: i + baseYear });

  raw.forEach(function(dataRow){
    let country = dataRow.Country;

    Object.keys(dataRow).forEach(function(year){
      let val = dataRow[year];
      if (result.hasOwnProperty(year - baseYear)) {
        if (!isNaN(val)) {
          result[year - baseYear][country] = val;
        }
      }
    });
  });

  let data = Object.values(result);
  let countryList = Object.keys(data[data.length - 1]);

  console.log(countryList);

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
  
  return 42;
});

function drawChart(picked, raw) {
  let data = raw.filter(countryData => countryData.Country == picked);
  let foo = Object.entries(data[0]);
  console.log(foo);
  
  d3.select("#barchart").select("svg").remove();

  let svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  
  let x = d3.scaleLinear().domain([1949, 2019]).range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));
  
  svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d, i) { return x(i + 1949); })
      .attr("y", function(d, i) { return y(d[2]); })
      .attr("height", function(d, i) { return height - (y(d[2])); })
      .attr("fill", "red")
}
