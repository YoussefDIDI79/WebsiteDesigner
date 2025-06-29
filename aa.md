# BoxMedia - French Digital Agency Portfolio

## Overview

BoxMedia is a modern, performance-optimized portfolio website for a French digital agency specializing in web development, social media strategies, and UI/UX design. The website is built as a single-page application using vanilla web technologies with a focus on performance, accessibility, and user experience.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
- **Architecture Pattern**: Single Page Application (SPA) with smooth scroll navigation
- **Design Approach**: Mobile-first responsive design using CSS Grid and Flexbox
- **Language**: French language implementation with proper localization
- **Performance Strategy**: Progressive enhancement with lazy loading and optimized assets

### Backend Architecture
- **Server**: Custom Node.js HTTP server with performance optimizations
- **Static File Serving**: Enhanced with compression, caching headers, and MIME type handling
- **Deployment**: Designed for static hosting platforms (Netlify mentioned in meta tags)

## Key Components

### 1. Loading Screen System
- **Purpose**: Branded loading experience with progress animation
- **Implementation**: JavaScript-driven progress simulation with smooth transitions
- **Features**: BoxMedia logo animation, progress bar, fade-out transition
- **Performance**: Optimized to initialize AOS animations after load completion

### 2. Navigation System
- **Type**: Fixed navigation with smooth scroll behavior
- **Mobile Support**: Hamburger menu with JavaScript toggle functionality
- **Features**: Active section highlighting, responsive design, accessibility features
- **Scroll Behavior**: Debounced scroll handlers for performance optimization

### 3. Hero Section
- **Purpose**: Primary brand presentation with interactive elements
- **Content**: French messaging, animated statistics, technology showcase
- **Features**: Parallax effects, animated counters, video modal integration

### 4. Services Showcase
- **Structure**: Three core service categories (Web Development, Digital Marketing, UI/UX Design)
- **Presentation**: Interactive cards with hover animations and feature lists
- **Content**: Detailed descriptions in French with visual icons

### 5. Portfolio Gallery
- **Layout**: CSS Grid-based responsive portfolio showcase
- **Features**: Hover overlays, technology tags, demo links
- **Content**: Six diverse project examples across different industries

### 6. Contact System
- **Implementation**: Contact form with validation (frontend-only currently)
- **Information**: Company details, social media links, location data

## Data Flow

### Client-Side Flow
1. **Initial Load**: Loading screen displays while assets load
2. **Progressive Enhancement**: AOS animations initialize after load completion
3. **Navigation**: Smooth scroll navigation between sections
4. **Interactions**: Hover effects, mobile menu toggles, form interactions
5. **Performance**: Debounced scroll events prevent performance issues

### Server-Side Flow
1. **Request Handling**: Custom Node.js server processes file requests
2. **MIME Type Resolution**: Proper content-type headers for all file types
3. **Caching Strategy**: Immutable caching for static assets, no-cache for HTML
4. **Compression**: Gzip compression for text-based files

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter and Poppins font families for French typography
- **Font Awesome**: Version 6.5.1 for iconography
- **AOS Library**: Animate On Scroll for smooth reveal animations

### Performance Optimizations
- **Preconnect**: DNS prefetching for external resources
- **Font Display**: Optimized font loading strategy
- **Asset Caching**: Long-term caching for static assets

## Deployment Strategy

### Current Setup
- **Static Hosting**: Configured for Netlify deployment
- **Custom Server**: Node.js server for local development and potential VPS deployment
- **Performance**: Optimized for fast loading with proper caching headers

### Recommended Deployment
1. **Static Hosting**: Netlify, Vercel, or GitHub Pages for the frontend
2. **CDN**: Leverage CDN for global asset delivery
3. **Monitoring**: Performance monitoring for loading times and user experience

## Changelog

- June 29, 2025: Initial setup
- June 29, 2025: Fixed readability issues by improving color contrast and accessibility
  - Implemented WCAG AA compliant color system using CSS custom properties
  - Replaced problematic white text on green background combinations
  - Added proper semantic HTML structure with ARIA labels
  - Enhanced accessibility with skip links and screen reader support
  - Improved typography with better contrast ratios throughout the site
  - Maintained static site architecture with HTML, CSS, JS, and Netlify deployment
- June 29, 2025: Updated location from France to Morocco
  - Changed address from "123 Avenue des Champs-Élysées, 75008 Paris, France" to "Avenue Mohammed V, 20000 Casablanca, Maroc"
  - Updated phone numbers from French (+33) to Moroccan (+212) format
  - Updated structured data and contact forms with new location information
- June 29, 2025: Integrated Google Sheets form submission
  - Connected contact form to Google Apps Script URL for data collection
  - Added automatic timestamp with Morocco timezone (Africa/Casablanca)
  - Implemented no-cors fetch for cross-origin requests to Google Sheets
  - Enhanced form validation and user feedback for submission status

## User Preferences

Preferred communication style: Simple, everyday language.
Project architecture: Static website using HTML, CSS, JavaScript with Netlify deployment.