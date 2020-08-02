// let margin = ({top: 30, right: 20, bottom: 50, left: 50});
// let height = 500;
// let width = 800;

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
      if (popAttempt.length) {
        popThing = popAttempt[1];
      } else {
        popThing = 0;
      }
      consolidatedData.push([spendPoint[0], spendPoint[1], popThing]);
    });
    
    console.log(consolidatedData);
    let svg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  });
});
