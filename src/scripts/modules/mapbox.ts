export const displayMap = (
  locations: { coordinates: any[]; day: any; description: any }[],
) => {
  // @ts-ignore
  const map = L.map('map', { zoomControl: false });

  // @ts-ignore
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points: any[][] = [];
  locations.forEach(
    (loc: { coordinates: any[]; day: any; description: any }) => {
      points.push([loc.coordinates[1], loc.coordinates[0]]);
      // @ts-ignore
      L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map)
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
          autoClose: false,
        })
        .openPopup();
    },
  );
  // @ts-ignore
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};

export const initMap = () => {
  const mapBox = document.querySelector('#map');

  if (mapBox) {
    const locations = JSON.parse((mapBox as HTMLElement).dataset.locations);
    displayMap(locations);
  }
};
