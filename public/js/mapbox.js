/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2ViZGV2OTciLCJhIjoiY2xrYmViNmpyMGYyNDNlcW8wc2M5MDM0eSJ9.yjfIprobXldSgXpf2STTJQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/webdev97/clkccxmqz000q01qyfnhu502g',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const marker = document.createElement('div');
  marker.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: marker,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current locations
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
