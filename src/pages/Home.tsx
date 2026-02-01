import { useAuth } from '../hooks/useAuth'
import { ChatContainer } from '../components/Chat'

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">PlanPal</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
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
            {user?.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full sm:hidden"
              />
            )}
            <button
              onClick={signOut}
              className="bg-gray-200 text-gray-700 px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-8 flex flex-col">
        <div className="flex-1 min-h-0">
          <ChatContainer />
        </div>
      </main>
    </div>
  )
}
