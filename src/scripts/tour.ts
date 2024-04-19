import { initMap } from './modules/mapbox';
import { initBookTourBtn } from './modules/bookTour';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initBookTourBtn();
});
