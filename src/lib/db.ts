// db.ts - Hybrid Database Service Layer for Ethereal Spaces
// Auto-detects Supabase credentials; falls back to Client-Side LocalStorage with default seed data.

import { createClient } from '@supabase/supabase-js';

// Types matching our schema
export interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  why_choose_us: Array<{ title: string; description: string }>;
  design_process: Array<{ step: number; title: string; description: string }>;
  cta_title: string;
  cta_button_text: string;
  
  // New Configurable Fields
  portfolio_tag?: string;
  portfolio_title?: string;
  portfolio_link_text?: string;
  distinction_tag?: string;
  distinction_title?: string;
  distinction_text?: string;
  distinction_badge_title?: string;
  distinction_badge_desc?: string;
  methodology_tag?: string;
  methodology_title?: string;
  showcase_tag?: string;
  showcase_title?: string;
  cta_tag?: string;
  cta_description?: string;
  gallery_tag?: string;
  gallery_title?: string;
  gallery_description?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  hero_image: string;
  overview: string;
  design_challenge: string;
  design_solution: string;
  materials: string[];
  client_name?: string;
  client_testimonial?: string;
  completion_date?: string;
  images?: string[]; // array of image urls
  before_image?: string;
  after_image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
  caption?: string;
  width: number;
  height: number;
}

export interface FormField {
  id: string;
  label: string;
  field_type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  is_required: boolean;
  options: string[];
  sort_order: number;
  is_active: boolean;
}

export interface Inquiry {
  id: string;
  submission_data: Record<string, any>;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  created_at: string;
}

export interface SeoSettings {
  page: string;
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  og_image_url?: string;
}

export interface StudioSettings {
  id: string;
  address: string;
  phone: string;
  email: string;
  hours_weekday: string;
  hours_weekday_time: string;
  hours_weekend: string;
  hours_weekend_time: string;
  about_text: string;
  privacy_policy?: string;
  terms_of_service?: string;
}


// ----------------------------------------------------
// DEFAULT SEED DATA FOR LOCAL STORAGE FALLBACK
// ----------------------------------------------------

const SEED_HOMEPAGE: HomepageContent = {
  id: 'default',
  hero_title: 'Designing Spaces That Inspire',
  hero_subtitle: 'Transforming vision into timeless interiors through thoughtful design and uncompromising craftsmanship.',
  hero_image: '/images/premium_hero_interior.png',
  why_choose_us: [
    { title: 'Bespoke Design', description: 'Tailored to your personal aesthetic and lifestyle, ensuring a unique spatial signature.' },
    { title: 'Attention to Detail', description: 'From custom lighting pockets to joinery intersections, every millimeter is planned.' },
    { title: 'End-to-End Execution', description: 'Complete management from schematic conceptual rendering to final hand-over styling.' },
    { title: 'Premium Materials', description: 'Sourcing exotic natural stone, custom metal finishes, and luxury veneers globally.' }
  ],
  design_process: [
    { step: 1, title: 'Discovery & Consultation', description: 'We align on your design aspirations, functional needs, project budget, and stylistic criteria.' },
    { step: 2, title: 'Concept Design', description: 'Developing floor plan layouts, mood boards, and overall atmospheric and material directions.' },
    { step: 3, title: 'Design Documentation', description: 'Providing photo-realistic 3D visual renders and complete construction-grade technical drawings.' },
    { step: 4, title: 'Execution & Management', description: 'On-site coordination with trade experts, verifying quality, and tracking timeline milestones.' },
    { step: 5, title: 'Turnkey Handover', description: 'Draping bespoke textiles, installing furniture collections, and styling accessories to absolute perfection.' }
  ],
  cta_title: "Let's Create Something Extraordinary Together",
  cta_button_text: 'Book a Consultation',
  portfolio_tag: 'Portfolio',
  portfolio_title: 'Featured Projects',
  portfolio_link_text: 'View All Showcase',
  distinction_tag: 'The Distinction',
  distinction_title: 'Our Philosophy of Craftsmanship',
  distinction_text: 'At Ethereal Spaces, design goes far beyond selecting furnishings. We view environments as structural canvases that capture light, direct emotional pathways, and celebrate quiet luxury.',
  distinction_badge_title: 'Lighthouse Certified',
  distinction_badge_desc: 'Clean code structures rendering under 120ms latency',
  methodology_tag: 'Methodology',
  methodology_title: 'The Creation Journey',
  showcase_tag: 'Showcase',
  showcase_title: 'Spaces of Serenity',
  cta_tag: 'Consultation',
  cta_description: 'Let us arrange a personal alignment session to review your architectural canvas, timeline priorities, and aesthetic goals.',
  gallery_tag: 'Atmospheric Board',
  gallery_title: 'Curated Details',
  gallery_description: 'Explore the raw materials, textures, and bespoke joinery details that form the foundation of our spatial signature.'
};

