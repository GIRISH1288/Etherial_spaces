-- Seed Data for Ethereal Spaces
-- Run this script in your Supabase SQL Editor after running schema.sql

-- 1. Seed Homepage Content
INSERT INTO homepage_content (
    id,
    hero_title,
    hero_subtitle,
    hero_image,
    why_choose_us,
    design_process,
    cta_title,
    cta_button_text,
    portfolio_tag,
    portfolio_title,
    portfolio_link_text,
    distinction_tag,
    distinction_title,
    distinction_text,
    distinction_badge_title,
    distinction_badge_desc,
    methodology_tag,
    methodology_title,
    showcase_tag,
    showcase_title,
    cta_tag,
    cta_description,
    gallery_tag,
    gallery_title,
    gallery_description
) VALUES (
    'default',
    'Designing Spaces That Inspire',
    'Transforming vision into timeless interiors through thoughtful design and uncompromising craftsmanship.',
    '/images/premium_hero_interior.png',
    '[
        {"title": "Bespoke Design", "description": "Tailored to your personal aesthetic and lifestyle, ensuring a unique spatial signature."},
        {"title": "Attention to Detail", "description": "From custom lighting pockets to joinery intersections, every millimeter is planned."},
        {"title": "End-to-End Execution", "description": "Complete management from schematic conceptual rendering to final hand-over styling."},
        {"title": "Premium Materials", "description": "Sourcing exotic natural stone, custom metal finishes, and luxury veneers globally."}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Discovery & Consultation", "description": "We align on your design aspirations, functional needs, project budget, and stylistic criteria."},
        {"step": 2, "title": "Concept Design", "description": "Developing floor plan layouts, mood boards, and overall atmospheric and material directions."},
        {"step": 3, "title": "Design Documentation", "description": "Providing photo-realistic 3D visual renders and complete construction-grade technical drawings."},
        {"step": 4, "title": "Execution & Management", "description": "On-site coordination with trade experts, verifying quality, and tracking timeline milestones."},
        {"step": 5, "title": "Turnkey Handover", "description": "Draping bespoke textiles, installing furniture collections, and styling accessories to absolute perfection."}
    ]'::jsonb,
    'Let''s Create Something Extraordinary Together',
    'Book a Consultation',
    'Portfolio',
    'Featured Projects',
    'View All Showcase',
    'The Distinction',
    'Our Philosophy of Craftsmanship',
    'At Ethereal Spaces, design goes far beyond selecting furnishings. We view environments as structural canvases that capture light, direct emotional pathways, and celebrate quiet luxury.',
    'Lighthouse Certified',
    'Clean code structures rendering under 120ms latency',
    'Methodology',
    'The Creation Journey',
    'Showcase',
    'Spaces of Serenity',
    'Consultation',
    'Let us arrange a personal alignment session to review your architectural canvas, timeline priorities, and aesthetic goals.',
    'Atmospheric Board',
    'Curated Details',
    'Explore the raw materials, textures, and bespoke joinery details that form the foundation of our spatial signature.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Projects
