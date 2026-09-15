import express from 'express';

const router = express.Router();

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm) {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} m`;
  }
  return `${distKm.toFixed(1)} km`;
}

function getAmenityDetails(amenity) {
  switch (amenity) {
    case 'hospital':
    case 'clinic':
      return { type: 'Hospital', icon: '🏥' };
    case 'fire_station':
      return { type: 'Fire Station', icon: '🚒' };
    case 'police':
      return { type: 'Police Station', icon: '👮' };
    case 'pharmacy':
      return { type: 'Pharmacy', icon: '🏪' };
    case 'shelter':
      return { type: 'Shelter', icon: '🛟' };
    default:
      return { type: 'Emergency Service', icon: '🚨' };
  }
}

// GET /api/nearby?lat=xx&lng=xx&radius=5000
router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = Math.min(parseInt(req.query.radius, 10) || 5000, 10000); // 5km default, max 10km

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided.'
      });
    }

    const category = req.query.category ? req.query.category.toUpperCase() : 'OTHER';
    let queryFilter = '^(hospital|fire_station|police|pharmacy|shelter|clinic)$';
    
    // Smart Category Filter
    if (category === 'ACCIDENT') {
      queryFilter = '^(hospital|police|clinic)$';
    } else if (category === 'FIRE') {
      queryFilter = '^(fire_station|hospital)$';
    } else if (category === 'MEDICAL') {
      queryFilter = '^(hospital|pharmacy|clinic)$';
    } else if (category === 'POLICE' || category === 'VIOLENCE' || category === 'WOMEN SAFETY') {
      queryFilter = '^(police|hospital|shelter)$';
    } else if (category === 'CHILD SAFETY') {
      queryFilter = '^(police|hospital)$';
    } else if (category === 'FLOOD' || category === 'DISASTER') {
      queryFilter = '^(shelter|fire_station|hospital|police)$';
    }

    // Fast Overpass Query focusing on nodes with known emergency amenities
    const overpassQuery = `[out:json][timeout:10];node["amenity"~"${queryFilter}"]["name"](around:${radius},${lat},${lng});out 25;`;

    // Try multiple reliable public mirrors
    const mirrors = [
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
      `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
      `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
    ];

    let data = null;

    for (const mirrorUrl of mirrors) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const response = await fetch(mirrorUrl, {
          headers: {
            'User-Agent': 'RescueLens-AI-Platform/1.0 (Emergency Response POI)'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          data = await response.json();
          if (data && Array.isArray(data.elements)) {
            break;
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        // Try next mirror
      }
    }

    if (!data || !Array.isArray(data.elements)) {
      return res.json({
        success: true,
        places: [],
        message: 'Nearby services could not be loaded.'
      });
    }

    const elements = data?.elements || [];
    const validPlaces = [];

    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || tags['name:hi'];
      
      // Strict rule: Do NOT invent places. Only include items with verified names.
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        continue;
      }

      const pLat = el.lat || el.center?.lat;
      const pLng = el.lon || el.center?.lon;

      if (!pLat || !pLng) continue;

      const amenity = tags.amenity || 'emergency';
      const { type, icon } = getAmenityDetails(amenity);
      const distKm = calculateDistanceKm(lat, lng, pLat, pLng);

      const phone = tags.phone || tags['contact:phone'] || tags['emergency:phone'] || null;
      const address = tags['addr:full'] || tags['addr:street'] || tags['addr:city'] || null;
      const openingHours = tags.opening_hours || null;

      validPlaces.push({
        id: `${el.type}-${el.id}`,
        name: name.trim(),
        type,
        category: amenity,
        icon,
        lat: pLat,
        lng: pLng,
        distance: formatDistance(distKm),
        distanceMeters: Math.round(distKm * 1000),
        phone,
        address,
        openingHours
      });
    }

    // Sort by proximity
    validPlaces.sort((a, b) => a.distanceMeters - b.distanceMeters);

    res.json({
      success: true,
      places: validPlaces
    });
  } catch (err) {
    console.error('[Nearby Help] Server error:', err);
    res.json({
      success: true,
      places: [],
      message: 'Nearby services could not be loaded.'
    });
  }
});

export default router;
