import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">
            Recipe Finder
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/weekly-meals"
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md"
            >
              Weekly Meal Plan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
