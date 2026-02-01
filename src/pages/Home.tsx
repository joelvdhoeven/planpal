import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">PlanPal</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Welcome to PlanPal!</p>
      </main>
    </div>
  )
}
