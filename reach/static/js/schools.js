// mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';
// var map = new mapboxgl.Map({
//     container: 'map', // container id
//     style: 'mapbox://styles/denysboiko/cizqwhcma002b2rkw9dws4zio', //stylesheet location
//     center: [38.713, 48.040], // starting position
//     zoom: 8 // starting zoom
// });

var filterGroup = document.getElementById('filter-group');

var pointsLayer = function(source) {

    // var geoData = {
    //     type: "FeatureCollection",
    //     features: source
    // };

    if (map.getSource('schools')) {
        map.getSource('schools').setData(source);
    }

    source.features.forEach(function(feature) {

        var oblast = feature.properties['ADMIN_1_EN'];

        var type = feature.properties['TYPE_ENG'];

        var layerID = 'obl-' + oblast;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                "type": "circle",
                "source": "schools",
                "layout": {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 6,
                    'circle-color': 'rgba(255,0,0,1)',
                    // // 'circle-border': 1,
                    'circle-stroke-color': '#000000',
                    'circle-stroke-width': 1,
                    // //rgba(55,148,179,1)'
                    "circle-opacity": 1
                }
                , "filter": ["==", "ADMIN_1_EN", oblast]
            });

        }

    });

};

map.on('load', function () {

    map.addSource('schools', {
        type: 'geojson',
        data: schools
    });

    pointsLayer(schools)

});


// Popup onclick logic

map.on('click', function (e) {

    var features = map.queryRenderedFeatures(e.point);

    if (!features.length || features[0].layer.source != 'schools') {
        return;
    }
    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<b>Oblast:</b> '+feature.properties['ADMIN_1_EN']+'<br>'+'<b>Full name:</b> '+feature.properties['FULL_NAM_1'])
        .addTo(map);
});
