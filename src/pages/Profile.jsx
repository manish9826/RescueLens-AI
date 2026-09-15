import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Activity, AlertTriangle, CheckCircle, Clock, Save, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { token, isDemo } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [token, isDemo]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemo) {
        setProfileData({
          name: 'Demo User',
          email: 'demo@rescuelens.ai',
          createdAt: new Date().toISOString(),
          totalIncidents: 12,
          criticalIncidents: 3,
          resolvedIncidents: 9,
          lastActivity: new Date().toISOString()
        });
        setEditName('Demo User');
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setProfileData(data.profile);
        setEditName(data.profile.name);
      } else {
        throw new Error(data.error || 'Failed to fetch profile.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      setProfileData(prev => ({ ...prev, name: editName }));
      setIsEditing(false);
      return;
    }

    if (editName.trim().length < 2) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileData(prev => ({ ...prev, name: editName }));
        setIsEditing(false);
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      alert('Network error while updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Error Loading Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={fetchProfile} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all">
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-slate-500 font-semibold">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-700 w-full"></div>
        
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-8">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-800 border-4 border-white dark:border-[#090D16] flex items-center justify-center shadow-lg shrink-0">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" />
              </div>
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{profileData.name}</h1>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{profileData.email}</p>
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="self-start sm:self-auto mt-4 sm:mt-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300">Total Incidents</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{profileData.totalIncidents}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300">Critical Alerts</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{profileData.criticalIncidents}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300">Resolved</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{profileData.resolvedIncidents}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Account Details</h2>
            
            {isEditing ? (
              <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 dark:text-white font-semibold transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Email (Read-only)</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || editName.trim().length < 2}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setEditName(profileData.name);
                      setIsEditing(false);
                    }}
                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">Active</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Last Activity</p>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {profileData.lastActivity ? new Date(profileData.lastActivity).toLocaleDateString() : 'No recent activity'}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Role</p>
                  <p className="font-bold text-slate-900 dark:text-white">Emergency Responder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
