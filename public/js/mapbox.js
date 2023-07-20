/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2ViZGV2OTciLCJhIjoiY2xrYmViNmpyMGYyNDNlcW8wc2M5MDM0eSJ9.yjfIprobXldSgXpf2STTJQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
