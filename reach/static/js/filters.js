function filerContainers(filters) {

    var filterContainer = d3.select("#filters")
        .selectAll("div")
        .data(filters)
        .enter();

    filterContainer.append("label")
        .attr("class", "col-3 col-form-label")
        .text(function (d) {
            return d.label + ':';
        });

    filterContainer
        .append('div')
        .attr("class", "col-7")
        .append("select")
        .attr("id", function (d) {
            return d.id;
        })
        .attr("placeholder", 'Select Settlement')
        .attr("style", "display: none");

    filterContainer
        .append('div')
        .attr("class", "col-2")
        .append('button')
        .attr('type', 'button')
        .attr("class", "btn btn-secondary")
        .attr("style", "position: absolute; bottom: 5px;")
        .attr("id", "reset")
        .text('Clear')

}


function zoomIn(center, zoom) {
    map.flyTo({
        center: center,
        zoom: zoom
    })
}

var createFilter = function (container, dim, settlements) {
    // console.log(settlements);
    var filteredData = [];
    var have_values = (container === '#settlements');
    // var resetDim = function (dim) {
    //     dim.filterAll();
    //     filteredData = dim.top(Infinity);
    //     // pointsLayer(filteredData);
    // };


    // "adm4NameLa"
    // "KOATUU"

    d3.select(container).selectAll('li')
        .data(dim.map(function (d) {
            return d.properties
        }))
        .enter()
        .append('option')
        .attr({
            'value': function (d) {
                return d['KOATUU']
            }
        })
        .text(function (d) {
            return (have_values ? d['adm4NameLa'] : d)
        });

    var SelectObj = $(container).selectize({
        // plugins: ['remove_button'],
        // delimiter: ',',
        persist: false,
        create: false,
        sortField: 'text'
    });

    SelectObj.on('change', function (val) {

        var filters = [];

        d3.select(container)
            .selectAll("option").each(function (d, i) {
            var value = $(this).val();
            // d3.select(this).text();
            filters.push(value);
        });


        // resetDim(dim);

        if (filters.length != 0) {

            var last_selected = $(this).val();

            if (container === '#settlements' && last_selected !== '') {


                // var last_selected = selected_settlements[selected_settlements.length - 1];

                function getCentroid(code) {
                    return [
                        settlements[code]['I'],
                        settlements[code]['J']
                    ]
                }

                function zoomSettlement(code) {
                    zoomIn(getCentroid(code), 12)
                }

                zoomSettlement(last_selected)


            }
        }

        // d3.select("#counter").html(dim.top(Infinity).length);

    });


};