let margin = ({top: 30, right: 50, bottom: 70, left: 70});
let height = 500;
let width = 800;

let myChart = d3
  .csv('data/spending.csv')
  .then(function(data) { return data; })
  .then(function(raw) {
    var result = new Object();
    var countries = new Array();

    let baseYear = 1995;
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

    let data = Object.values(result)

    let keys = ["USA", "Russia", "Saudi Arabia", "France", "UK", "Korea, South", "China", "Japan", "India", "Germany", "Brazil", "Italy", "Australia", "Canada", "Israel"];

    let x = d3.scaleLinear()
      .domain([baseYear, 2019])
      .range([0, width]);

    let series = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut)
      (data);

    let mutateSeries = series.forEach(function(row){ 
      row.forEach(function(ys){
        if (isNaN(ys[1])) {
          ys[1] = 0;
        };
      });
    });

    let y = d3.scaleLinear()
      .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height, 0]);

    let area = d3.area()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    let color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeTableau10); // TODO better interpolations?

    const svg = d3.select("#streamgraph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    
    svg.append("g")
      .selectAll("path")
      .data(series)
      .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
      .append("title")
        .text(({key}) => key);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).ticks(numYears).tickFormat(d3.format("d")))
      .call(g => g.select(".domain").remove());
    
    var tooltip = d3.select("#streamgraph")
      .append("div")
      .attr("class", "tooltip");
    
    svg.selectAll("path")
      .on("mouseover", function() {
        tooltip.transition().style("visibility", "visible").style("opacity", 0.9);
      })
      .on("mouseout", function() {
        tooltip.transition().style("visibility", "hidden").style("opacity", 0);
      })
      .on("mousemove", function(d) {
        tooltip
          .html("<p><br>Country: " + d['key'] + "</br></p>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px")
      });
      
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + ", " + (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "20px")
      .text("Year")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.right)
      .attr("font-size", "20px")
      .style("text-anchor", "middle")
      .text("Relative Spending")

});
