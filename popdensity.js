var map = L.map('map', {
  fullscreenControl: {
      pseudoFullscreen: false
  }
}).setView([20.5937, 78.9629], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/venkanna37/cjkbhws3rc1yn2rnvmxatun03/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmVua2FubmEzNyIsImEiOiJjamduajFicHQwYzJrMnFvZ2o1NWlrNjVxIn0.4OzLfdbG_MSBuMpFcAoQjg', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function getColor(d) {
  return d > 1200 ? '#800026' :
      d > 800  ? '#BD0026' :
      d > 500  ? '#E31A1C' :
      d > 400  ? '#FC4E2A' :
      d > 300   ? '#FD8D3C' :
      d > 200   ? '#FEB24C' :
      d > 15   ? '#FED976' :
            '#FFEDA0';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.Density)
  };
}



var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>India Population Density</h4>' +  (props ?
      '<b>' + props.ST_NAME + '</b><br />' + props.Density + ' people / km<sup>2</sup>'
      : 'Hover over a state');
};

info.addTo(map);

function highlightFeature(e) {
var layer = e.target;

layer.setStyle({
    weight: 5,
    color: 'green',
    dashArray: '',
    fillOpacity: 0.7
});

if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
    info.update(layer.feature.properties);
}
}

function resetHighlight(e) {
geojson.resetStyle(e.target);
info.update();
}

function zoomToFeature(e) {
map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
});
}

var geojson = L.geoJSON(indiastates, {
style:style,
onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 15, 200, 300, 400, 500, 800, 1200],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;'+grades[i + 1] + '<br>': '+');
    }

    return div;
};

legend.addTo(map);
