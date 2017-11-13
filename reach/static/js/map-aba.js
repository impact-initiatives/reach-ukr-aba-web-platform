// Initialize map container with style and basic config

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';

var map = new mapboxgl.Map({
    container: 'map-container', // container id
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [38.713, 48.040], // starting position
    zoom: 6, // starting zoom
    maxBounds: [
        [29.621, 45.537], // Southwest coordinates
        [43.374, 50.986]  // Northeast coordinates
    ]
});

function compileInfo(e) {
    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];

    if (!features.length) {
        return;
    }

    var template = _.template("" +
        '<h3><%= name_en %> (<%= name_ray %>) <small class="text-muted"><%= name_obl %> oblast</small></h3>' +
        '<h3><%= population %> <small class="text-muted">total population</small></h3>' +
        "");

    if (feature.layer.id === 'centroids') {

        var compiled = template(
            {
                name_en: feature.properties['adm4NameLa'],
                name_ray: feature.properties['adm2NameLa'],
                name_obl: feature.properties['adm1NameLa'],
                population: feature.properties['Population']
            }
        );

        $('#info').html(compiled);
    }
}

var dataset = [];
var sc = []
function MapInit(polygons, buffer, centroids, settlements, bsus, wide, datasets, single_choice) {



    // single_choice.filter(function(d) {
    //     return d.
    // })

    // var dt = crossfilter(data);
    sc = single_choice;
    dataset = datasets;

    map.addSource('buffer', {
        type: 'geojson',
        data: buffer
    });
    map.addSource('BSUs', {
        type: 'geojson',
        data: bsus
    });
    map.addSource('polygons', {
        type: 'geojson',
        data: polygons
    });
    map.addSource('centroids', {
        type: 'geojson',
        data: centroids
    });

    map.addLayer({
        "id": "buffer",
        "type": "fill",
        "source": "buffer",
        "layout": {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': '#aaaaaa',
            'fill-opacity': 0.75,
            'fill-outline-color': '#000000'
        }
    });
    map.addLayer({
        "id": "BSUs",
        "type": "fill",
        "source": "BSUs",
        "layout": {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': '#ffffff',
            'fill-opacity': 0.75,
            'fill-outline-color': '#E2D8CA'
        }
    });
    map.addLayer({
        "id": "bsu-borders",
        "type": "line",
        "source": "BSUs",
        "layout": {
            'visibility': 'visible'
        },
        'paint': {
            "line-color": "#E2D8CA",
            "line-width": 3
        }
    });
    if (!map.getLayer("settlements")) {
        map.addLayer({
            "id": "settlements",
            "type": "fill",
            "source": "polygons",
            "layout": {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': '#fff67a',
                'fill-opacity': 1,
                'fill-outline-color': '#000000'
            }
            // "filter": ["==", "$type", "Multi"]
        });
    }

    var sectors = [
        ['4', '#A5C9A1'], //Mariupol
        ['5', '#56B3CD'], //Kurakhove
        ['1', '#806B68'], //Ocheretyne
        ['3', '#F69E61'], //Toretsk
        ['2', '#EE5859'], //Bakhmut
        ['7', '#0067A9'], //Popasna
        ['6', '#95A0A9'] //Stanytsia Luhanska
    ];
    if (!map.getLayer('centroids')) {
        map.addLayer({
            "id": "centroids",
            "type": "circle",
            "source": "centroids",
            "layout": {
                'visibility': 'visible'
            }
            , 'paint': {
                'circle-radius': 6,
                'circle-color': {
                    property: 'BSU_ID',
                    type: 'categorical',
                    stops: sectors
                },
                'circle-stroke-color': '#000000',
                'circle-stroke-width': 1,
                "circle-opacity": 1
            }
            , "filter": ["==", "$type", "Point"]
        });
    }


    // Popup Logic
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'centroids', function (e) {
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.adm4NameLa)
            .addTo(map);
    });

    map.on('mouseleave', 'centroids', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('load', function (e) {
        // OnClick Logic
    });

}


