# K2 E-Commerce Website

<div align="center">
  <img src="images/k2-logo.png" alt="K2 Logo" width="150" />
</div>

A modern, minimalist e-commerce website built with Next.js and Supabase for data management.

## Brand Assets

The K2 brand emphasizes minimalism, natural elements, and modern design:

- **Logo**: A clean, modern design in our signature tan color (#C8B098)
- **Photography**: High contrast black & white imagery featuring natural elements
- **Interior Design**: Modern, airy spaces with natural materials and neutral colors

<div align="center">
  <img src="images/desert-landscape.jpg" alt="Desert Landscape" width="400" />
  <img src="images/modern-interior.jpg" alt="Modern Interior" width="400" />
</div>

## Design System

### Typography
- **Primary Font:** "Courier Prime", monospace
- **Font Sizes:**
  - Body Text: 12px - 16px
  - Headings: 20px - 24px
  - Tagline: 20px
  - Announcement Bar: 12px

### Colors
- **Primary Colors:**
  - Beige/Tan: #C8B098 (Announcement bar, accents)
  - White: #FFFFFF (Background)
  - Black: #000000 (Text)

- **Secondary Colors:**
  - Light Gray: #e6e1d6 (Borders)
  - Dark Gray: #333333 (Secondary text)

### Layout
- **Grid System:**
  - Products Grid: 3 columns (desktop), 1 column (mobile)
  - Categories Grid: 2 columns (desktop), 1 column (mobile)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 641px - 1024px
- Desktop: > 1024px

## Features

### Customer Features
- **Category Navigation**
  - Two main categories: WOMEN and OBJECTS
  - Simple, clean navigation menu
  - Category images on homepage

- **Product Display**
  - View products by category
  - Product images and details
  - Grid view for products

- **Shopping Cart**
  - Add products to cart
  - Remove products from cart
  - Cart total calculation
  - Cart sidebar overlay

### Admin Features
- **Product Management**
  - Add new products
  - Upload product images
  - Set product details (name, price, description, category)
  - Delete products

- **Category Management**
  - Two fixed categories (WOMEN, OBJECTS)
  - Category image management

## Technical Architecture

### Frontend
- **Next.js** - React framework with App Router
- **TypeScript** - For type safety
- **CSS Modules** - Scoped styling
- **Local Storage** - Cart persistence

### Backend (Supabase)
- **Database Tables**
  - `categories` - Store product categories
  - `products` - Store product information
  - `product_images` - Store product image URLs

- **Security**
  - Row Level Security (RLS) policies
  - Public read access
  - Authenticated write access for admin

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- Supabase project with required tables

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Ensure you set up the following:
1. Environment variables in Vercel project settings
2. Proper build settings
3. Domain configuration if needed

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
