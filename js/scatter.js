// let margin = ({top: 30, right: 20, bottom: 50, left: 50});
// let height = 500;
// let width = 800;

d3.csv(
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMHM-rI4V3j2d3Uqeg9qza2d0pBnyEW5jc6o19lxP82XFJG9dDFzPq5yFXafZdLoz79MjUsq1M4mTv/pub?gid=0&single=true&output=csv'
)
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
  
  d3.csv(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPAbYPBeTuhnQwUxyEkoF604ie5tD6x2TBu5bp2jzMa_u8gqKT9BAEQkfzXa9wqXorMO1Wgq34YLYY/pub?output=csv'
  )
  .then(function(data) { return data; })
  .then(function(rawPop) {
    
    let popResult = new Array();
    rawPop.forEach(function(popRow) {
      let popData = [popRow['Country Name'], popRow['2018']];
      popResult.push(popData);
    });
    
    console.log(popResult);
    
    
    let svg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  });
});
