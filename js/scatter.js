let margin = ({top: 30, right: 20, bottom: 50, left: 50});
let height = 500;
let width = 800;

d3.csv('data/spending.csv')
.then(function(data) { return data; })
.then(function(raw) {
  let spendResult = new Array();
  
  raw.forEach(function(dataRow) {
    var spend = 0;
    if (isNaN(dataRow['2018'])) {
      spend = 0;
    } else {
      spend = dataRow['2018'];
    }
    let spendData = [dataRow['Country'], spend];
    spendResult.push(spendData);
  });
  
  console.log(spendResult);
  
  d3.csv('data/pop.csv')
  .then(function(data) { return data; })
  .then(function(rawPop) {
    
    let popResult = new Array();
    rawPop.forEach(function(popRow) {
      let popData = [popRow['Country Name'], popRow['2018']];
      popResult.push(popData);
    });
    
    console.log(popResult);
    
    let consolidatedData = new Array();
    
    spendResult.forEach(function(spendPoint) {
      let country = spendPoint[0].toLowerCase();
      let popAttempt = popResult.filter(thing => thing[0].toLowerCase() == country);
      var popThing = 0;
      if (popAttempt.length > 0) {
        popThing = popAttempt[0][1];
      } else {
        popThing = 0;
      }
      consolidatedData.push([spendPoint[0], spendPoint[1], popThing]);
    });
    
    var filteredConsolidatedData = consolidatedData.filter(d => !isNaN(d[1]) && !isNaN(d[2]));
    console.log(filteredConsolidatedData);
    
    let svg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    let x = d3.scaleLog().domain([1, 2000000000]).range([0, width]);
    let y = d3.scaleLog().domain([0.01, 1000000]).range([height, 0]);
    
    let xticks = [1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000];
    let yticks = [0.01,0.1,1,10,100,1000,10000,100000,1000000];
    
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickValues(xticks).tickFormat(d3.format(".2s")));
    svg.append("g").call(d3.axisLeft(y).tickValues(yticks).tickFormat(d3.format(".2s")));
    
    svg.selectAll("circle")
      .data(filteredConsolidatedData)
      .enter()
      .append("circle")
      .attr("cx", function(d,i) { return x(d[2]); })
      .attr("cy", function(d,i) { return y(d[1]); })
      .attr("r", 4)
    
    var tooltip = d3.select("#scatterplot")
      .append("div")
      .attr("class", "tooltip");
    
    svg.selectAll("circle")
      .on("mouseover", function() {
        tooltip.transition().style("visibility", "visible").style("opacity", 0.9);
      })
      .on("mouseout", function() {
        tooltip.transition().style("visibility", "hidden").style("opacity", 0);
      })
      .on("mousemove", function(d) {
        tooltip
          .html("<p><br>Country: " + d[0] + "</br><br>Population: " + d[2] + "</br><br>Spending: " + d[1] + "</br></p>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
//         console.log(event.pageX);
//         console.log(d3.select(this).attr("cx"));
//         console.log(event.pageY);
//         console.log(d3.select(this).attr("cy"));
    });

  });
});
