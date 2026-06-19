-- Database Schema for Ethereal Spaces
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
    page VARCHAR(50) PRIMARY KEY,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    meta_keywords TEXT,
    og_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Homepage Content Table (Single row configuration)
CREATE TABLE IF NOT EXISTS homepage_content (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    why_choose_us JSONB NOT NULL, -- Array of objects: { title, description }
    design_process JSONB NOT NULL, -- Array of objects: { step, title, description }
    cta_title TEXT NOT NULL,
    cta_button_text TEXT NOT NULL,
    
    -- Configurable Fields
    portfolio_tag TEXT DEFAULT 'Portfolio',
    portfolio_title TEXT DEFAULT 'Featured Projects',
    portfolio_link_text TEXT DEFAULT 'View All Showcase',
    distinction_tag TEXT DEFAULT 'Distinction',
    distinction_title TEXT DEFAULT 'Quiet Luxury, Measured Precision',
    distinction_text TEXT DEFAULT 'We design environments that are sensory experiences. Sourcing rare natural marble, specifying low-profile technical lighting pockets, and detailing joinery borders is our standard.',
    distinction_badge_title TEXT DEFAULT 'Geneva Studio',
    distinction_badge_desc TEXT DEFAULT 'Swiss-precision architectural engineering',
    methodology_tag TEXT DEFAULT 'Methodology',
    methodology_title TEXT DEFAULT 'The Curation Workflow',
    showcase_tag TEXT DEFAULT 'Showcase',
    showcase_title TEXT DEFAULT 'Atmospheric Board',
    cta_tag TEXT DEFAULT 'Inquire',
    cta_description TEXT DEFAULT 'Schedule a private spatial dialogue or request a tailored architectural brief.',
    gallery_tag TEXT DEFAULT 'Gallery',
    gallery_title TEXT DEFAULT 'Spatial Details',
    gallery_description TEXT DEFAULT 'Browse curated photographs showcasing materiality and structural forms from our projects.',

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Residential', 'Commercial', 'Luxury Villas', 'Apartments', 'Renovations'
    location VARCHAR(100) NOT NULL,
    hero_image TEXT NOT NULL,
    overview TEXT NOT NULL,
    design_challenge TEXT NOT NULL,
    design_solution TEXT NOT NULL,
    materials TEXT[] NOT NULL DEFAULT '{}',
    client_name VARCHAR(100),
    client_testimonial TEXT,
    completion_date VARCHAR(50),
    before_image TEXT,
    after_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Project Images Table
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Gallery Table (Masonry)
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Residential', 'Commercial', etc.
    caption TEXT,
    width INT DEFAULT 800,
    height INT DEFAULT 1200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Contact Form Fields Table (Dynamic form builder)
CREATE TABLE IF NOT EXISTS contact_form_fields (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'name', 'email', 'phone', 'project_type', 'budget_range', 'location', 'message'
    label VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'email', 'tel', 'select', 'textarea'
    is_required BOOLEAN DEFAULT FALSE,
    options TEXT[] DEFAULT '{}', -- For select fields
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Inquiries Table (Lead Capture)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_data JSONB NOT NULL, -- Stores dynamic form key-values
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Studio Settings Table (Configurable footer/contact info)
CREATE TABLE IF NOT EXISTS studio_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hours_weekday VARCHAR(100) NOT NULL,
    hours_weekday_time VARCHAR(100) NOT NULL,
    hours_weekend VARCHAR(100) NOT NULL,
    hours_weekend_time VARCHAR(100) NOT NULL,
    about_text TEXT NOT NULL,
    privacy_policy TEXT,
    terms_of_service TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

