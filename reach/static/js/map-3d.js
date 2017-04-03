/**
 * Created by User on 03/03/2017.
 */

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVueXNib2lrbyIsImEiOiJjaXpxdzlxMGswMHMzMnFxbzdpYjJoZDN1In0.O3O4iBtTiODWN0C8oGOBwg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/denysboiko/cizqwhcma002b2rkw9dws4zio', //stylesheet location
    center: [37.804,48.013], // starting position
    zoom: 11 // starting zoom
});


var filterGroup = document.getElementById('filter-group');

map.on('load', function () {

    map.addSource('schools', {
        type: 'geojson',
//            vector
        data: schools
//            mapbox://denysboiko.cizqwpj35001n2ro1ub2jzuir-92nxy
    });


    schools.features.forEach(function(feature) {
        var oblast = feature.properties['ADMIN_1_EN'];

        var type = feature.properties['TYPE_ENG'];

        var layerID = 'obl-' + oblast;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                // "type": "circle",
                "type": "fill-extrusion",
                //circle
                "source": "schools",
                "layout": {
                    'visibility': 'visible'
                },
                // "layout": {
                //     "icon-image": "college-15",
                //     "icon-allow-overlap": true
                //     // "text-field": 'college',
                //     // "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                //     // "text-size": 11,
                //     // "text-transform": "uppercase",
                //     // "text-letter-spacing": 0.05,
                //     // "text-offset": [0, 1.5]
                // },
                // "paint": {
                //     "text-color": "#202",
                //     "text-halo-color": "#fff",
                //     "text-halo-width": 2
                // }
                'paint': {
                    // 'circle-radius': 6,
                    // 'circle-color': 'rgba(255,0,0,1)',
                    // // 'circle-border': 1,
                    // 'circle-stroke-color': '#000000',
                    // 'circle-stroke-width': 1,
                    // //rgba(55,148,179,1)'
                    // "circle-opacity": 1,
                    'fill-extrusion-color': 'rgba(255,0,0,1)'
                    // {
                    //     // Get the fill-extrusion-color from the source 'color' property.
                    //     'property': 'color',
                    //     'type': 'identity'
                    // }
                     ,'fill-extrusion-height': {
                        // Get fill-extrusion-height from the source 'height' property.
                        'property': 'Height',
                        'type': 'identity'
                    }
                    ,'fill-extrusion-base': 10
                    // {
                    //     // Get fill-extrusion-base from the source 'base_height' property.
                    //     'property': 'base_height',
                    //     'type': 'identity'
                    // }
                    // Make extrusions slightly opaque for see through indoor walls.
                    ,'fill-extrusion-opacity': 0.5
                }
                , "filter": ["==", "ADMIN_1_EN", oblast]
            });

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = oblast;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function(e) {
                map.setLayoutProperty(layerID, 'visibility',
                    e.target.checked ? 'visible' : 'none');
            });
        }

    });

});


// Popup onclick logic

map.on('click', function (e) {

    var features = map.queryRenderedFeatures(e.point);

    console.log(e)
    console.log(features)
    if (!features.length) {
        return;
    }
    var feature = features[0];
    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates[0][0])
        .setHTML('<b>Oblast:</b> '+feature.properties['ADMIN_1_EN']+'<br>'+'<b>Full name:</b> '+feature.properties['FULL_NAM_1'])
        .addTo(map);
});
