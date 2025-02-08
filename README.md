# Recipe Finder

A web application built with Next.js that allows users to search and view recipes using the Orama search engine. 

## Features

- 🔍 Real-time recipe search with Orama
- 📱 Responsive design that works on desktop and mobile
- 🎨 UI with shadcn/ui components
- 📖 Detailed recipe pages with ingredients and instructions
- ⚡ Fast and efficient search with pagination

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **UI Components**: shadcn/ui
- **Search Engine**: Orama Cloud
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- An Orama Cloud account with API credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd recipe-finder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Orama credentials:
```env
NEXT_PUBLIC_ORAMA_ENDPOINT=your_orama_endpoint
NEXT_PUBLIC_ORAMA_API_KEY=your_orama_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
recipe-finder/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # Home page with search
│   └── recipe/
│       └── [id]/
│           └── page.tsx   # Recipe detail page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── SearchBar.tsx     # Search component
│   └── RecipeCard.tsx    # Recipe card component
├── public/               # Static files
└── styles/              # Global styles
```

## Features in Detail

### Home Page
- Real-time search functionality
- Responsive grid layout for recipe cards
- Pagination for search results
- Loading, error, and empty states
- Recipe cards with key information:
  - Recipe name and category
  - Description
  - Cooking time
  - Servings
  - Calorie information

### Recipe Detail Page
- Comprehensive recipe information
- Ingredient list
- Step-by-step instructions
- Cooking time and servings
- Easy navigation back to search results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Acknowledgments
- [Food.com Dataset](https://www.kaggle.com/datasets/irkaal/foodcom-recipes-and-reviews) by Kaggle
- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Orama](https://orama.cloud/) for the powerful search functionality
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
