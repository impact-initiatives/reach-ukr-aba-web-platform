function newFeaturePoint(longitude, lattitude, data) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [longitude, lattitude]
        },
        "properties": data
    };
}
function toPoints(lon, lat, data) {
    return data.map(function (datum, index) {
        return newFeaturePoint(datum[lon], datum[lat], datum)
    });
}
function changeColors(map, field, choices, quest) {

    var colors = [
        'rgb(141,211,199)',
        'rgb(255,255,179)',
        'rgb(190,186,218)',
        'rgb(251,128,114)',
        'rgb(128,177,211)',
        'rgb(253,180,98)',
        'rgb(179,222,105)',
        'rgb(252,205,229)',
        'rgb(217,217,217)',
        'rgb(188,128,189)',
        'rgb(204,235,197)',
        'rgb(255,237,111)',
        'rgb(246,158,97)',
        'rgb(88,88,90)',
        'rgb(209,211,212)',
        'rgb(238,88,89)',
        'rgb(210,203,184)'
    ];

    var color_list = [];

    var choices_list = choices[quest[field]].map(function (choice) {
        return choice.label
    });

    choices_list.forEach(function (e, i) {
        color_list.push([e, colors[i]])
    });

    var legend = d3.select(".legend");

    legend.selectAll('div').remove();

    var items = legend.selectAll(".legend")
        .data(color_list)
        .enter()
        .append("div");

    items.append("span")
        .attr('style', function (d) {
            return "background-color: " + d[1];
        }).attr('class', 'marker');

    items.append("span").text(function (d) {
        return d[0];
    });

    var color = {
        property: field,
        type: 'categorical',
        stops: color_list
    };

    map.setPaintProperty('responses', 'circle-color', color);

}