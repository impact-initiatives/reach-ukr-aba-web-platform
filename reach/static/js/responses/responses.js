function loadResponses(fields, data, choices, quest) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';
    var map = new mapboxgl.Map({
        container: 'map-container', // container id
        style: 'mapbox://styles/mapbox/streets-v10', //stylesheet location
        center: [38.713, 48.040], // starting position
        zoom: 8, // starting zoom
        maxBounds: [
            [29.621, 45.537], // Southwest coordinates
            [43.374, 50.986]  // Northeast coordinates
        ]
    });


    map.on('load', function () {

        var features = [];

        data.forEach(function (e, id) {
            var lat = e['_gpslocation_latitude'],
                lon = e['_gpslocation_longitude'];
            var feature = newFeature(lon, lat, id, e);

            features.push(feature);
        });


        map.addSource('responses', {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: features
            }
        });


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
    });

    map.on('click', function (e) {

        var features = map.queryRenderedFeatures(e.point);

        var feature = features[0];

        if (!features.length) {
            return;
        }

        if (feature.layer.source == 'responses') {
            var ind = feature.properties['id'];
            renderTable(fields, data[ind]);

            $('#myModal').modal('show');

        }



    });


    function changeColors(field, choices, quest) {

        console.log(quest[field])
        console.log(choices)

        var colors = [
                'rgb(246,158,97)',
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
                'rgb(88,88,90)',
                'rgb(209,211,212)',
                'rgb(238,88,89)',
                'rgb(210,203,184)'
            ];

            var color_list = [];

            var choices_list = choices[quest[field]].map(function(choice) {
                return choice.label_english
            });

            choices_list.forEach(function (e,i) {
                color_list.push([e,colors[i]])
            });

            console.log(color_list);



            var legend = d3.select(".legend")

            legend.selectAll('div').remove();

            var items =legend.selectAll(".legend")
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

            color = {
                property: field,
                type: 'categorical',
                stops: color_list
            };

            map.setPaintProperty('responses', 'circle-color', color);

    }

    var qkeys = Object.keys(quest);

        var qlabels = qkeys.map(function (key) {
            return [key ,fields[key]]
        });

        d3.select("#questions")
            .selectAll('#questions')
            .data(qlabels)
            .enter()
            .append("option")
            .text(function (d) {
                return d[1];
            })
            .attr({
                'value': function (d) {
                return d[0];
            }});

        $("#questions").selectize({
            persist: false,
            create: false,
            sortField: 'text'
        })
        .on('change', function (e) {

           question = $(this).val();
           changeColors(question, choices, quest)

        });
}