-- We use hardcoded UUIDs so the project_images seed keys match correctly
INSERT INTO projects (
    id, slug, name, category, location, hero_image, overview, design_challenge, design_solution, materials, client_name, client_testimonial, completion_date, before_image, after_image
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'residence-lumiere',
    'Residence Lumiere',
    'Luxury Villas',
    'Geneva, Switzerland',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    'A stunning lakeside estate engineered to capture reflection, light, and structured warmth. Constructed on the banks of Geneva, it blends clean geometries with soft natural textures.',
    'The lake-facing facade had strict thermal regulations under Swiss codes, meaning large glazing details needed careful passive energy balance without obstructing panoramic alpine views.',
    'We engineered custom triple-glazed, structural glass walls integrated with hidden perimeter ceiling channels for climate management and automated shade recesses.',
    ARRAY['Travertine Stone', 'Polished Aged Brass', 'Smoked Eucalyptus wood', 'Nubuck Leather'],
    'The Dubois Family',
    'Ethereal Spaces turned our site into a living sculpture. The play of light in the double-height salon is simply poetic.',
    'June 2025',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
),
(
    '22222222-2222-2222-2222-222222222222',
    'serene-penthouse',
    'Serene Penthouse',
    'Apartments',
    'Manhattan, New York',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    'A high-rise penthouse situated above the skyline. The project is an exploration of "warm minimalism"—substituting clinical white surfaces with textured plaster, linen wallcoverings, and tactile stone.',
    'The apartment had an awkward, low-ceiling central corridor that separated the master wing from the living spaces, creating a dark tunnel effect.',
    'We raised the visual threshold by implementing continuous ceiling cove pockets and clad the walls in high-sheen Venetian plaster to bounce light from both exposures.',
    ARRAY['Calacatta Viola Marble', 'Brushed Bronze', 'Bleached Oak floors', 'Bouclé Wool'],
    'Marcus Vance',
    'A sanctuary in the sky. The noise of Manhattan melts away the moment I step out of the elevator. Incredible work.',
    'November 2024',
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
),
(
    '33333333-3333-3333-3333-333333333333',
    'monolith-office',
    'Monolith HQ',
    'Commercial',
    'Mayfair, London',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    'An private family office designed as a hybrid hospitality salon and executive suite. We crafted an interior that projects permanence, authority, and quiet luxury.',
    'The floor plan had to integrate high-density digital presentation walls and meeting facilities without feeling corporate, cold, or clinical.',
    'We hid all screens behind custom double-pivot walnut panels and suspended a raw concrete floating block over the main boardroom desk to organize lighting and sound insulation.',
    ARRAY['Suede Wall Panels', 'Fluted Limestone', 'Dark stained American Walnut', 'Gold Leaf Screens'],
    'Aegis Capital Group',
    'It has redefined our business discussions. Clients are instantly disarmed by the premium hospitality mood of the suites.',
    'March 2025',
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
),
(
    '44444444-4444-4444-4444-444444444444',
    'vienna-townhouse',
    'Vienna Townhouse',
    'Renovations',
    'Vienna, Austria',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
    'A historical rejuvenation of a 19th-century salon. The project features hand-restored wall panels sitting opposite ultra-modern modular kitchen blocks and Italian lighting fixtures.',
    'The client wanted a central heating/cooling system, but local heritage preservation codes forbid external ducts, wall penetrations, or modern wall-mounted units.',
    'We integrated HVAC distribution slots underneath custom timber window bench casings and routed plumbing lines through hollowed decorative columns.',
    ARRAY['Chevron White Oak', 'Statuario Marble', 'Italian Bouclé', 'Hand-applied Gilding'],
    'Dr. Elena Rostova',
    'They showed infinite respect for the historic plasterwork while introducing fully modern comforts and beautiful layouts.',
    'January 2026',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'
) ON CONFLICT (id) DO NOTHING;

-- 3. Seed Project Images
INSERT INTO project_images (project_id, image_url, caption, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', 'Front Facade View', 0),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200', 'Double-height Salon Lounge', 1),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200', 'Travertine Dining space detail', 2),

('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200', 'Dining Wing Overview', 0),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', 'Venetian Plaster Hallway', 1),

('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', 'Boardroom Suite Design', 0),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200', 'Lounge Hospitality Area', 1),

('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200', 'Historical Salon Spread', 0),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', 'Integrated Casings Detailing', 1);

-- 4. Seed Team Members
INSERT INTO team_members (name, designation, description, image_url, sort_order) VALUES
('Aria Thorne', 'Founder & Design Principal', 'With over 15 years designing luxury residences across Paris, London, and New York, Aria directs the artistic identity of every Ethereal Spaces project.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', 0),
('Julian Vance', 'Lead Architect', 'Julian translates visual concepts into exact structural layouts, overseeing custom joinery designs and micro-architectural detailing on-site.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600', 1),
('Clara Dupont', 'Material & Styling Lead', 'Clara travels globally to source exotic stones, handmade plaster layers, custom textiles, and antique accent curation for our spaces.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600', 2);

