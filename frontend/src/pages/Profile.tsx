import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail, GraduationCap, Briefcase } from 'lucide-react';
import { UserProfile } from '../App';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

export default function Profile({ profile, setProfile, onBack }: ProfileProps) {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear);
  const [branch, setBranch] = useState(profile.branch);
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setProfile({
        name,
        college,
        graduationYear,
        branch,
        experienceLevel,
        preferredRoles: profile.preferredRoles
      });
      setSaving(false);
      alert('Profile details saved successfully!');
      onBack();
    }, 1000);
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-slate-400">Configure details so the AI interviewer correctly scales complexity levels.</p>
      </div>

      <div className="flex flex-col gap-6 p-8 rounded-2xl glass-morphism border border-slate-800">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
            <User className="w-3.5 h-3.5 text-blue-400" /> Full Name
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Institution/College
            </label>
            <input 
              type="text" 
              value={college} 
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Graduation Year
            </label>
            <input 
              type="number" 
              value={graduationYear} 
              onChange={(e) => setGraduationYear(parseInt(e.target.value) || 2026)}
              className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Major Branch
            </label>
            <input 
              type="text" 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-255 outline-none focus:border-blue-500 transition text-sm"
            >
              <option value="Student">Student (Placement/Intern Prep)</option>
              <option value="Experienced Professional">Experienced Professional (Switch Prep)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition mt-4 flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Details</>}
        </button>
      </div>
    </div>
  );
}
