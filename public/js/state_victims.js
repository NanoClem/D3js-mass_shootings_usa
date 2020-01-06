// create a csv 
// state  / number total of killed
// in order to color the map

d3.dsv(';')("datasets/mass-shootings-in-america.csv", function(data) {
    var expensesCount = d3.nest()
        .key(function(data) { return data.State; })
        .rollup(function(v) { 
            return {
                Total_Number_of_Victims: d3.sum(v, function(e) { return e.Total_Number_of_Victims; })
            };
        }).entries(data);
    console.log(expensesCount);
});
