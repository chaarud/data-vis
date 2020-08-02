let myChart = d3
  .csv(
    'data/spending.csv'
  )
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

    let margin = ({top: 0, right: 20, bottom: 30, left: 10});

    let height = 500 - margin.top - margin.bottom;
    let width = 1000 - margin.left - margin.right;

    let x = d3.scaleLinear()
      .domain([baseYear, 2019])
      .range([margin.left, width - margin.right]);

    let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).ticks(numYears).tickFormat(d3.format("d")))
      .call(g => g.select(".domain").remove());

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
      .range([height - margin.bottom, margin.top]);

    let area = d3.area()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    let color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeTableau10); // TODO better interpolations?

    const svg = d3.select("#streamgraph").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
      .selectAll("path")
      .data(series)
      .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
      .append("title")
        .text(({key}) => key);

    svg.append("g")
      .call(xAxis);
    
    svg.append("text")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Year");

    let chart = svg.node();
});
