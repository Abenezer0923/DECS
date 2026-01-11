import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            Digital Election Calendar System (DECS)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage electoral calendars, milestones, and communications efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/public/calendar" 
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Public Calendar
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