const SEED_PROJECTS: Project[] = [
  {
    id: 'p1',
    slug: 'residence-lumiere',
    name: 'Residence Lumiere',
    category: 'Luxury Villas',
    location: 'Geneva, Switzerland',
    hero_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    overview: 'A stunning lakeside estate engineered to capture reflection, light, and structured warmth. Constructed on the banks of Geneva, it blends clean geometries with soft natural textures.',
    design_challenge: 'The lake-facing facade had strict thermal regulations under Swiss codes, meaning large glazing details needed careful passive energy balance without obstructing panoramic alpine views.',
    design_solution: 'We engineered custom triple-glazed, structural glass walls integrated with hidden perimeter ceiling channels for climate management and automated shade recesses.',
    materials: ['Travertine Stone', 'Polished Aged Brass', 'Smoked Eucalyptus wood', 'Nubuck Leather'],
    client_name: 'The Dubois Family',
    client_testimonial: 'Ethereal Spaces turned our site into a living sculpture. The play of light in the double-height salon is simply poetic.',
    completion_date: 'June 2025',
    before_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    after_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'p2',
    slug: 'serene-penthouse',
    name: 'Serene Penthouse',
    category: 'Apartments',
    location: 'Manhattan, New York',
    hero_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    overview: 'A high-rise penthouse situated above the skyline. The project is an exploration of "warm minimalism"—substituting clinical white surfaces with textured plaster, linen wallcoverings, and tactile stone.',
    design_challenge: 'The apartment had an awkward, low-ceiling central corridor that separated the master wing from the living spaces, creating a dark tunnel effect.',
    design_solution: 'We raised the visual threshold by implementing continuous ceiling cove pockets and clad the walls in high-sheen Venetian plaster to bounce light from both exposures.',
    materials: ['Calacatta Viola Marble', 'Brushed Bronze', 'Bleached Oak floors', 'Bouclé Wool'],
    client_name: 'Marcus Vance',
    client_testimonial: 'A sanctuary in the sky. The noise of Manhattan melts away the moment I step out of the elevator. Incredible work.',
    completion_date: 'November 2024',
    before_image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200',
    after_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'p3',
    slug: 'monolith-office',
    name: 'Monolith HQ',
    category: 'Commercial',
    location: 'Mayfair, London',
    hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    overview: 'An private family office designed as a hybrid hospitality salon and executive suite. We crafted an interior that projects permanence, authority, and quiet luxury.',
    design_challenge: 'The floor plan had to integrate high-density digital presentation walls and meeting facilities without feeling corporate, cold, or clinical.',
    design_solution: 'We hid all screens behind custom double-pivot walnut panels and suspended a raw concrete floating block over the main boardroom desk to organize lighting and sound insulation.',
    materials: ['Suede Wall Panels', 'Fluted Limestone', 'Dark stained American Walnut', 'Gold Leaf Screens'],
    client_name: 'Aegis Capital Group',
    client_testimonial: 'It has redefined our business discussions. Clients are instantly disarmed by the premium hospitality mood of the suites.',
    completion_date: 'March 2025',
    before_image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1200',
    after_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'p4',
    slug: 'vienna-townhouse',
    name: 'Vienna Townhouse',
    category: 'Renovations',
    location: 'Vienna, Austria',
    hero_image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
    overview: 'A historical rejuvenation of a 19th-century salon. The project features hand-restored wall panels sitting opposite ultra-modern modular kitchen blocks and Italian lighting fixtures.',
    design_challenge: 'The client wanted a central heating/cooling system, but local heritage preservation codes forbid external ducts, wall penetrations, or modern wall-mounted units.',
    design_solution: 'We integrated HVAC distribution slots underneath custom timber window bench casings and routed plumbing lines through hollowed decorative columns.',
    materials: ['Chevron White Oak', 'Statuario Marble', 'Italian Bouclé', 'Hand-applied Gilding'],
    client_name: 'Dr. Elena Rostova',
    client_testimonial: 'They showed infinite respect for the historic plasterwork while introducing fully modern comforts and beautiful layouts.',
    completion_date: 'January 2026',
    before_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200',
    after_image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
    ]
  }
];

