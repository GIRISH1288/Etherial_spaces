'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Users, 
  Settings, LogOut, ShieldAlert, BarChart3, Plus, Trash2, Edit2, 
  ListFilter, Save, Eye, Layers, Compass, PlusCircle, Sliders
} from 'lucide-react';
import { 
  db, HomepageContent, Project, TeamMember, 
  GalleryItem, FormField, Inquiry, SeoSettings, StudioSettings 
} from '@/lib/db';
import { loginAdmin, logoutAdmin, checkAdminSession } from '../actions/auth';

type TabType = 'dashboard' | 'homepage' | 'projects' | 'team' | 'gallery' | 'formbuilder' | 'inquiries' | 'seo' | 'settings';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [projectFormTab, setProjectFormTab] = useState<'general' | 'media' | 'narrative' | 'client'>('general');

  // CMS state collections
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [studioSettings, setStudioSettings] = useState<StudioSettings | null>(null);
  const [studioForm, setStudioForm] = useState<StudioSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedSeoPage, setSelectedSeoPage] = useState('home');
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);

  // Edit / Form state holders
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    name: '', slug: '', category: 'Luxury Villas', location: '', 
    hero_image: '', overview: '', design_challenge: '', 
    design_solution: '', materials: [], client_name: '', 
    client_testimonial: '', completion_date: '', images: [],
    before_image: '', after_image: ''
  });
  const [newMaterial, setNewMaterial] = useState('');

  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<Omit<TeamMember, 'id' | 'sort_order'>>({
    name: '', designation: '', description: '', image_url: ''
  });

  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    image_url: '', category: 'Residential', caption: '', width: 800, height: 1200
  });

  const [newFieldForm, setNewFieldForm] = useState<Omit<FormField, 'sort_order' | 'is_active'>>({
    id: '', label: '', field_type: 'text', is_required: false, options: []
  });
  const [newFieldOption, setNewFieldOption] = useState('');

  // ----------------------------------------------------
  // AUTHENTICATION GUARD
  // ----------------------------------------------------
  useEffect(() => {
    async function verifySession() {
      const isSessionActive = await checkAdminSession();
      if (isSessionActive) {
        setIsAuthenticated(true);
      }
    }
    verifySession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Email and Password are required.');
      return;
    }
    const res = await loginAdmin(loginEmail, loginPassword);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(res.error || 'Invalid credentials.');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  // ----------------------------------------------------
  // CORE CMS LOADER
  // ----------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadCMSData() {
      const home = await db.getHomepageContent();
      const projs = await db.getProjects();
      const members = await db.getTeamMembers();
      const items = await db.getGalleryItems();
      const fields = await db.getAllContactFormFields();
      const inqs = await db.getInquiries();
      const seo = await db.getSeoSettings(selectedSeoPage);
      const studio = await db.getStudioSettings();

      setHomepageContent(home);
      setProjects(projs);
      setTeam(members);
      setGallery(items);
      setFormFields(fields);
      setInquiries(inqs);
      setSeoSettings(seo);
      setStudioSettings(studio);
      setStudioForm(studio);
    }
    loadCMSData();
  }, [isAuthenticated, selectedSeoPage]);

  // Load SEO when selected page changes
  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadSeo() {
      const seo = await db.getSeoSettings(selectedSeoPage);
      setSeoSettings(seo);
    }
    loadSeo();
  }, [selectedSeoPage, isAuthenticated]);

  // ----------------------------------------------------
  // SUB-CONTROLLERS (CRUD HANDLERS)
  // ----------------------------------------------------

  // 1. Homepage Content Updates
  const handleHomepageUpdate = async (fields: Partial<HomepageContent>) => {
    if (!homepageContent) return;
    const updated = await db.updateHomepageContent(fields);
    setHomepageContent(updated);
    alert('Homepage settings saved successfully!');
  };

  // 1b. Studio Settings Save
  const saveStudioSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioForm) return;
    const updated = await db.updateStudioSettings(studioForm);
    setStudioSettings(updated);
    alert('Studio settings saved successfully!');
  };


  // 2. Project CRUD
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await db.updateProject(editingProject.id, projectForm, projectForm.images);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditingProject(null);
      } else {
        const created = await db.createProject(projectForm, projectForm.images);
        setProjects(prev => [created, ...prev]);
      }
      // Reset Form
      setProjectForm({
        name: '', slug: '', category: 'Luxury Villas', location: '', 
        hero_image: '', overview: '', design_challenge: '', 
        design_solution: '', materials: [], client_name: '', 
        client_testimonial: '', completion_date: '', images: [],
        before_image: '', after_image: ''
      });
      setProjectFormTab('general');
      alert('Project saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving project');
    }
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectFormTab('general');
    setProjectForm({
      name: p.name, slug: p.slug, category: p.category, location: p.location,
      hero_image: p.hero_image, overview: p.overview, design_challenge: p.design_challenge,
      design_solution: p.design_solution, materials: p.materials || [], 
      client_name: p.client_name || '', client_testimonial: p.client_testimonial || '',
      completion_date: p.completion_date || '', images: p.images || [],
      before_image: p.before_image || '', after_image: p.after_image || ''
    });
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm(prev => ({ ...prev, hero_image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm(prev => ({ ...prev, before_image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm(prev => ({ ...prev, after_image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCarouselUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadPromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises).then(base64Images => {
      setProjectForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images]
      }));
    });
  };

  const handleHomepageHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleHomepageUpdate({ hero_image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSeoOgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSeoSettings(prev => prev ? { ...prev, og_image_url: reader.result as string } : null);
    };
    reader.readAsDataURL(file);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await db.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // 3. Team CRUD
  const saveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      const updated = await db.updateTeamMember(editingTeam.id, teamForm);
      setTeam(prev => prev.map(t => t.id === updated.id ? updated : t));
      // simple refresh
      const allTeam = await db.getTeamMembers();
      setTeam(allTeam);
      setEditingTeam(null);
    } else {
      const created = await db.createTeamMember({ ...teamForm, sort_order: team.length });
      setTeam(prev => [...prev, created]);
    }
    setTeamForm({ name: '', designation: '', description: '', image_url: '' });
    alert('Team member saved successfully!');
  };

  const deleteTeam = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await db.deleteTeamMember(id);
    setTeam(prev => prev.filter(t => t.id !== id));
  };

  // 4. Gallery CRUD
  const addGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await db.createGalleryItem(galleryForm);
    setGallery(prev => [created, ...prev]);
    setGalleryForm({ image_url: '', category: 'Residential', caption: '', width: 800, height: 1200 });
    alert('Gallery image added successfully!');
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    await db.deleteGalleryItem(id);
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // 5. Contact Form Builder
  const toggleFieldState = async (id: string, active: boolean) => {
    const updated = formFields.map(f => f.id === id ? { ...f, is_active: active } : f);
    setFormFields(updated);
    await db.saveContactFormFields(updated);
  };

  const toggleFieldRequired = async (id: string, req: boolean) => {
    const updated = formFields.map(f => f.id === id ? { ...f, is_required: req } : f);
    setFormFields(updated);
    await db.saveContactFormFields(updated);
  };

  const addCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldForm.id || !newFieldForm.label) return;
    
    const newField: FormField = {
      id: newFieldForm.id.toLowerCase().replace(/\s+/g, '_'),
      label: newFieldForm.label,
      field_type: newFieldForm.field_type as any,
      is_required: newFieldForm.is_required,
      options: newFieldForm.options,
      sort_order: formFields.length,
      is_active: true
    };

    const updated = [...formFields, newField];
    setFormFields(updated);
    await db.saveContactFormFields(updated);

    // Reset Form builder inputs
    setNewFieldForm({ id: '', label: '', field_type: 'text', is_required: false, options: [] });
    alert('Custom field added to questionnaire!');
  };

  const deleteField = async (id: string) => {
    if (!confirm('Delete this field completely?')) return;
    const updated = formFields.filter(f => f.id !== id);
    setFormFields(updated);
    await db.saveContactFormFields(updated);
  };

  // 6. Lead pipeline Inquiry Manager
  const updateLeadStatus = async (id: string, status: Inquiry['status']) => {
    const updated = await db.updateInquiryStatus(id, status);
    setInquiries(prev => prev.map(i => i.id === id ? updated : i));
  };

  const deleteLeadInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to archive/delete this lead?')) return;
    await db.deleteInquiry(id);
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  // 7. SEO settings saver
  const saveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoSettings) return;
    await db.saveSeoSettings(selectedSeoPage, {
      meta_title: seoSettings.meta_title,
      meta_description: seoSettings.meta_description,
      meta_keywords: seoSettings.meta_keywords,
      og_image_url: seoSettings.og_image_url
    });
    alert('SEO meta tags saved successfully!');
  };
  // Render Login Card if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6 admin-portal-theme">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl border border-gold/15 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          
          <div className="text-center space-y-3">
            <div className="relative w-8 h-8 mx-auto flex items-center justify-center">
              <span className="absolute w-5 h-5 border border-ivory rotate-45 rounded" />
              <span className="absolute w-5 h-5 border border-gold/30 -rotate-45 rounded" />
            </div>
            <h1 className="text-xl font-light tracking-[0.2em] text-ivory">ADMIN PORTAL</h1>
            <p className="text-[9px] text-champagne/60 uppercase tracking-widest">Ethereal Spaces CMS Core</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-champagne/80 font-medium pl-1">Admin Email/Username</label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@etherealspaces.com"
                className="w-full bg-dark-bg border border-gold/10 focus:border-ivory px-4 py-3.5 text-xs text-ivory placeholder-ivory/20 rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-[9px] uppercase tracking-widest text-champagne/80 font-medium pl-1">Secure Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-dark-bg border border-gold/10 focus:border-ivory px-4 py-3.5 text-xs text-ivory placeholder-ivory/20 rounded-xl transition-all"
              />
            </div>

            {loginError && (
              <p className="text-[10px] text-red-500 font-light tracking-wide pl-1">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-ivory text-dark-bg hover:bg-gold font-medium text-xs uppercase tracking-[0.25em] transition-all duration-200 rounded-xl shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99] border-none"
            >
              Sign In to Dashboard
            </button>
          </form>

        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-dark-bg text-ivory flex admin-portal-theme selection:bg-black/5">      
      {/* 1. SIDEBAR CONTROLS */}
      <aside className="w-64 bg-dark-surface border-r border-gold/15 flex flex-col justify-between py-8">
        
        <div className="space-y-8">
          
          {/* Logo */}
          <div className="px-6 flex flex-col space-y-2">
            <Link href="/" className="block">
              <img 
                src="/images/logo.png" 
                alt="Ethereal Spaces Logo" 
                className="h-10 w-auto object-contain invert brightness-[2]"
              />
            </Link>
            <span className="text-[10px] tracking-[0.3em] text-champagne/60 uppercase pl-1 font-light">Management Console</span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1 px-3">
            {[
              { id: 'dashboard', label: 'Metrics Console', icon: LayoutDashboard },
              { id: 'homepage', label: 'Home Editor', icon: FileText },
              { id: 'projects', label: 'Project CRUD', icon: Layers },
              { id: 'team', label: 'Designers CRUD', icon: Users },
              { id: 'gallery', label: 'Gallery Curation', icon: ImageIcon },
              { id: 'formbuilder', label: 'Form Builder', icon: Sliders },
              { id: 'inquiries', label: 'Leads Pipeline', icon: ListFilter },
              { id: 'seo', label: 'SEO Config', icon: Compass },
              { id: 'settings', label: 'Studio Settings', icon: Settings }
            ].map((link) => {
              const Icon = link.icon;
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as TabType)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-light transition-all duration-200 ${
                    active 
                      ? 'bg-white text-ivory font-medium shadow-[0_1px_3px_rgba(0,0,0,0.05)]' 
                      : 'text-champagne/80 hover:text-ivory hover:bg-white/40'
                  }`}
                >
                  <Icon size={13} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Logout button */}
        <div className="px-6 space-y-4">
          <Link href="/" target="_blank" className="text-[9px] uppercase tracking-widest text-champagne/60 hover:text-ivory transition-colors block">
            View Public Site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xs text-red-600/80 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN WORKSPACE PANEL */}
      <main className="flex-1 overflow-y-auto p-12">
        
        {/* TAB 1: METRICS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Console Metrics</h1>
              <p className="text-xs text-ivory/40">Overview of active digital content and captured leads</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Inquiries', value: inquiries.length, desc: 'Dynamic lead submissions' },
                { label: 'Total Projects', value: projects.length, desc: 'Portfolio case studies' },
                { label: 'Gallery Images', value: gallery.length, desc: 'Inspiration masonry items' },
                { label: 'Form Inputs', value: formFields.filter(f => f.is_active).length, desc: 'Active questionnaire fields' }
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-dark-surface border border-gold/5 rounded-sm space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold">{card.label}</span>
                  <p className="text-4xl font-light font-serif text-ivory">{card.value}</p>
                  <p className="text-[10px] text-ivory/40">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Recent inquiries */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Recent Active Inquiries</h2>
              <div className="glass-panel overflow-hidden rounded-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gold/15 bg-dark-surface text-[10px] uppercase tracking-wider text-gold/80">
                      <th className="p-4">Contact</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 4).map((inq) => (
                      <tr key={inq.id} className="border-b border-gold/5 hover:bg-dark-surface/40">
                        <td className="p-4">
                          <p className="font-medium">{inq.submission_data?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-ivory/40 mt-0.5">{inq.submission_data?.email || 'No email'}</p>
                        </td>
                        <td className="p-4">{inq.submission_data?.project_type || 'Custom'}</td>
                        <td className="p-4">{inq.submission_data?.location || 'Not Specified'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                            inq.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                            inq.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200/60' :
                            inq.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
                            'bg-green-50 text-green-700 border border-green-200/60'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4 text-ivory/40 font-light">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOMEPAGE MANAGER */}
        {activeTab === 'homepage' && homepageContent && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Homepage Config</h1>
              <p className="text-xs text-ivory/40">Modify landing page headers, overlays, and call-to-action texts</p>
            </div>

            <div className="glass-panel p-8 rounded-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Hero Title Headline</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.hero_title}
                    onBlur={(e) => handleHomepageUpdate({ hero_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="text-[10px] uppercase tracking-widest text-gold block mb-1">Hero Background Image</label>
                  {homepageContent.hero_image ? (
                    <div className="relative group aspect-[16/9] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40 shadow-inner">
                      <img src={homepageContent.hero_image} alt="Hero Preview" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <label className="px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                          <span>Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHomepageHeroUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleHomepageUpdate({ hero_image: '' })}
                          className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-4 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[16/9]">
                      <ImageIcon size={20} className="text-gold/60" />
                      <span className="text-[9px] uppercase tracking-widest text-gold font-medium">Upload Hero Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHomepageHeroUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gold">Hero Subheading description</label>
                <textarea
                  rows={3}
                  defaultValue={homepageContent.hero_subtitle}
                  onBlur={(e) => handleHomepageUpdate({ hero_subtitle: e.target.value })}
                  className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">CTA Action Heading</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.cta_title}
                    onBlur={(e) => handleHomepageUpdate({ cta_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">CTA Button Text</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.cta_button_text}
                    onBlur={(e) => handleHomepageUpdate({ cta_button_text: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
              </div>
            </div>

              {/* PORTFOLIO SECTION CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Portfolio Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.portfolio_tag || 'Portfolio'}
                    onBlur={(e) => handleHomepageUpdate({ portfolio_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Portfolio Section Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.portfolio_title || 'Featured Projects'}
                    onBlur={(e) => handleHomepageUpdate({ portfolio_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Portfolio View-All Link Text</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.portfolio_link_text || 'View All Showcase'}
                    onBlur={(e) => handleHomepageUpdate({ portfolio_link_text: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
              </div>

              {/* DISTINCTION SECTION CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Distinction Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.distinction_tag || 'The Distinction'}
                    onBlur={(e) => handleHomepageUpdate({ distinction_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Distinction Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.distinction_title || 'Our Philosophy of Craftsmanship'}
                    onBlur={(e) => handleHomepageUpdate({ distinction_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gold">Distinction Paragraph Text</label>
                <textarea
                  rows={2}
                  defaultValue={homepageContent.distinction_text || ''}
                  onBlur={(e) => handleHomepageUpdate({ distinction_text: e.target.value })}
                  className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Distinction Badge Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.distinction_badge_title || 'Lighthouse Certified'}
                    onBlur={(e) => handleHomepageUpdate({ distinction_badge_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Distinction Badge Description</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.distinction_badge_desc || ''}
                    onBlur={(e) => handleHomepageUpdate({ distinction_badge_desc: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
              </div>

              {/* METHODOLOGY & SHOWCASE CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Methodology Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.methodology_tag || 'Methodology'}
                    onBlur={(e) => handleHomepageUpdate({ methodology_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Methodology Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.methodology_title || 'The Creation Journey'}
                    onBlur={(e) => handleHomepageUpdate({ methodology_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Showcase Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.showcase_tag || 'Showcase'}
                    onBlur={(e) => handleHomepageUpdate({ showcase_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Showcase Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.showcase_title || 'Spaces of Serenity'}
                    onBlur={(e) => handleHomepageUpdate({ showcase_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
              </div>

              {/* CONSULTATION TEXT CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Consultation Section Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.cta_tag || 'Consultation'}
                    onBlur={(e) => handleHomepageUpdate({ cta_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Consultation Description Text</label>
                  <textarea
                    rows={2}
                    defaultValue={homepageContent.cta_description || ''}
                    onBlur={(e) => handleHomepageUpdate({ cta_description: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* GALLERY BOARD CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Gallery Section Tag</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.gallery_tag || 'Atmospheric Board'}
                    onBlur={(e) => handleHomepageUpdate({ gallery_tag: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Gallery Section Title</label>
                  <input
                    type="text"
                    defaultValue={homepageContent.gallery_title || 'Curated Details'}
                    onBlur={(e) => handleHomepageUpdate({ gallery_title: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Gallery Description Text</label>
                  <textarea
                    rows={2}
                    defaultValue={homepageContent.gallery_description || ''}
                    onBlur={(e) => handleHomepageUpdate({ gallery_description: e.target.value })}
                    className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none leading-relaxed"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: PROJECT CRUD MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight">Project Management</h1>
                <p className="text-xs text-ivory/40">Construct and modify client portfolio and case studies</p>
              </div>
              {editingProject && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      name: '', slug: '', category: 'Luxury Villas', location: '', 
                      hero_image: '', overview: '', design_challenge: '', 
                      design_solution: '', materials: [], client_name: '', 
                      client_testimonial: '', completion_date: '', images: []
                    });
                  }}
                  className="px-4 py-2 border border-ivory/30 text-ivory hover:text-gold text-[10px] uppercase tracking-widest"
                >
                  Cancel Edit / Add New
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Block */}
              <div className="lg:col-span-8 glass-panel p-8 rounded-sm space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                  {editingProject ? 'Modify Project Details' : 'Create New Project'}
                </h3>
                
                {/* Sub-tab navigation inside the project form */}
                <div className="flex flex-wrap border-b border-gold/15 mb-6">
                  {(['general', 'media', 'narrative', 'client'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setProjectFormTab(tab)}
                      className={`px-4 py-2.5 text-[9px] uppercase tracking-wider transition-all border-b-2 font-medium ${
                        projectFormTab === tab
                          ? 'border-gold text-gold font-semibold bg-gold/5'
                          : 'border-transparent text-ivory/60 hover:text-ivory hover:bg-white/40'
                      }`}
                    >
                      {tab === 'general' && '1. General Info'}
                      {tab === 'media' && '2. Media Assets'}
                      {tab === 'narrative' && '3. Design Narrative'}
                      {tab === 'client' && '4. Client & Curation'}
                    </button>
                  ))}
                </div>

                <form onSubmit={saveProject} className="space-y-6">
                  
                  {projectFormTab === 'general' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Project Name</label>
                          <input
                            type="text"
                            required
                            value={projectForm.name}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Slug (URL Route suffix)</label>
                          <input
                            type="text"
                            required
                            value={projectForm.slug}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            placeholder="e.g. residence-lumiere"
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Category</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          >
                            {['Luxury Villas', 'Apartments', 'Commercial', 'Renovations', 'Residential'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Location</label>
                          <input
                            type="text"
                            required
                            value={projectForm.location}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g. Geneva, Switzerland"
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Completion Date</label>
                          <input
                            type="text"
                            value={projectForm.completion_date}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, completion_date: e.target.value }))}
                            placeholder="e.g. June 2025"
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('media')}
                          className="px-6 py-2.5 bg-ivory text-dark-bg hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Continue to Media
                        </button>
                      </div>
                    </div>
                  )}

                  {projectFormTab === 'media' && (
                    <div className="space-y-6">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/70 block font-semibold">Main Hero Image</label>
                        {projectForm.hero_image ? (
                          <div className="relative group aspect-[16/9] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40 shadow-inner">
                            <img src={projectForm.hero_image} alt="Hero Preview" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                              <label className="px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                                <span>Change Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleHeroUpload}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setProjectForm(prev => ({ ...prev, hero_image: '' }))}
                                className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-8 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[16/9]">
                            <ImageIcon size={28} className="text-gold/60" />
                            <span className="text-[10px] uppercase tracking-widest text-gold font-medium">Upload Hero Image</span>
                            <span className="text-[8px] text-ivory/40">JPEG, PNG, WEBP formats</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gold/5">
                        {/* Before Image */}
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70 block">Before State Image (Optional)</label>
                          {projectForm.before_image ? (
                            <div className="relative group aspect-[16/9] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40 shadow-inner">
                              <img src={projectForm.before_image} alt="Before State Preview" className="object-cover w-full h-full" />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                                <label className="px-3 py-1.5 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[9px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                                  <span>Change</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBeforeUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setProjectForm(prev => ({ ...prev, before_image: '' }))}
                                  className="px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[9px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[16/9]">
                              <ImageIcon size={22} className="text-gold/50" />
                              <span className="text-[9px] uppercase tracking-widest text-gold font-medium">Upload Before Image</span>
                              <span className="text-[8px] text-ivory/30">JPEG, PNG, WEBP</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBeforeUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* After Image */}
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70 block">After State Image (Optional)</label>
                          {projectForm.after_image ? (
                            <div className="relative group aspect-[16/9] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40 shadow-inner">
                              <img src={projectForm.after_image} alt="After State Preview" className="object-cover w-full h-full" />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                                <label className="px-3 py-1.5 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[9px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                                  <span>Change</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAfterUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setProjectForm(prev => ({ ...prev, after_image: '' }))}
                                  className="px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[9px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[16/9]">
                              <ImageIcon size={22} className="text-gold/50" />
                              <span className="text-[9px] uppercase tracking-widest text-gold font-medium">Upload After Image</span>
                              <span className="text-[8px] text-ivory/30">JPEG, PNG, WEBP</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAfterUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-gold/5">
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('general')}
                          className="px-6 py-2.5 border border-gold/30 hover:border-gold text-gold text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('narrative')}
                          className="px-6 py-2.5 bg-ivory text-dark-bg hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Continue to Narrative
                        </button>
                      </div>
                    </div>
                  )}

                  {projectFormTab === 'narrative' && (
                    <div className="space-y-6">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/70">Overview Summary</label>
                        <textarea
                          rows={4}
                          required
                          value={projectForm.overview}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, overview: e.target.value }))}
                          className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none font-sans leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Design Challenge</label>
                          <textarea
                            rows={5}
                            required
                            value={projectForm.design_challenge}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, design_challenge: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none font-sans leading-relaxed"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Design Solution</label>
                          <textarea
                            rows={5}
                            required
                            value={projectForm.design_solution}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, design_solution: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none font-sans leading-relaxed"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-gold/5">
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('media')}
                          className="px-6 py-2.5 border border-gold/30 hover:border-gold text-gold text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('client')}
                          className="px-6 py-2.5 bg-ivory text-dark-bg hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Continue to Client & Curation
                        </button>
                      </div>
                    </div>
                  )}

                  {projectFormTab === 'client' && (
                    <div className="space-y-6">
                      {/* Testimonial info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Client Name</label>
                          <input
                            type="text"
                            value={projectForm.client_name}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, client_name: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/70">Client Testimonial Quote</label>
                          <textarea
                            rows={2}
                            value={projectForm.client_testimonial}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, client_testimonial: e.target.value }))}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Materials Chip manager */}
                      <div className="space-y-3 pt-4 border-t border-gold/5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/70 block font-semibold">Material Curation</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {projectForm.materials.map((m, i) => (
                            <span key={i} className="px-2 py-1 bg-gold/15 border border-gold/30 text-[9px] uppercase tracking-wider text-gold rounded-full flex items-center space-x-1">
                              <span>{m}</span>
                              <button 
                                type="button" 
                                onClick={() => setProjectForm(prev => ({ ...prev, materials: prev.materials.filter((_, idx) => idx !== i) }))}
                                className="text-red-400 hover:text-red-300 ml-1 font-bold font-sans"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMaterial}
                            onChange={(e) => setNewMaterial(e.target.value)}
                            placeholder="e.g. Travertine Marble"
                            className="flex-1 bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none px-3 py-2 text-xs text-ivory rounded-sm font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newMaterial.trim()) return;
                              setProjectForm(prev => ({ ...prev, materials: [...prev.materials, newMaterial.trim()] }));
                              setNewMaterial('');
                            }}
                            className="px-4 py-2 border border-gold/30 hover:border-gold text-gold hover:text-dark-bg hover:bg-gold text-[9px] uppercase tracking-widest transition-all duration-300 rounded-sm font-semibold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Project Gallery image list */}
                      <div className="space-y-3 pt-4 border-t border-gold/5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/70 block font-semibold">Project Portfolio Images (Carousel)</label>
                        
                        {/* Visual Image Thumbnails Grid */}
                        {projectForm.images && projectForm.images.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                            {projectForm.images.map((img, i) => (
                              <div key={i} className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gold/10 group bg-dark-bg shadow-sm">
                                <img src={img} alt={`Preview ${i}`} className="object-cover w-full h-full" />
                                <button
                                  type="button"
                                  onClick={() => setProjectForm(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                                  className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 text-[9px] uppercase tracking-widest font-semibold transition-opacity duration-300 cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Dotted Multiple Image Upload Input */}
                        <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2">
                          <Plus size={20} className="text-gold" />
                          <span className="text-[10px] uppercase tracking-widest text-gold font-medium">Select & Upload Portfolio Images</span>
                          <span className="text-[8px] text-ivory/40">Select multiple files (JPEG, PNG, WEBP)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleCarouselUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gold/5 mt-6">
                        <button
                          type="button"
                          onClick={() => setProjectFormTab('narrative')}
                          className="px-6 py-2.5 border border-gold/30 hover:border-gold text-gold text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-2.5 bg-gold text-dark-bg hover:bg-gold/80 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 shadow-md rounded-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {editingProject ? 'Save Project Details' : 'Publish Project'}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              </div>

              {/* List Block */}
              <div className="lg:col-span-4 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Existing Projects</h3>
                <div className="space-y-4">
                  {projects.map(p => (
                    <div key={p.id} className="p-4 bg-dark-surface border border-gold/5 rounded-sm flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-ivory">{p.name}</h4>
                        <p className="text-[9px] text-gold uppercase tracking-wider">{p.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => startEditProject(p)}
                          className="p-2 border border-gold/15 hover:border-gold rounded text-gold transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button 
                          onClick={() => deleteProject(p.id)}
                          className="p-2 border border-red-900/40 hover:border-red-400 rounded text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TEAM MANAGEMENT CRUD */}
        {activeTab === 'team' && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Design Team</h1>
              <p className="text-xs text-ivory/40">Manage profile data and descriptions of the creative collective</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Block */}
              <div className="lg:col-span-6 glass-panel p-8 rounded-sm space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Add Team Member</h3>
                <form onSubmit={saveTeamMember} className="space-y-6">
                  
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Designer Name</label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Designation (Role)</label>
                    <input
                      type="text"
                      required
                      value={teamForm.designation}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, designation: e.target.value }))}
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70 block">Portrait Image</label>
                    {teamForm.image_url ? (
                      <div className="relative group aspect-[3/4] w-48 rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40">
                        <img src={teamForm.image_url} alt="Team Member Preview" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2">
                          <label className="px-3 py-1.5 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[9px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setTeamForm(prev => ({ ...prev, image_url: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setTeamForm(prev => ({ ...prev, image_url: '' }))}
                            className="px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[9px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 w-48 aspect-[3/4]">
                        <ImageIcon size={20} className="text-gold/50" />
                        <span className="text-[10px] uppercase tracking-widest text-gold font-medium">Upload Portrait</span>
                        <span className="text-[8px] text-ivory/30 font-medium">JPEG, PNG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setTeamForm(prev => ({ ...prev, image_url: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Short Biography description</label>
                    <textarea
                      rows={4}
                      required
                      value={teamForm.description}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold hover:bg-champagne text-dark-bg font-semibold text-xs uppercase tracking-[0.25em] transition-all rounded-sm flex items-center justify-center space-x-2"
                  >
                    <PlusCircle size={12} />
                    <span>Publish Member</span>
                  </button>

                </form>
              </div>

              {/* List Block */}
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">The Collective</h3>
                <div className="space-y-4">
                  {team.map(member => (
                    <div key={member.id} className="p-4 bg-dark-surface border border-gold/5 rounded-sm flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gold/25">
                          <img src={member.image_url} alt={member.name} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-ivory">{member.name}</h4>
                          <p className="text-[9px] text-gold uppercase tracking-wider mt-0.5">{member.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setEditingTeam(member);
                            setTeamForm({
                              name: member.name,
                              designation: member.designation,
                              description: member.description,
                              image_url: member.image_url
                            });
                          }}
                          className="p-2 border border-gold/20 hover:border-gold rounded text-gold transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => deleteTeam(member.id)}
                          className="p-2 border border-red-900/40 hover:border-red-400 rounded text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: GALLERY CURATION */}
        {activeTab === 'gallery' && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Gallery Curation</h1>
              <p className="text-xs text-ivory/40">Upload and catalog structural details for the inspiration wall</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Block */}
              <div className="lg:col-span-5 glass-panel p-8 rounded-sm space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Add Gallery Item</h3>
                <form onSubmit={addGalleryItem} className="space-y-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70 block">Gallery Image</label>
                    {galleryForm.image_url ? (
                      <div className="relative group aspect-[4/3] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40">
                        <img src={galleryForm.image_url} alt="Gallery Preview" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <label className="px-3 py-1.5 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[9px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setGalleryForm(prev => ({ ...prev, image_url: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setGalleryForm(prev => ({ ...prev, image_url: '' }))}
                            className="px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[9px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-8 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[4/3]">
                        <ImageIcon size={20} className="text-gold/50" />
                        <span className="text-[10px] uppercase tracking-widest text-gold font-medium">Upload Image</span>
                        <span className="text-[8px] text-ivory/30 font-medium">JPEG, PNG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setGalleryForm(prev => ({ ...prev, image_url: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Category Segment</label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    >
                      {['Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/70">Render Width (px)</label>
                      <input
                        type="number"
                        value={galleryForm.width}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                        className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/70">Render Height (px)</label>
                      <input
                        type="number"
                        value={galleryForm.height}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                        className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Caption metadata</label>
                    <input
                      type="text"
                      value={galleryForm.caption}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="e.g. Bathroom custom Travertine sink detail"
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold hover:bg-champagne text-dark-bg font-semibold text-xs uppercase tracking-[0.25em] transition-all rounded-sm flex items-center justify-center space-x-2"
                  >
                    <PlusCircle size={12} />
                    <span>Publish to Inspiration</span>
                  </button>

                </form>
              </div>

              {/* Grid List Block */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Inspiration Grid</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="relative aspect-square overflow-hidden group border border-gold/5 bg-dark-surface rounded-sm">
                      <img src={item.image_url} alt="Gallery item" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-4">
                        <button 
                          onClick={() => deleteGallery(item.id)}
                          className="p-2 bg-red-900 border border-red-500 rounded text-red-200 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: FORM BUILDER */}
        {activeTab === 'formbuilder' && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Contact Form Builder</h1>
              <p className="text-xs text-ivory/40">Manage questionnaire input fields dynamically without modifying code</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Add Custom Field Form */}
              <div className="lg:col-span-5 glass-panel p-8 rounded-sm space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Add New Field</h3>
                <form onSubmit={addCustomField} className="space-y-6">
                  
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Unique Field ID (No spaces)</label>
                    <input
                      type="text"
                      required
                      value={newFieldForm.id}
                      onChange={(e) => setNewFieldForm(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="e.g. expected_start"
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Display Label</label>
                    <input
                      type="text"
                      required
                      value={newFieldForm.label}
                      onChange={(e) => setNewFieldForm(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g. Expected Start Date"
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/70">Input Element Type</label>
                    <select
                      value={newFieldForm.field_type}
                      onChange={(e) => setNewFieldForm(prev => ({ ...prev, field_type: e.target.value as any }))}
                      className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                    >
                      <option value="text">Single Line Text</option>
                      <option value="email">Email Address</option>
                      <option value="tel">Telephone / Phone</option>
                      <option value="select">Dropdown Select</option>
                      <option value="textarea">Multi-line Textarea</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_required"
                      checked={newFieldForm.is_required}
                      onChange={(e) => setNewFieldForm(prev => ({ ...prev, is_required: e.target.checked }))}
                      className="accent-gold h-4 w-4"
                    />
                    <label htmlFor="is_required" className="text-[10px] uppercase tracking-widest text-ivory/80">Required Input Field</label>
                  </div>

                  {/* Dropdown Options manager if select is active */}
                  {newFieldForm.field_type === 'select' && (
                    <div className="space-y-3 pt-4 border-t border-gold/5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/70 block">Dropdown Select Options</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newFieldForm.options.map((opt, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gold/10 text-[9px] uppercase tracking-wider rounded border border-gold/20 flex items-center space-x-1">
                            <span>{opt}</span>
                            <button type="button" onClick={() => setNewFieldForm(prev => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }))} className="text-red-400 font-bold ml-1">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newFieldOption}
                          onChange={(e) => setNewFieldOption(e.target.value)}
                          placeholder="Option text"
                          className="flex-1 bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none px-3 py-2 text-xs text-ivory rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFieldOption.trim()) return;
                            setNewFieldForm(prev => ({ ...prev, options: [...prev.options, newFieldOption.trim()] }));
                            setNewFieldOption('');
                          }}
                          className="px-4 py-2 border border-gold/30 hover:border-gold text-gold hover:text-dark-bg hover:bg-gold text-[10px] uppercase tracking-widest transition-all"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold hover:bg-champagne text-dark-bg font-semibold text-xs uppercase tracking-[0.25em] transition-all rounded-sm flex items-center justify-center space-x-2"
                  >
                    <PlusCircle size={12} />
                    <span>Append Field</span>
                  </button>

                </form>
              </div>

              {/* Input list with configurations */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-medium font-semibold">Dynamic Questionnaire Configuration</h3>
                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="p-6 bg-dark-surface border border-gold/5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-semibold text-ivory">{field.label}</h4>
                          <span className="text-[8px] font-mono uppercase bg-gold/10 px-1.5 py-0.5 rounded text-gold">{field.field_type}</span>
                        </div>
                        <p className="text-[9px] text-ivory/40">DB ID: {field.id}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer text-[10px] uppercase tracking-wider text-ivory/60">
                          <input
                            type="checkbox"
                            checked={field.is_active}
                            onChange={(e) => toggleFieldState(field.id, e.target.checked)}
                            className="accent-gold h-3.5 w-3.5"
                          />
                          <span>Active</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-[10px] uppercase tracking-wider text-ivory/60">
                          <input
                            type="checkbox"
                            checked={field.is_required}
                            disabled={!field.is_active}
                            onChange={(e) => toggleFieldRequired(field.id, e.target.checked)}
                            className="accent-gold h-3.5 w-3.5"
                          />
                          <span>Required</span>
                        </label>
                        {/* Custom fields delete */}
                        {!['name', 'email', 'message'].includes(field.id) && (
                          <button 
                            onClick={() => deleteField(field.id)}
                            className="p-1.5 border border-red-900/30 hover:border-red-400 rounded text-red-400 transition-colors ml-2"
                            title="Delete custom field"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 7: LEADS PIPELINE INQUIRY MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Leads & Inquiries</h1>
              <p className="text-xs text-ivory/40">Track prospective client questionnaires and manage workflow statuses</p>
            </div>

            <div className="space-y-6">
              {inquiries.length === 0 ? (
                <div className="p-12 text-center border border-gold/5 bg-dark-surface/40 rounded-sm">
                  <p className="text-xs text-ivory/40 uppercase tracking-widest">No inquiries captured yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="glass-panel p-8 rounded-sm space-y-6 border border-gold/10"
                    >
                      {/* Card Header details */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-light text-ivory">
                            {inq.submission_data?.name || 'Anonymous'}
                          </h3>
                          <p className="text-[10px] text-gold uppercase tracking-wider">
                            Type: {inq.submission_data?.project_type || 'Bespoke design'} — Budget: {inq.submission_data?.budget_range || 'Not specified'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select
                            value={inq.status}
                            onChange={(e) => updateLeadStatus(inq.id, e.target.value as any)}
                            className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none px-3 py-1.5 text-[10px] uppercase tracking-wider text-gold rounded-sm"
                          >
                            {['New', 'Contacted', 'In Progress', 'Closed'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteLeadInquiry(inq.id)}
                            className="p-2 border border-red-950 hover:border-red-400 hover:bg-red-900/10 rounded text-red-400 transition-all"
                            title="Delete Lead"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Card Body details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
                        <div className="space-y-3">
                          <h4 className="text-[9px] uppercase tracking-widest text-gold font-medium">Questionnaire Answers</h4>
                          <div className="grid grid-cols-1 gap-2 text-ivory/70">
                            {Object.entries(inq.submission_data || {})
                              .filter(([key]) => key !== 'name' && key !== 'message')
                              .map(([key, val]) => (
                                <div key={key} className="flex space-x-2">
                                  <span className="capitalize text-ivory/40">{key.replace('_', ' ')}:</span>
                                  <span>{String(val || '')}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[9px] uppercase tracking-widest text-gold font-medium">Design Details Brief</h4>
                          <p className="bg-dark-bg/60 p-4 rounded-sm border border-gold/5 text-ivory/80 leading-relaxed font-light whitespace-pre-wrap italic">
                            "{inq.submission_data?.message || 'No details provided'}"
                          </p>
                        </div>
                      </div>

                      {/* Date captured footer */}
                      <p className="text-[9px] text-ivory/30 text-right">
                        Captured: {new Date(inq.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SEO MANAGEMENT */}
        {activeTab === 'seo' && seoSettings && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">SEO Metadata Management</h1>
              <p className="text-xs text-ivory/40">Adjust site meta tags and keywords for indexing optimization</p>
            </div>

            <div className="glass-panel p-8 rounded-sm space-y-6">
              
              <div className="space-y-2 flex flex-col max-w-xs">
                <label className="text-[10px] uppercase tracking-widest text-gold">Select Page to Manage</label>
                <select
                  value={selectedSeoPage}
                  onChange={(e) => setSelectedSeoPage(e.target.value)}
                  className="bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm"
                >
                  {['home', 'about', 'projects', 'gallery', 'services', 'contact'].map(p => (
                    <option key={p} value={p} className="capitalize">{p} Page</option>
                  ))}
                </select>
              </div>

              <form onSubmit={saveSeo} className="space-y-6 pt-4 border-t border-gold/5">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Meta Title Tag</label>
                  <input
                    type="text"
                    required
                    value={seoSettings.meta_title}
                    onChange={(e) => setSeoSettings(prev => prev ? { ...prev, meta_title: e.target.value } : null)}
                    className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Meta Description Tag</label>
                  <textarea
                    rows={3}
                    required
                    value={seoSettings.meta_description}
                    onChange={(e) => setSeoSettings(prev => prev ? { ...prev, meta_description: e.target.value } : null)}
                    className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm resize-none leading-relaxed font-sans"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Meta Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={seoSettings.meta_keywords || ''}
                    onChange={(e) => setSeoSettings(prev => prev ? { ...prev, meta_keywords: e.target.value } : null)}
                    className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                  <label className="text-[10px] uppercase tracking-widest text-gold block mb-1">Open Graph (OG) Share Image</label>
                  {seoSettings.og_image_url ? (
                    <div className="relative group aspect-[16/9] w-full rounded-sm overflow-hidden border border-gold/15 bg-dark-bg/40 shadow-inner">
                      <img src={seoSettings.og_image_url} alt="OG Share Preview" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <label className="px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-dark-bg text-[10px] uppercase tracking-widest cursor-pointer rounded-sm transition-all duration-300 font-medium">
                          <span>Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSeoOgUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setSeoSettings(prev => prev ? { ...prev, og_image_url: '' } : null)}
                          className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-gold/15 border-dashed rounded-sm bg-dark-bg/20 p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center space-y-2 aspect-[16/9]">
                      <ImageIcon size={24} className="text-gold/60" />
                      <span className="text-[9px] uppercase tracking-widest text-gold font-medium">Upload Share Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSeoOgUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gold hover:bg-champagne text-dark-bg font-semibold text-xs uppercase tracking-[0.25em] transition-all rounded-sm flex items-center space-x-2"
                >
                  <Save size={12} />
                  <span>Save Metadata Settings</span>
                </button>
              </form>

            </div>
          </div>
        )}
        {/* TAB 9: STUDIO SETTINGS */}
        {activeTab === 'settings' && studioForm && (
          <div className="space-y-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight">Studio Settings</h1>
              <p className="text-xs text-ivory/40">Manage studio address, contact details, hours, and default brand statements</p>
            </div>

            <div className="glass-panel p-8 rounded-sm space-y-6">
              <form onSubmit={saveStudioSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={studioForm.phone}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={studioForm.email}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">Studio Address</label>
                  <textarea
                    rows={2}
                    required
                    value={studioForm.address}
                    onChange={(e) => setStudioForm(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Weekday Label (e.g. Monday - Friday)</label>
                    <input
                      type="text"
                      required
                      value={studioForm.hours_weekday}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, hours_weekday: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Weekday Hours (e.g. 09:00 AM - 06:00 PM)</label>
                    <input
                      type="text"
                      required
                      value={studioForm.hours_weekday_time}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, hours_weekday_time: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Weekend Label (e.g. Saturday)</label>
                    <input
                      type="text"
                      required
                      value={studioForm.hours_weekend}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, hours_weekend: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-gold">Weekend Hours (e.g. 10:00 AM - 04:00 PM / Appt)</label>
                    <input
                      type="text"
                      required
                      value={studioForm.hours_weekend_time}
                      onChange={(e) => setStudioForm(prev => prev ? { ...prev, hours_weekend_time: e.target.value } : null)}
                      className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gold">About Footer Text</label>
                  <textarea
                    rows={4}
                    required
                    value={studioForm.about_text}
                    onChange={(e) => setStudioForm(prev => prev ? { ...prev, about_text: e.target.value } : null)}
                    className="w-full bg-dark-bg border border-gold/15 focus:border-gold focus:outline-none p-3 text-xs text-ivory rounded-sm font-sans resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gold hover:bg-champagne text-dark-bg font-semibold text-xs uppercase tracking-[0.25em] transition-all rounded-sm flex items-center space-x-2"
                >
                  <Save size={12} />
                  <span>Save Studio Settings</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
