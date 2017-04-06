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

    console.log(e.target)

});