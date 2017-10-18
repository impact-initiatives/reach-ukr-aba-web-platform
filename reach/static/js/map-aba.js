// Initialize map container with style and basic config

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';

var map = new mapboxgl.Map({
    container: 'map-container', // container id
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [38.713, 48.040], // starting position
    zoom: 8, // starting zoom
    maxBounds: [
        [29.621, 45.537], // Southwest coordinates
        [43.374, 50.986]  // Northeast coordinates
    ]
});

// map.addControl(new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken
// }));

var filterGroup = document.getElementById('filter-group');

var pointsLayer = function (source, quest, choices, fields) {

    var geoData = {
        type: "FeatureCollection",
        features: source
    };

    g_fields = fields;
    g_data = source;
    g_choices = choices;
    g_quest = quest;

    var sectors = [
        ['Bank', '#fbb03b'],
        ['Post', '#223b53'],
        ['Health', '#e55e5e'],
        ['Government', '#9b59b6'],
        ['Education', '#8bc34a'],
        ['Transport', '#bdc3c7'],
        ['Market', '#3bb2d0']
    ];

    if (map.getSource('responses')) {
        map.getSource('responses').setData(geoData);
    }

    if (!map.getLayer("settlements")) {
        map.addLayer({
            "id": "settlements",
            "type": "fill",
            "source": "responses",
            "layout": {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': 'green',
                'fill-opacity': 0.5,
                'fill-outline-color': '#000000'
            },
            "filter": ["==", "$type", "Polygon"]
        });
    }

    if (!map.getLayer('responses')) {
        map.addLayer({
            "id": "responses",
            "type": "circle",
            // "type": "symbol",
            "source": "responses",
            "layout": {
                'visibility': 'visible'
                // "icon-image": "star-15",
                // "icon-allow-overlap": true
            },
            // 'minzoom': 10,
            'paint': {
                'circle-radius': 6,
                'circle-color': {
                    property: 'Sector',
                    type: 'categorical',
                    stops: sectors
                },
                'circle-stroke-color': '#000000',
                'circle-stroke-width': 1,
                "circle-opacity": 1
            },
            "filter": ["==", "$type", "Point"]
        });
    }


    map.on('load', function () {

        // Popup onclick logic
        map.on('click', function (e) {

            var features = map.queryRenderedFeatures(e.point);
            var feature = features[0];

            // Populate the popup and set its coordinates
            // based on the feature found.
            if (!features.length) {
                return;
            }

            if (feature.layer.id == 'responses') {
                renderTable(g_fields, feature.properties);
            }

            if (feature.layer.id == 'services') {
                var popup = new mapboxgl.Popup()
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML(
                        '<b>Oblast:</b> '
                        + feature.properties['ADMIN_1_EN']
                        + '<br>'
                        + '<b>Full name:</b> '
                        + feature.properties['NAME']
                    )
                    .addTo(map);
            } else if (feature.layer.source == 'transport') {
                var popup = new mapboxgl.Popup()
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML(feature.properties['NAME'])
                    .addTo(map);

            } else if (feature.layer.id == 'settlements') {

                var template = _.template("" +
                    "<b>Name:</b> <%= type %>. <%= name_ua %><br>" +
                    "<b>Name (en):</b> <%= name_en %><br>" +
                    "<b>Raion:</b> <%= name_ray %><br>" +
                    "<b>Oblast:</b> <%= name_obl %><br>" +
                    "<b>Population:</b> <%= population %><br>" +
                    "");


                var compiled = template(
                    {
                        type: feature.properties['TYPE'],
                        name_ua: feature.properties['NAME_UA'],
                        name_en: feature.properties['NAME_LAT'],
                        name_ray: feature.properties['NAME_RAY'],
                        name_obl: feature.properties['NAME_OBL'],
                        population: feature.properties['POPULATION']
                    }
                );

                $('#myModal2 .modal-body').html(compiled)
                $('#myModal2').modal('show');


                // var popup = new mapboxgl.Popup()
                // .setLngLat(e.lngLat)
                // .setHTML(
                //     '<b>Name:</b> ' + feature.properties['TYPE'] + '. ' + feature.properties['NAME_UA'] +'<br>'+
                //     '<b>Name (en):</b> ' + feature.properties['NAME_LAT'] +'<br>'+
                //     '<b>Raion:</b> ' + feature.properties['NAME_RAY'] +'<br>'+
                //     '<b>Oblast:</b> ' + feature.properties['NAME_OBL'] +'<br>'+
                //     '<b>Population:</b> ' + feature.properties['POPULATION']
                // )
                // .addTo(map);

            }


        });

        var toggleableLayerIds = ['settlements', 'buffer', 'responses'];

        for (var i = 0; i < toggleableLayerIds.length; i++) {
            var id = toggleableLayerIds[i];

            var link = document.createElement('a');
            link.href = '#';
            link.className = 'active';
            link.textContent = id;

            link.onclick = function (e) {
                var clickedLayer = this.textContent;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    this.className = '';
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
            };

            var layers = document.getElementById('menu');
            layers.appendChild(link);
        }

        map.on('mouseenter', 'responses', function (e) {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'responses', function () {
            map.getCanvas().style.cursor = '';
            // popup.remove();
        });

        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'responses', function (e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.description)
                .addTo(map);
        });


        // map.on("mousemove", function (e) {
        //     console.log('moved')
        //     map.getCanvas().style.cursor = 'pointer';
        // });

    });

    map.setPaintProperty('responses', 'circle-color', 'rgb(238,88,89)');

    if (quest !== undefined) {
        updateSelect(quest, choices, fields);
    }


};

function compileInfo(e) {
    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (!features.length) {
        return;
    }

    var template = _.template("" +
        // "<b>Name:</b> <%= type %>. <%= name_ua %><br>" +
        '<h3><%= name_en %> (<%= name_ray %>) <small class="text-muted"><%= name_obl %> oblast</small></h3>' +
            '<h3><%= population %> <small class="text-muted">total population</small></h3>' +
        "");

    if (feature.layer.id === 'centroids') {

        var compiled = template(
            {
                // type: feature.properties['Admin_4_Level_TYPE'],
                // name_ua: feature.properties['Admin_4_Level_NAME_UA'],
                name_en: feature.properties['adm4NameLa'],
                name_ray: feature.properties['adm2NameLa'],
                name_obl: feature.properties['adm1NameLa'],
                population: feature.properties['Population']
            }
        );

        $('#info').html(compiled);
    }
}
var dataset = []
function MapInit(polygons, buffer, centroids, settlements, bsus, wide, datasets, single_choice) {

    // var dt = crossfilter(data);
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
            // "type": "symbol",
            "source": "centroids",
            "layout": {
                'visibility': 'visible'
                // "icon-image": "star-15",
                // "icon-allow-overlap": true
                // "icon-image": "star-15",
                // "icon-allow-overlap": true
            }
            // 'minzoom': 10,
            , 'paint': {
                'circle-radius': 6,
                // 'circle-color': '#56b3cd',
                'circle-color': {
                    property: 'BSU_ID',
                    type: 'categorical',
                    stops: sectors
                },

                // {
                //     property: 'Sector',
                //     type: 'categorical',
                //     stops: sectors
                // },

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

    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];
    var selected_settlement = feature.properties['KOATUU'];

    universeCharts(dataset, selected_settlement)

});


