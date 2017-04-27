// Initialize map container with style and basic config

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/denysboiko/cj1xa26yq003y2spcbctgp7v0', //stylesheet location
    center: [38.713, 48.040], // starting position
    zoom: 8 // starting zoom
});


var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});

map.addControl(draw);
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));

var filterGroup = document.getElementById('filter-group');

var pointsLayer = function(source) {

    var geoData = {
        type: "FeatureCollection",
        features: source
    };

    if (map.getSource('schools')) {
        map.getSource('schools').setData({
            type: "FeatureCollection",
            features: source
        });
    }

    source.forEach(function(feature) {
        var oblast = feature.properties['ADMIN_1_EN'];

        var type = feature.properties['TYPE_ENG'];

        var layerID = oblast+'-schools';

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                "type": "circle",
                "source": "schools",
                "layout": {
                    'visibility': 'visible'
                },
                'minzoom': 10,
                'paint': {
                    'circle-radius': 6,
                    'circle-color': 'rgba(255,0,0,1)',
                    'circle-stroke-color': '#000000',
                    'circle-stroke-width': 1,
                    "circle-opacity": 1
                }
                , "filter": ["==", "ADMIN_1_EN", oblast]
            });

        }

    });

};


function MapInit(schools, community_areas, ca2, settlements){

    map.on('load', function () {

        map.addSource('settlements', {
            type: 'geojson',
            data: settlements
        });

        map.addSource('community_areas', {
            type: 'geojson',
            data: community_areas
        });
        map.addSource('transport', {
            type: 'geojson',
            data: ca2
        });


        map.addLayer({
            "id": "settlements",
            "type": "fill",
            "source": "settlements",
            "layout": {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': 'green',
                'fill-opacity': 0.5,
                'fill-outline-color': '#000000'
            }
        });
        map.addLayer({
            "id": "community_areas",
            "type": "fill",
            "source": "community_areas",
            "layout": {
                'visibility': 'visible'
            },
            'minzoom': 10,
            'paint': {
                'fill-color': 'green',
                'fill-opacity': 0.8,
                'fill-outline-color': '#000000'
            }
        });
        map.addLayer({
            "id": 'transport',
            "type": "circle",
            "source": "transport",
            "layout": {
                'visibility': 'visible'
            },
            'minzoom': 10,
            'paint': {
                'circle-radius': 6,
                'circle-color': '#b6f666',
                'circle-stroke-color': '#000000',
                'circle-stroke-width': 1,
                "circle-opacity": 1
            }
        });

        // console.log(schools);

        map.addSource('schools', {
            type: 'geojson',
            clusterMaxZoom: 10,
            data: schools
        });

        pointsLayer(schools.features)

    });


    // Popup onclick logic

    map.on('click', function (e) {

        var features = map.queryRenderedFeatures(e.point);

        var feature = features[0];
        // Populate the popup and set its coordinates
        // based on the feature found.

        if (!features.length) {
            return;
        }

        if (feature.layer.source == 'schools') {
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
                '<b>Oblast:</b> '
                +feature.properties['ADMIN_1_EN']
                +'<br>'
                +'<b>Full name:</b> '
                +feature.properties['FULL_NAM_1']
            )
            .addTo(map);
        } else if (feature.layer.source == 'transport') {
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.name)
            .addTo(map);

        } else if (feature.layer.source == 'settlements') {
            var popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                '<b>Назва:</b> ' + feature.properties['TYPE'] + '. ' + feature.properties['NAME_UA'] +'<br>'+
                '<b>Район:</b> ' + feature.properties['NAME_RAY'] +'<br>'+
                '<b>Область:</b> ' + feature.properties['NAME_OBL'] +'<br>'+
                '<b>Населення:</b> ' + feature.properties['POPULATION']
            )
            .addTo(map);

        }


    });

    var toggleableLayerIds = [ 'settlements', 'community_areas', 'transport', 'Donetska-schools', 'Luhanska-schools', ];

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

    map.on('mouseenter', 'transport', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        }).setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.name)
            .addTo(map);
    });

    map.on('mouseleave', 'places', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}