map.on('click', function (e) {

    compileInfo(e);

    $('#all-info').css('display', '');
    $('#single-choice').html('');
    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];
    var selected_settlement = feature.properties['KOATUU'];

    universeCharts(dataset, selected_settlement);

    var select_one = sc.filter(function (d) {
        return d.KOATUU === selected_settlement;
    });


    var avails = {

        comm_q1: 'Police station',
        comm_q3: 'Local court',
        admin_q21_integer: 'Hospital',
        admin_q23_integer: 'Pharmacy'

    };

    var questions = {

        comm_q17: 'Are construction materials available in the community markets or in nearby markets?',
        comm_q66: 'Are there any landmines/other ERW in community?',
        comm_q69: 'Are there any child friendly space in the community?',
        comm_q71: 'Are psycho-social support services available in the community?',
        comm_q72: 'At which frequency has the community experienced shelling in the last 3 months?',
        comm_q73: 'What is the primary source of drinking water in the community?',
        comm_q74: 'Do most households treat the water before drinking?'

    };


    // function renderSingleChoice(question) {
    //
    //     var text = d3.select('#single-choice');
    //     text.append('h5')
    //         .text(questions[question]);
    //
    //
    //     text.append('div')
    //         .attr('id', question);
    //
    //
    //     var question_container = d3.select('#' + question)
    //         .append('table')
    //         .attr('class', 'table')
    //         .selectAll("table")
    //         .data(select_one.filter(function (d) {
    //             return d.question_name === question;
    //         }));
    //
    //     // .data(select_one.filter(function (d) {
    //     //         return d.representation === question;
    //     //     }));
    //
    //     // text.insert("h5", ":first-child").text(question);
    //
    //     var row = question_container.enter()
    //         .append("tr");
    //
    //
    //     row.append('td')
    //         .text(function (d) {
    //             return d.community_name;
    //
    //         })
    //
    //     row.append('td')
    //         .text(function (d) {
    //             return d.value_clean;
    //
    //         });
    //
    // }
    //
    // Object.keys(questions).map(function (d) {
    //     renderSingleChoice(d);
    // })

    // Object.keys(avails).map(function (d) {
    //     renderSingleChoice(d);
    // })

    // renderSingleChoice('#single-choice', 'comm_q66')
    // function renderSingleChoice(question) {
    //
    //     var text = d3.select('#single-choice');
    //     text.append('h5')
    //         .text(questions[question]);
    //
    //
    //     text.append('div')
    //         .attr('id', question);
    //
    //
    //     var question_container = d3.select('#' + question)
    //         .append('table')
    //         .attr('class', 'table')
    //         .selectAll("table")
    //         .data(select_one.filter(function (d) {
    //             return d.question_name === question;
    //         }));
    //
    //     // .data(select_one.filter(function (d) {
    //     //         return d.representation === question;
    //     //     }));
    //
    //     // text.insert("h5", ":first-child").text(question);
    //
    //     var row = question_container.enter()
    //         .append("tr");
    //
    //
    //     row.append('td')
    //         .text(function (d) {
    //             return d.community_name;
    //
    //         })
    //
    //     row.append('td')
    //         .text(function (d) {
    //             return d.value_clean;
    //
    //         });
    //
    // }
    //
    // Object.keys(questions).map(function (d) {
    //     renderSingleChoice(d);
    // })

    function renderSingleChoiceavail(availability) {

        d3.select('#services').selectAll('tbody').remove();
            // .selectAll("tr").remove();

        var avail_container = d3.select('#services')
            .selectAll("tbody")
            .data(availability);

        var row = avail_container
            .enter()
            .append("tr");


        row.append('td')
            .text(function (d) {
                return avails[d.question_name];
            });

        var icons = {
            0: "fa fa-times-circle",
            1: "fa fa-check-circle"
        };

        row
            .append('td')
            .append('i')
            .attr('class', function(d) {
                return d.value_clean === '' ? 'fa fa-question-circle' : icons[d.value_clean];
            });


    }

    renderSingleChoiceavail(elect_one.filter(function (d) {
        return Object.keys(avails).indexOf(d.question_name) !== -1
    }))

});


