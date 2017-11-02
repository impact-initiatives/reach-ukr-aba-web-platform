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

    var features = map.queryRenderedFeatures(e.point);
    var feature = features[0];
    var selected_settlement = feature.properties['KOATUU'];

    universeCharts(dataset, selected_settlement)

});


