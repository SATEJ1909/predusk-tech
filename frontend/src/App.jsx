import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Github, Linkedin, ExternalLink, Search,
  Activity, Mail, Briefcase, RefreshCw, AlertCircle, Edit2, X
} from 'lucide-react';

const API_BASE = "http://localhost:3000/api";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [health, setHealth] = useState("Checking...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    education: "",
    skills: "",
    email: ""
  });
  const [saving, setSaving] = useState(false);

  const searchTimeout = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [profRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/profile`, { timeout: 8000 }),
        axios.get(`${API_BASE}/health`, { timeout: 4000 })
      ]);

      const data = profRes.data.message;
      setProfile(data);
      setProjects(data.projects || []);
      setHealth(healthRes.data.status || "UP");
      setError(null);
    } catch {
      setHealth("OFFLINE");
      setError("Server unreachable. Ensure the backend is running on port 3000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setProjects(profile?.projects || []);
      return;
    }

    try {
      // Matches: router.get("/search", getProjectsBySkills)
      const res = await axios.get(`${API_BASE}/search?skills=${encodeURIComponent(query)}`);
      setProjects(res.data.message);
    } catch {
      // Local fallback if search endpoint fails
      const filtered = (profile?.projects || []).filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      setProjects(filtered);
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce: Wait 300ms after user stops typing to call API
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => performSearch(value), 300);
  };

  const handleEditClick = () => {
    if (!profile) return;
    setEditForm({
      name: profile.name,
      education: profile.education,
      skills: profile.skills.join(", "),
      email: profile.email
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = editForm.skills.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name: editForm.name,
        education: editForm.education,
        skills: skillsArray
      };

      const res = await axios.patch(`${API_BASE}/update/${profile.email}`, payload);

      if (res.data.success) {
        const updatedProfile = { ...profile, ...payload };
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (err) {
      alert("Failed to update profile. " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse text-sm">Syncing with Me-API...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <div className="inline-flex p-4 bg-red-50 text-red-500 rounded-2xl mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Connection Lost</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
        <button onClick={fetchData} className="btn-primary flex items-center justify-center gap-2 w-full">
          <RefreshCw size={18} /> Reconnect
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] selection:bg-blue-100 selection:text-blue-900">

      {/* --- Global Navigation --- */}
      <nav className="sticky top-0 z-50 bg-glass border-b border-slate-200/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className={`h-2.5 w-2.5 rounded-full ${health === 'UP' ? 'bg-emerald-500 animate-pulse-glow' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status: {health}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={profile?.links?.github} target="_blank" className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Github size={20} /></a>
            <a href={profile?.links?.linkedin} target="_blank" className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Linkedin size={20} /></a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* --- Sidebar: Profile --- */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="relative group/profile">
              <button
                onClick={handleEditClick}
                className="absolute -top-8 -right-4 p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover/profile:opacity-100"
                title="Edit Profile"
              >
                <Edit2 size={18} />
              </button>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                {profile?.name.split(' ')[0]}<br />
                <span className="text-blue-600">{profile?.name.split(' ')[1]}</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-6">
                {profile?.education}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {profile?.skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm hover:border-blue-400 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <a href={`mailto:${profile?.email}`} className="group flex items-center gap-4 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all">
                <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Mail size={18} />
                </div>
                {profile?.email}
              </a>
            </div>
          </aside>

          {/* --- Main: Projects --- */}
          <section className="lg:col-span-8 space-y-12">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Query by skill (e.g. React, Docker)..."
                className="w-full pl-16 pr-8 py-6 bg-white rounded-4xl border-none shadow-2xl shadow-slate-200/40 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-xl font-medium"
                value={search}
                onChange={onSearchChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <div key={i} className="card p-10 group hover:shadow-glow hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Briefcase size={24} />
                    </div>
                    <div className="flex gap-2">
                      <a href={project.links?.github} target="_blank" className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Github size={20} /></a>
                      <a href={project.links?.live} target="_blank" className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ExternalLink size={20} /></a>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold tracking-tight">No results found for "{search}"</p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* --- Edit Modal --- */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Education</label>
                <input
                  type="text"
                  name="education"
                  value={editForm.education}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills <span className="text-slate-300 normal-case font-normal">(comma separated)</span></label>
                <textarea
                  name="skills"
                  value={editForm.skills}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-600 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}