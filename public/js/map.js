mapboxgl.accessToken = mapToken;

const listing = typeof listingData === "string" ? JSON.parse(listingData) : listingData;

const coordinates = (listing && listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2)
  ? listing.geometry.coordinates
  : [77.209, 28.6139];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  projection: 'globe',
  zoom: 12,
  center: coordinates
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

map.on('style.load', () => {
  map.setFog({});
});

const marker1 = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.title}</h3>
      <p>${listing.location}</p>`
    )
  )
  .addTo(map);