const SEED_TEAM: TeamMember[] = [
  {
    id: 't1',
    name: 'Aria Thorne',
    designation: 'Founder & Design Principal',
    description: 'With over 15 years designing luxury residences across Paris, London, and New York, Aria directs the artistic identity of every Ethereal Spaces project.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    sort_order: 0
  },
  {
    id: 't2',
    name: 'Julian Vance',
    designation: 'Lead Architect',
    description: 'Julian translates visual concepts into exact structural layouts, overseeing custom joinery designs and micro-architectural detailing on-site.',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    sort_order: 1
  },
  {
    id: 't3',
    name: 'Clara Dupont',
    designation: 'Material & Styling Lead',
    description: 'Clara travels globally to source exotic stones, handmade plaster layers, custom textiles, and antique accent curation for our spaces.',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    sort_order: 2
  }
];

const SEED_GALLERY: GalleryItem[] = [
  { id: 'g1', image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800', category: 'Residential', caption: 'Lumiere Master Bathroom detailing custom Travertine marble slab sink', width: 800, height: 1200 },
  { id: 'g2', image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', category: 'Residential', caption: 'Serene Penthouse Dining Space showing brushed bronze and oak details', width: 800, height: 1000 },
  { id: 'g3', image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800', category: 'Renovations', caption: 'Vienna Salon reading nook contrasting chevron flooring and modern velvet', width: 800, height: 1200 },
  { id: 'g4', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', category: 'Commercial', caption: 'Monolith Reception seating featuring fluted limestone columns', width: 800, height: 900 },
  { id: 'g5', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', category: 'Luxury Villas', caption: 'Kitchen composition focusing on Calacatta marble slab detailing', width: 800, height: 1100 },
  { id: 'g6', image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800', category: 'Apartments', caption: 'Custom dressing suite with floor-to-ceiling smoked glass doors', width: 800, height: 1300 },
  { id: 'g7', image_url: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=800', category: 'Renovations', caption: 'Staircase detail in the Vienna project highlighting restored steel banisters', width: 800, height: 1200 },
  { id: 'g8', image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', category: 'Luxury Villas', caption: 'Spacious lounge focusing on bespoke low-profile boucle furniture', width: 800, height: 1000 }
];

const SEED_FORM_FIELDS: FormField[] = [
  { id: 'name', label: 'Full Name', field_type: 'text', is_required: true, options: [], sort_order: 0, is_active: true },
  { id: 'email', label: 'Email Address', field_type: 'email', is_required: true, options: [], sort_order: 1, is_active: true },
  { id: 'phone', label: 'Phone Number', field_type: 'tel', is_required: false, options: [], sort_order: 2, is_active: true },
  { id: 'project_type', label: 'Project Type', field_type: 'select', is_required: true, options: ['Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'], sort_order: 3, is_active: true },
  { id: 'budget_range', label: 'Budget Range', field_type: 'select', is_required: true, options: ['$50,000 - $100,000', '$100,000 - $250,000', '$250,000 - $500,000', '$500,000+'], sort_order: 4, is_active: true },
  { id: 'location', label: 'Project Location', field_type: 'text', is_required: false, options: [], sort_order: 5, is_active: true },
  { id: 'message', label: 'Project Details / Vision', field_type: 'textarea', is_required: true, options: [], sort_order: 6, is_active: true }
];

const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'inq1',
    submission_data: {
      name: 'Sofia Loren',
      email: 'sofia@example.com',
      phone: '+39 333 445566',
      project_type: 'Luxury Villas',
      budget_range: '$500,000+',
      location: 'Tuscany, Italy',
      message: 'We are seeking a complete architectural styling of our summer manor. Sourcing natural local travertine is a major theme.'
    },
    status: 'New',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inq2',
    submission_data: {
      name: 'David Stark',
      email: 'david@aegis.com',
      phone: '+44 207 946 0192',
      project_type: 'Commercial',
      budget_range: '$250,000 - $500,000',
      location: 'London, UK',
      message: 'We are expanding our executive suites in London. We want a workspace that matches the feel of a boutique hotel lobby.'
    },
    status: 'Contacted',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_SEO: SeoSettings[] = [
  { page: 'home', meta_title: 'Ethereal Spaces | Luxury Interior Design Studio', meta_description: 'Ethereal Spaces is an elite interior design studio specializing in creating timeless, sophisticated, and emotionally engaging environments.', meta_keywords: 'Interior Designer, Luxury Interior Design, Modern Interior Design, Design Studio' },
  { page: 'about', meta_title: 'Our Story & Vision | Ethereal Spaces', meta_description: 'Discover the design vision, philosophy, and creative team behind Ethereal Spaces luxury interior design.', meta_keywords: 'Interior Design Team, Design Philosophy, Aria Thorne' },
  { page: 'projects', meta_title: 'Curated Portfolios | Ethereal Spaces', meta_description: 'Browse our signature interior design transformations, from Geneva lakeside villas to Manhattan sky penthouses.', meta_keywords: 'Residential Portfolio, Commercial Interior Design' },
  { page: 'gallery', meta_title: 'Inspiration Board & Details | Ethereal Spaces', meta_description: 'Explore details of our craft: hand-finished plaster, natural stone, custom bronze work, and textile styling.', meta_keywords: 'Design Inspiration, Masonry Gallery, Material Curation' },
  { page: 'services', meta_title: 'Bespoke Interior Design Services | Ethereal Spaces', meta_description: 'From layout programming to turnkey furniture sourcing, explore our high-end design services.', meta_keywords: 'Interior Design Services, Spatial Planning, Turnkey Styling' },
  { page: 'contact', meta_title: 'Inquire & Connect | Ethereal Spaces', meta_description: 'Take the first step towards transforming your environment. Reach out to schedule a consultation with our studio.', meta_keywords: 'Contact Interior Designer, Book Design Consultation' }
];

const SEED_STUDIO_SETTINGS: StudioSettings = {
  id: 'default',
  address: '15 Avenue de la Paix, Geneva, Switzerland',
  phone: '+41 22 730 4000',
  email: 'concierge@etherealspaces.com',
  hours_weekday: 'Monday - Friday',
  hours_weekday_time: '09:00 AM - 06:00 PM',
  hours_weekend: 'Saturday',
  hours_weekend_time: '10:00 AM - 04:00 PM (By Appt)',
  about_text: 'We are passionate creators of extraordinary environments, dedicated to transforming spaces into timeless expressions of beauty, functionality, and personal style.',
  privacy_policy: '',
  terms_of_service: ''
};


// Helper to check if we should use Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ----------------------------------------------------
// LOCAL STORAGE DATABASE CLASS
// ----------------------------------------------------

class LocalStorageDatabase {
  private memoryDb: Record<string, any> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initKey('homepage_content', SEED_HOMEPAGE);
      this.initKey('projects', SEED_PROJECTS);
      this.initKey('team_members', SEED_TEAM);
      this.initKey('gallery', SEED_GALLERY);
      this.initKey('contact_form_fields', SEED_FORM_FIELDS);
      this.initKey('inquiries', SEED_INQUIRIES);
      this.initKey('seo_settings', SEED_SEO);
      this.initKey('studio_settings', SEED_STUDIO_SETTINGS);
    } else {
      // In SSR server context, store seed data in memory
      this.memoryDb = {
        homepage_content: SEED_HOMEPAGE,
        projects: SEED_PROJECTS,
        team_members: SEED_TEAM,
        gallery: SEED_GALLERY,
        contact_form_fields: SEED_FORM_FIELDS,
        inquiries: SEED_INQUIRIES,
        seo_settings: SEED_SEO,
        studio_settings: SEED_STUDIO_SETTINGS
      };
    }
  }


  private initKey(key: string, defaultData: any) {
    if (!localStorage.getItem(`ethereal_${key}`)) {
      localStorage.setItem(`ethereal_${key}`, JSON.stringify(defaultData));
    }
  }

  private get<T>(key: string, fallback: any): T {
    if (typeof window === 'undefined') {
      return (this.memoryDb[key] || fallback) as T;
    }
    try {
      const val = localStorage.getItem(`ethereal_${key}`);
      if (!val || val === 'undefined' || val === 'null') return fallback as T;
      const parsed = JSON.parse(val);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        return fallback as T;
      }
      if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) && (typeof parsed !== 'object' || Array.isArray(parsed))) {
        return fallback as T;
      }
      return (parsed || fallback) as T;
    } catch {
      return fallback as T;
    }
  }

  private set(key: string, data: any) {
    if (typeof window === 'undefined') {
      this.memoryDb[key] = data;
      return;
    }
    localStorage.setItem(`ethereal_${key}`, JSON.stringify(data));
  }

  // API IMPLEMENTATION
  async getHomepageContent(): Promise<HomepageContent> {
    return this.get<HomepageContent>('homepage_content', SEED_HOMEPAGE);
  }

  async updateHomepageContent(content: Partial<HomepageContent>): Promise<HomepageContent> {
    const current = await this.getHomepageContent();
    const updated = { ...current, ...content };
    this.set('homepage_content', updated);
    return updated;
  }

  async getProjects(): Promise<Project[]> {
    return this.get<Project[]>('projects', SEED_PROJECTS);
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.slug === slug) || null;
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = await this.getProjects();
    const newProject: Project = {
      ...project,
      id: `p-${Date.now()}`
    };
    projects.push(newProject);
    this.set('projects', projects);
    return newProject;
  }

  async updateProject(id: string, updatedFields: Partial<Project>): Promise<Project> {
    const projects = await this.getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    projects[idx] = { ...projects[idx], ...updatedFields };
    this.set('projects', projects);
    return projects[idx];
  }

  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.set('projects', filtered);
    return true;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const team = this.get<TeamMember[]>('team_members', SEED_TEAM);
    if (!Array.isArray(team)) return SEED_TEAM;
    return team.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const team = await this.getTeamMembers();
    const newMember: TeamMember = {
      ...member,
      id: `t-${Date.now()}`,
      sort_order: team.length
    };
    team.push(newMember);
    this.set('team_members', team);
    return newMember;
  }

  async updateTeamMember(id: string, updatedFields: Partial<TeamMember>): Promise<TeamMember> {
    const team = await this.getTeamMembers();
    const idx = team.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Team member not found');
    team[idx] = { ...team[idx], ...updatedFields };
    this.set('team_members', team);
    return team[idx];
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const team = await this.getTeamMembers();
    const filtered = team.filter(t => t.id !== id);
    this.set('team_members', filtered);
    return true;
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return this.get<GalleryItem[]>('gallery', SEED_GALLERY);
  }

  async createGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const gallery = await this.getGalleryItems();
    const newItem: GalleryItem = {
      ...item,
      id: `g-${Date.now()}`
    };
    gallery.push(newItem);
    this.set('gallery', gallery);
    return newItem;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const gallery = await this.getGalleryItems();
    const filtered = gallery.filter(g => g.id !== id);
    this.set('gallery', filtered);
    return true;
  }

  async getContactFormFields(): Promise<FormField[]> {
    const fields = this.get<FormField[]>('contact_form_fields', SEED_FORM_FIELDS);
    if (!Array.isArray(fields)) return SEED_FORM_FIELDS.filter(f => f.is_active);
    return fields
      .filter(f => f && f.is_active)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  async getAllContactFormFields(): Promise<FormField[]> {
    const fields = this.get<FormField[]>('contact_form_fields', SEED_FORM_FIELDS);
    if (!Array.isArray(fields)) return SEED_FORM_FIELDS;
    return fields.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  async saveContactFormFields(fields: FormField[]): Promise<FormField[]> {
    this.set('contact_form_fields', fields);
    return fields;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const inquiries = this.get<Inquiry[]>('inquiries', SEED_INQUIRIES);
    if (!Array.isArray(inquiries)) return SEED_INQUIRIES;
    return inquiries.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }

  async createInquiry(submissionData: Record<string, any>): Promise<Inquiry> {
    const inquiries = await this.getInquiries();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      submission_data: submissionData,
      status: 'New',
      created_at: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    this.set('inquiries', inquiries);
    return newInquiry;
  }

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    const inquiries = await this.getInquiries();
    const idx = inquiries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Inquiry not found');
    inquiries[idx].status = status;
    this.set('inquiries', inquiries);
    return inquiries[idx];
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const inquiries = await this.getInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    this.set('inquiries', filtered);
    return true;
  }

  async getSeoSettings(page: string): Promise<SeoSettings> {
    const settings = this.get<SeoSettings[]>('seo_settings', SEED_SEO);
    if (!Array.isArray(settings)) return { page, meta_title: 'Ethereal Spaces', meta_description: 'Bespoke Luxury Interior Design' };
    const pageSettings = settings.find(s => s && s.page === page);
    if (pageSettings) return pageSettings;
    return {
      page,
      meta_title: 'Ethereal Spaces',
      meta_description: 'Bespoke Luxury Interior Design'
    };
  }

  async saveSeoSettings(page: string, updated: Omit<SeoSettings, 'page'>): Promise<SeoSettings> {
    const settings = this.get<SeoSettings[]>('seo_settings', SEED_SEO);
    if (!Array.isArray(settings)) return { page, ...updated };
    const idx = settings.findIndex(s => s && s.page === page);
    const newSetting = { page, ...updated };
    if (idx === -1) {
      settings.push(newSetting);
    } else {
      settings[idx] = newSetting;
    }
    this.set('seo_settings', settings);
    return newSetting;
  }

  async getStudioSettings(): Promise<StudioSettings> {
    return this.get<StudioSettings>('studio_settings', SEED_STUDIO_SETTINGS);
  }

  async updateStudioSettings(updated: Partial<StudioSettings>): Promise<StudioSettings> {
    const current = await this.getStudioSettings();
    const result = { ...current, ...updated };
    this.set('studio_settings', result);
    return result;
  }
}


// Instantiate fallback local storage DB client
const localDb = new LocalStorageDatabase();

// ----------------------------------------------------
// HYBRID DATABASE ROUTER
// ----------------------------------------------------

export const db = {
  getHomepageContent: async (): Promise<HomepageContent> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('homepage_content').select('*').single();
      if (!error && data) return data as HomepageContent;
      // If error or table empty, try to seed it or use local
      console.warn('Supabase homepage_content error, falling back:', error);
    }
    return localDb.getHomepageContent();
  },

  updateHomepageContent: async (content: Partial<HomepageContent>): Promise<HomepageContent> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('homepage_content').upsert({ id: 'default', ...content }).select().single();
      if (!error && data) return data as HomepageContent;
      console.warn('Supabase updateHomepageContent error:', error);
    }
    return localDb.updateHomepageContent(content);
  },

  getProjects: async (): Promise<Project[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        // Hydrate with images
        const projectsWithImages = await Promise.all(data.map(async (p) => {
          const { data: imgData } = await supabase.from('project_images').select('image_url').eq('project_id', p.id).order('sort_order');
          return {
            ...p,
            images: imgData ? imgData.map(img => img.image_url) : [p.hero_image]
          };
        }));
        return projectsWithImages as Project[];
      }
      console.warn('Supabase getProjects error:', error);
    }
    return localDb.getProjects();
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (!error && data) {
        const { data: imgData } = await supabase.from('project_images').select('image_url').eq('project_id', data.id).order('sort_order');
        return {
          ...data,
          images: imgData ? imgData.map(img => img.image_url) : [data.hero_image]
        } as Project;
      }
      console.warn('Supabase getProjectBySlug error:', error);
    }
    return localDb.getProjectBySlug(slug);
  },

  createProject: async (project: Omit<Project, 'id' | 'images'>, imageUrls?: string[]): Promise<Project> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (!error && data) {
        if (imageUrls && imageUrls.length > 0) {
          const imageInserts = imageUrls.map((url, idx) => ({
            project_id: data.id,
            image_url: url,
            sort_order: idx
          }));
          await supabase.from('project_images').insert(imageInserts);
        }
        return { ...data, images: imageUrls || [data.hero_image] } as Project;
      }
      console.warn('Supabase createProject error:', error);
    }
    return localDb.createProject(project);
  },

  updateProject: async (id: string, updatedFields: Partial<Project>, imageUrls?: string[]): Promise<Project> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').update(updatedFields).eq('id', id).select().single();
      if (!error && data) {
        if (imageUrls) {
          // simple strategy: delete old and insert new
          await supabase.from('project_images').delete().eq('project_id', id);
          const imageInserts = imageUrls.map((url, idx) => ({
            project_id: id,
            image_url: url,
            sort_order: idx
          }));
          await supabase.from('project_images').insert(imageInserts);
        }
        return { ...data, images: imageUrls || [data.hero_image] } as Project;
      }
      console.warn('Supabase updateProject error:', error);
    }
    return localDb.updateProject(id, updatedFields);
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) return true;
      console.warn('Supabase deleteProject error:', error);
    }
    return localDb.deleteProject(id);
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
      if (!error && data) return data as TeamMember[];
      console.warn('Supabase getTeamMembers error:', error);
    }
    return localDb.getTeamMembers();
  },

  createTeamMember: async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('team_members').insert([member]).select().single();
      if (!error && data) return data as TeamMember;
      console.warn('Supabase createTeamMember error:', error);
    }
    return localDb.createTeamMember(member);
  },

  updateTeamMember: async (id: string, updatedFields: Partial<TeamMember>): Promise<TeamMember> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('team_members').update(updatedFields).eq('id', id).select().single();
      if (!error && data) return data as TeamMember;
      console.warn('Supabase updateTeamMember error:', error);
    }
    return localDb.updateTeamMember(id, updatedFields);
  },

  deleteTeamMember: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (!error) return true;
      console.warn('Supabase deleteTeamMember error:', error);
    }
    return localDb.deleteTeamMember(id);
  },

  getGalleryItems: async (): Promise<GalleryItem[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as GalleryItem[];
      console.warn('Supabase getGalleryItems error:', error);
    }
    return localDb.getGalleryItems();
  },

  createGalleryItem: async (item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery').insert([item]).select().single();
      if (!error && data) return data as GalleryItem;
      console.warn('Supabase createGalleryItem error:', error);
    }
    return localDb.createGalleryItem(item);
  },

  deleteGalleryItem: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) return true;
      console.warn('Supabase deleteGalleryItem error:', error);
    }
    return localDb.deleteGalleryItem(id);
  },

  getContactFormFields: async (): Promise<FormField[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_form_fields').select('*').eq('is_active', true).order('sort_order');
      if (!error && data) return data as FormField[];
      console.warn('Supabase getContactFormFields error:', error);
    }
    return localDb.getContactFormFields();
  },

  getAllContactFormFields: async (): Promise<FormField[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_form_fields').select('*').order('sort_order');
      if (!error && data) return data as FormField[];
      console.warn('Supabase getAllContactFormFields error:', error);
    }
    return localDb.getAllContactFormFields();
  },

  saveContactFormFields: async (fields: FormField[]): Promise<FormField[]> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_form_fields').upsert(fields);
      if (!error) return fields;
      console.warn('Supabase saveContactFormFields error:', error);
    }
    return localDb.saveContactFormFields(fields);
  },

  getInquiries: async (): Promise<Inquiry[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Inquiry[];
      console.warn('Supabase getInquiries error:', error);
    }
    return localDb.getInquiries();
  },

  createInquiry: async (submissionData: Record<string, any>): Promise<Inquiry> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('inquiries').insert([{ submission_data: submissionData, status: 'New' }]).select().single();
      if (!error && data) return data as Inquiry;
      console.warn('Supabase createInquiry error:', error);
    }
    return localDb.createInquiry(submissionData);
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<Inquiry> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', id).select().single();
      if (!error && data) return data as Inquiry;
      console.warn('Supabase updateInquiryStatus error:', error);
    }
    return localDb.updateInquiryStatus(id, status);
  },

  deleteInquiry: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (!error) return true;
      console.warn('Supabase deleteInquiry error:', error);
    }
    return localDb.deleteInquiry(id);
  },

  getSeoSettings: async (page: string): Promise<SeoSettings> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('seo_settings').select('*').eq('page', page).single();
      if (!error && data) return data as SeoSettings;
      console.warn('Supabase getSeoSettings error:', error);
    }
    return localDb.getSeoSettings(page);
  },

  saveSeoSettings: async (page: string, updated: Omit<SeoSettings, 'page'>): Promise<SeoSettings> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('seo_settings').upsert({ page, ...updated }).select().single();
      if (!error && data) return data as SeoSettings;
      console.warn('Supabase saveSeoSettings error:', error);
    }
    return localDb.saveSeoSettings(page, updated);
  },

  getStudioSettings: async (): Promise<StudioSettings> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('studio_settings').select('*').eq('id', 'default').single();
      if (!error && data) return data as StudioSettings;
      console.warn('Supabase getStudioSettings error, falling back:', error);
    }
    return localDb.getStudioSettings();
  },

  updateStudioSettings: async (updated: Partial<StudioSettings>): Promise<StudioSettings> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('studio_settings').upsert({ id: 'default', ...updated }).select().single();
      if (!error && data) return data as StudioSettings;
      console.warn('Supabase updateStudioSettings error:', error);
    }
    return localDb.updateStudioSettings(updated);
  }
};

