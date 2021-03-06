let margin = ({top: 30, right: 50, bottom: 70, left: 70});
let height = 500;
let width = 800;

////////////////////////////////
//   Data loading and cleanup
////////////////////////////////
d3.csv('data/spending.csv')
.then(function(data) { return data; })
.then(function(raw) {
  let countriesToSort = new Array();
  raw.forEach(function(dataRow){
    countriesToSort.push([dataRow.Country, dataRow['2018']]);
  });
  countriesToSort.sort(function(a, b) {
    let aParsed = 0;
    let bParsed = 0;
    if (!isNaN(parseFloat(a[1]))) { aParsed = parseFloat(a[1]); }
    if (!isNaN(parseFloat(b[1]))) { bParsed = parseFloat(b[1]); }
    if (aParsed < bParsed) { return 1; }
    return -1;
  });

  let countryList = ["Choose a Country"];
  countriesToSort.forEach(countryAndRank => countryList.push(countryAndRank[0]));
  
  ////////////////////////////////
  //   Populating Input List
  ////////////////////////////////
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
  
  let numYears = 71;
  let is = [...Array(numYears).keys()];
  let years = is.map(i => i + 1949);
      
  d3.select("#barchart").select("svg").remove();

  /////////////////////////////
  //   Setup Chart Elements 
  /////////////////////////////
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
  
  ///////////////////////////
  //   Drawing the Chart 
  ///////////////////////////  
  svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d, i) { return x(d[0]); })
      .attr("y", function(d, i) { return y(d[1]); })
      .attr("height", function(d, i) { return height - y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("fill", "#8c0010")
 
    ///////////////
    //   Tooltip 
    ///////////////
    var tooltip = d3.select("#barchart")
      .append("div")
      .style("opacity", 0)
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
  
  ////////////////////
  //   Axis Labels 
  ////////////////////  
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + ", " + (height + margin.top + 15) + ")")
    .style("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("Year")
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.right)
    .attr("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Spending (in Millions of 2018 USD)")
}
