let margin = ({top: 30, right: 20, bottom: 50, left: 50});
let height = 500;
let width = 800;

d3.csv('data/spending.csv')
.then(function(data) { return data; })
.then(function(raw) {
  var countryList = new Array();
  raw.forEach(function(dataRow){
    countryList.push(dataRow.Country);
  });
  
  //console.log(countryList);

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
  //console.log(data);
  
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
  
  let xticks = [1950,1955,1960,1965,1970,1975,1980,1985,1990,1995,2000,2005,2010,2015];
  
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickValues(xticks));
  svg.append("g").call(d3.axisLeft(y));
  
  svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d, i) { return x(d[0]); })
      .attr("y", function(d, i) { return y(d[1]); })
      .attr("height", function(d, i) { return height - y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("fill", "red")
  
    var tooltip = d3.select("#barchart")
      .append("div")
      .attr("class", "tooltip");
    
    svg.selectAll("rect")
      .on("mouseover", function() {
        tooltip.transition().style("visibility", "visible").style("opacity", 0.9);
      })
      .on("mouseout", function() {
        tooltip.transition().style("visibility", "hidden").style("opacity", 0);
      })
      .on("mousemove", function(d) {
        tooltip
          .html("<p><br>Year: " + d[0] + "</br><br>Spending: $" + d[1] + " million</br></p>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
    });
}
