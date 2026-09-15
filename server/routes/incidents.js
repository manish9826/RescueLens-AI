import express from 'express';
import { getDb } from '../db.js';
import { optionalAuthMiddleware } from './auth.js';

const router = express.Router();

// Get incidents (Strictly isolated by user ownership if authenticated)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    let incidents = [];

    if (req.user && req.user.id) {
      // Authenticated user: Only retrieve reports belonging to this user
      incidents = await db.all(
        'SELECT * FROM incidents WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
    } else {
      // Unauthenticated / public: Only return public or demo incidents (never private user data)
      incidents = await db.all(
        "SELECT * FROM incidents WHERE user_id = 'public_user' OR user_id = 'demo_user' ORDER BY created_at DESC LIMIT 10"
      );
    }
    
    // Parse JSON arrays stored as strings (risks, immediateActions, etc.)
    const parsedIncidents = incidents.map(inc => ({
      ...inc,
      immediateActions: inc.immediateActions ? JSON.parse(inc.immediateActions) : [],
      doNotDo: inc.doNotDo ? JSON.parse(inc.doNotDo) : [],
      rescueResources: inc.rescueResources ? JSON.parse(inc.rescueResources) : []
    }));

    res.json({ success: true, incidents: parsedIncidents });
  } catch (err) {
    console.error('Fetch incidents error:', err);
    res.status(500).json({ error: 'Failed to fetch incidents.' });
  }
});

// Get a single incident report by ID with strict ownership validation
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const incident = await db.get('SELECT * FROM incidents WHERE id = ?', [req.params.id]);

    if (!incident) {
      return res.status(404).json({ error: 'Incident report not found.' });
    }

    // Privacy rule: Reports belong to the authenticated user.
    // A user must never be able to access another user's report.
    const isOwner = req.user && req.user.id === incident.user_id;
    const isPublic = incident.user_id === 'public_user' || incident.user_id === 'demo_user';

    if (!isOwner && !isPublic) {
      return res.status(403).json({ 
        error: "Access denied. Reports belong to the authenticated user. A user cannot access another user's report." 
      });
    }

    const parsed = {
      ...incident,
      immediateActions: incident.immediateActions ? JSON.parse(incident.immediateActions) : [],
      doNotDo: incident.doNotDo ? JSON.parse(incident.doNotDo) : [],
      rescueResources: incident.rescueResources ? JSON.parse(incident.rescueResources) : []
    };

    res.json({ success: true, incident: parsed });
  } catch (err) {
    console.error('Fetch single incident error:', err);
    res.status(500).json({ error: 'Failed to fetch incident report.' });
  }
});

// Save a new incident report with ownership bound to authenticated user
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { 
      id, incidentType, emergencyCategory, severity, priorityScore, 
      confidence, summary, dangerLevel, immediateActions, doNotDo, 
      rescueResources, image, location, timestamp, status 
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Incident ID is required.' });
    }

    // Security Fix: User ownership cannot be spoofed via client-provided body
    const userId = req.user && req.user.id ? req.user.id : 'public_user';

    const db = await getDb();
    
    await db.run(`
      INSERT INTO incidents (
        id, user_id, incidentType, emergencyCategory, severity, priorityScore,
        confidence, summary, dangerLevel, immediateActions, doNotDo, rescueResources,
        image, location, timestamp, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, 
      userId, 
      incidentType || 'Emergency Incident', 
      emergencyCategory || 'OTHER', 
      severity || 'HIGH', 
      priorityScore || 80,
      confidence || 90, 
      summary || 'Emergency incident recorded.', 
      dangerLevel || 'Assessed Risk Level', 
      JSON.stringify(immediateActions || []), 
      JSON.stringify(doNotDo || []), 
      JSON.stringify(rescueResources || []),
      image || null, 
      location || 'Unknown', 
      timestamp || new Date().toISOString(), 
      status || 'ACTIVE'
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Incident report saved securely.',
      incidentId: id,
      owner: userId
    });
  } catch (err) {
    console.error('Save incident error:', err);
    res.status(500).json({ error: 'Failed to save incident report.' });
  }
});

export default router;
