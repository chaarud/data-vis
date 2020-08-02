let margin = ({top: 30, right: 50, bottom: 70, left: 70});
let height = 500;
let width = 800;

d3.csv('data/spending.csv')
.then(function(data) { return data; })
.then(function(raw) {
  let spendResult = new Array();
  
  raw.forEach(function(dataRow) {
    let spend = dataRow['2018'];
    if (!isNaN(spend) && spend != 0.0) {
      let spendData = [dataRow['Country'], spend];
      spendResult.push(spendData);
    }
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

    let x = d3.scaleLog().domain([10000, 2000000000]).range([0, width]);
    let y = d3.scaleLog().domain([1, 1000000]).range([height, 0]);
    
    let xticks = [10000,100000,1000000,10000000,100000000,1000000000];
    let yticks = [1,10,100,1000,10000,100000,1000000];
    
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickValues(xticks).tickFormat(d3.format(".2s")));
    svg.append("g").call(d3.axisLeft(y).tickValues(yticks).tickFormat(d3.format(".2s")));
    
    svg.selectAll("circle")
      .data(filteredConsolidatedData)
      .enter()
      .append("circle")
      .attr("cx", function(d,i) { return x(d[2]); })
      .attr("cy", function(d,i) { return y(d[1]); })
      .attr("r", function(d) { return Math.max(2, Math.log(10000 * d[1] / d[2]) * 5); })
      .style("fill", "#2048e6")
    
    var tooltip = d3.select("#scatterplot")
      .append("div")
      .style("opacity", 0)
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
          .html("<p><br>Country: " + d[0] + "</br><br>Population: " + d[2] + "</br><br>Spending: $" + d[1] + " Million</br></p>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
//         console.log(event.pageX);
//         console.log(d3.select(this).attr("cx"));
    });

    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + ", " + (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "20px")
      .text("Population")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.right)
      .attr("font-size", "20px")
      .style("text-anchor", "middle")
      .text("Spending (in Millions of 2018 USD)")
    
    svg.append("line")
      .attr("x1", 650)
      .attr("y1", 20)
      .attr("x2", 500)
      .attr("y2", 40)
      .attr("stroke-width", 3)
      .attr("stroke", "red")
    
    svg.append("text")
      .attr("x", 500)
      .attr("y", 40)
      .attr("font-family", "sans-serif")
      .attr("font-size", 16)
      .style("fill", "darkred")
      .attr("text-anchor", "start")
      .html("The US not only has the world's highest military spending,<br>it is also in the upper tier for spending per capita.")
  });
});