-- 5. Seed Gallery Table
INSERT INTO gallery (image_url, category, caption, width, height) VALUES
('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800', 'Residential', 'Lumiere Master Bathroom detailing custom Travertine marble slab sink', 800, 1200),
('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', 'Residential', 'Serene Penthouse Dining Space showing brushed bronze and oak details', 800, 1000),
('https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800', 'Renovations', 'Vienna Salon reading nook contrasting chevron flooring and modern velvet', 800, 1200),
('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', 'Commercial', 'Monolith Reception seating featuring fluted limestone columns', 800, 900),
('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', 'Luxury Villas', 'Kitchen composition focusing on Calacatta marble slab detailing', 800, 1100),
('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800', 'Apartments', 'Custom dressing suite with floor-to-ceiling smoked glass doors', 800, 1300),
('https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=800', 'Renovations', 'Staircase detail in the Vienna project highlighting restored steel banisters', 800, 1200),
('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', 'Luxury Villas', 'Spacious lounge focusing on bespoke low-profile boucle furniture', 800, 1000);

-- 6. Seed Contact Form Fields
INSERT INTO contact_form_fields (id, label, field_type, is_required, options, sort_order, is_active) VALUES
('name', 'Full Name', 'text', TRUE, '{}', 0, TRUE),
('email', 'Email Address', 'email', TRUE, '{}', 1, TRUE),
('phone', 'Phone Number', 'tel', FALSE, '{}', 2, TRUE),
('project_type', 'Project Type', 'select', TRUE, ARRAY['Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'], 3, TRUE),
('budget_range', 'Budget Range', 'select', TRUE, ARRAY['$50,000 - $100,000', '$100,000 - $250,000', '$250,000 - $500,000', '$500,000+'], 4, TRUE),
('location', 'Project Location', 'text', FALSE, '{}', 5, TRUE),
('message', 'Project Details / Vision', 'textarea', TRUE, '{}', 6, TRUE);

-- 7. Seed SEO Settings
INSERT INTO seo_settings (page, meta_title, meta_description, meta_keywords) VALUES
('home', 'Bespoke Luxury Curation | Ethereal Spaces', 'Ethereal Spaces curates high-end luxury interiors across Geneva, New York, London, and Vienna, specializing in residential and commercial spaces.', 'Luxury Interior Design, Geneva Architect, High-end Architecture'),
('about', 'Our Legacy & Philosophy | Ethereal Spaces', 'Learn about our dedication to Swiss-precision craftsmanship, curated raw materials, and the creative leadership behind Ethereal Spaces.', 'Bespoke Interior Studio, Luxury Designer Team'),
('projects', 'Spatial Narratives | Ethereal Spaces', 'Explore our portfolio of luxury villas, warm minimalist penthouses, commercial salons, and historical renovations.', 'Interior Portfolio, Design Gallery, Luxury Homes'),
('gallery', 'Atmospheric Materiality | Ethereal Spaces', 'Browse close-up structural compositions and textures highlighting travertine marble, smoked timbers, and fluted stone.', 'Interior Details, Design Materials, Plaster Finishes'),
('services', 'Turnkey Spatial Services | Ethereal Spaces', 'From schematic concept layout drafting to turnkey decoration and accessorization, explore our luxury execution packages.', 'Design Services, Residential Architect, Full Service Interior'),
('contact', 'Inquire & Connect | Ethereal Spaces', 'Take the first step towards transforming your environment. Reach out to schedule a consultation with our studio.', 'Contact Interior Designer, Book Design Consultation');

-- 8. Seed Studio Settings
INSERT INTO studio_settings (
    id, address, phone, email, hours_weekday, hours_weekday_time, hours_weekend, hours_weekend_time, about_text
) VALUES (
    'default',
    '15 Avenue de la Paix, Geneva, Switzerland',
    '+41 22 730 4000',
    'concierge@etherealspaces.com',
    'Mon - Fri',
    '09:00 AM - 06:00 PM',
    'Sat',
    '10:00 AM - 04:00 PM (By Appointment)',
    'We are passionate creators of extraordinary environments, dedicated to transforming spaces into timeless expressions of beauty, functionality, and personal style.'
) ON CONFLICT (id) DO NOTHING;
