function barChart() {
  let margin = ({top: 0, right: 20, bottom: 30, left: 10});
  let height = 500;
  let width = 800;
  
  d3.csv(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMHM-rI4V3j2d3Uqeg9qza2d0pBnyEW5jc6o19lxP82XFJG9dDFzPq5yFXafZdLoz79MjUsq1M4mTv/pub?gid=0&single=true&output=csv'
  )
  .then(function(data) { return data; })
  .then(function(data) {
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

    let data = Object.values(result);
    let countryList = Object.keys(data[data.length - 1]);
    
    console.log(countryList);
    
    d3.select("#country-picker")
      .selectAll("option")
      .data(countryList)
      .enter()
      .append("option")
      .text(function(countryName) { return countryName; });
  }
}

barChart();
