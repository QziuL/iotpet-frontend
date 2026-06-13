import type { GeoPoint } from '@/types/geofencing.types';

/** Convert degrees to radians */
const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Calculate the area of a polygon in square meters using the Shoelace formula
 * adapted for geographic coordinates.
 */
export function calcPolygonArea(points: GeoPoint[]): number {
  if (points.length < 3) return 0;
  const R = 6371000; // Earth radius in meters
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = toRad(points[i].latitude);
    const lat2 = toRad(points[j].latitude);
    const dLng = toRad(points[j].longitude - points[i].longitude);
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  return Math.abs((area * R * R) / 2);
}

/**
 * Check if a point is inside a polygon (Ray-Casting algorithm).
 */
export function isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]): boolean {
  const { latitude: lat, longitude: lng } = point;
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;

    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Calculate the geographic center (centroid) of a polygon.
 */
export function polygonCentroid(points: GeoPoint[]): GeoPoint {
  if (points.length === 0) return { latitude: 0, longitude: 0 };
  const lat = points.reduce((s, p) => s + p.latitude, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.longitude, 0) / points.length;
  return { latitude: lat, longitude: lng };
}

/**
 * Format area in m² or km² depending on size.
 */
export function formatArea(sqMeters: number): string {
  if (sqMeters >= 1_000_000) {
    return `${(sqMeters / 1_000_000).toFixed(2)} km²`;
  }
  return `${Math.round(sqMeters)} m²`;
}

/**
 * Distance between two GeoPoints in meters (Haversine formula).
 */
export function distanceBetween(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
