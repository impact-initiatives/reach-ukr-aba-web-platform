var g_fields,
    g_data,
    g_choices,
    g_quest;

function loadResponses(fields, data, choices, quest) {

    g_fields = fields;
    g_data = data;
    g_choices = choices;
    g_quest = quest;


    var features = toPoints('_gpslocation_longitude', '_gpslocation_latitude', data);

    if (map.getSource('responses')) {
        map.getSource('responses').setData({
            type: "FeatureCollection",
            features: features
        });
    } else {
        map.addSource('responses', {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: features
            }
        });
    }


    if (!map.getLayer("responses")) {
        map.addLayer({
            "id": "responses",
            "type": "circle",
            "source": "responses",
            "layout": {
                'visibility': 'visible'
            },
            'paint': {
                'circle-radius': 6,
                'circle-color': 'rgb(238,88,89)',


                'circle-stroke-color': '#000000',
                'circle-stroke-width': 1,
                "circle-opacity": 1
            }
        });
    }

    map.setPaintProperty('responses', 'circle-color', 'rgb(238,88,89)');

    updateSelect(quest, choices, fields);

}


function updateSelect(quest, choices, fields) {

    var question_names = Object.keys(quest);
// Accessing list of question names

// Creating iterable array with question names and labels
    var question_labels = question_names.map(function (key) {
        return [
            key,
            fields[key]
        ]
    });


    var questions_select = d3.select("#questions");
    questions_select.html('');
    var questions_options = questions_select
        .selectAll('option')
        .data(question_labels);

    // questions_options.exit().remove();

    questions_options
        .enter()
        .append("option")
        .text(function (d) {
            return d[1];
        })
        .attr({
            'value': function (d) {
                return d[0];
            }
        });

    $("#questions").off();

    // if ($("#questions")[0].selectize) {
    //     $("#questions")[0].selectize.destroy();
    // }
    // $("#questions")
    //     .selectize({
    //         persist: false,
    //         create: false,
    //         sortField: 'text'
    //     });

    $("#questions").on('change', function (e) {
        changeColors(map, $(this).val(), choices, quest);
        console.log(quest)
    });

}


map.on('click', function (e) {

    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];

    if (!features.length) {
        return;
    }

    if (feature.layer.source === 'responses') {
        renderTable(g_fields, feature.properties);
    }

});

// map.on('click', 'responses', function (e) {
//     map.flyTo({center: e.features[0].geometry.coordinates});
// });




// Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
map.on('mouseenter', 'responses', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'responses', function () {
    map.getCanvas().style.cursor = '';
});