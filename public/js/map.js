(() => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const token =
    (typeof mapToken !== "undefined" && mapToken) ||
    (typeof window !== "undefined" && window.mapToken) ||
    "";

  if (!token) {
    console.warn("Mapbox token is missing. Please set MAP_TOKAN in your .env file.");
    mapElement.innerHTML = `
      <div class="d-flex justify-content-center align-items-center h-100 bg-light rounded text-muted p-3 text-center">
        <div>
          <i class="fa-solid fa-map-location-dot fa-2x mb-2 text-danger"></i>
          <p class="mb-0 fw-semibold">Map unavailable</p>
          <small>Mapbox access token is missing or not configured.</small>
        </div>
      </div>
    `;
    return;
  }

  mapboxgl.accessToken = token;

  // Default coordinates (Bengaluru: [77.5946, 12.9716])
  const defaultCenter = [77.5946, 12.9716];
  const defaultZoom = 9;

  const currentListing =
    (typeof listing !== "undefined" && listing) ||
    (typeof window !== "undefined" && window.listing) ||
    {};

  // Check if listing has direct coordinates
  const hasDirectCoords =
    currentListing.geometry &&
    Array.isArray(currentListing.geometry.coordinates) &&
    currentListing.geometry.coordinates.length === 2 &&
    typeof currentListing.geometry.coordinates[0] === "number" &&
    typeof currentListing.geometry.coordinates[1] === "number";

  const initialCenter = hasDirectCoords
    ? currentListing.geometry.coordinates
    : defaultCenter;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/standard",
    projection: "globe",
    zoom: hasDirectCoords ? 10 : defaultZoom,
    center: initialCenter,
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();

  map.on("style.load", () => {
    try {
      map.setFog({});
    } catch (e) {
      // standard style manages atmosphere automatically in newer versions
    }
    map.resize();
  });

  window.addEventListener("resize", () => {
    map.resize();
  });

  const createMarker = (coords) => {
    const title = currentListing.title || "Listing Location";
    const locText = currentListing.location
      ? `${currentListing.location}${currentListing.country ? `, ${currentListing.country}` : ""}`
      : "Exact location will be provided after booking";

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="map-popup-card">
        <h6 class="fw-bold mb-1">${title}</h6>
        <p class="text-muted small mb-0">${locText}</p>
        <span class="badge bg-danger mt-1">Exact location after booking</span>
      </div>
    `);

    return new mapboxgl.Marker({ color: "#fe424d" })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);
  };

  if (hasDirectCoords) {
    createMarker(initialCenter);
  } else if (currentListing.location) {
    // Geocode location string using Mapbox Places API
    const searchQuery = `${currentListing.location}${
      currentListing.country ? `, ${currentListing.country}` : ""
    }`.trim();

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.features && data.features.length > 0) {
          const coords = data.features[0].center;
          map.flyTo({
            center: coords,
            zoom: 10,
            essential: true,
          });
          createMarker(coords);
        } else {
          createMarker(defaultCenter);
        }
      })
      .catch((err) => {
        console.warn("Geocoding failed, using default center:", err);
        createMarker(defaultCenter);
      });
  } else {
    createMarker(defaultCenter);
  }
})();