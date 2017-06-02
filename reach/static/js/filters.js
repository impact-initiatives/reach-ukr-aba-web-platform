function filerContainers(filters) {

    var filterContainer = d3.select(".filters")
        .append("div")
        .selectAll("div")
        .data(filters)
        .enter()
        .append("div")
        .attr("class", "filter");

    filterContainer.append("label")
        .text(function (d) {
            return d.label + ':';
        });

    filterContainer.append("select")
        .attr("id", function (d) {
            return d.id;
        })
        .attr("multiple", true)
        .attr("style", "display: none");
}


var createFilter = function (container, dim) {

    var filteredData = [];

    var resetDim = function(dim) {
        dim.filterAll();
        filteredData = dim.top(Infinity);
        pointsLayer(filteredData);
    };

    d3.select(container).selectAll('li')
        .data(
            dim.group().all().map(function(d) { return d.key })
        )
        .enter()
        .append('option')
        .attr({ 'value': function(datum) { return datum } })
        .text(function(datum) { return datum });

    var SelectObj = $(container).selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        persist: false,
        create: false,
        sortField: 'text'
    });

    SelectObj.on('change', function (e) {

        // if (container == '#settlements') {
        //     console.log(e.currentTarget.lastChild.value)
        // }

    });

    SelectObj.on('change', function (val) {

        var filters = [];

        d3.select(container)
        .selectAll("option").each( function(d, i){
            var value = d3.select(this).text();
            filters.push(value);
        });

        // if (container == '#settlements') {
        //     console.log(val)
        // }

        resetDim(dim);

        if (filters.length != 0) {

            dim.filterFunction(function(d) { return filters.indexOf(d) != -1 });
            filteredData = dim.top(Infinity);
            pointsLayer(filteredData);

        }

    });


};