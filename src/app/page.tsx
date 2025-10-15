import { getCurrentUser } from "@/lib/auth";
import { VotingCardsList } from "@/components/VotingCardsList";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AuthForms } from "@/components/AuthForms";
import { LogoutButton } from "@/components/AuthButtons";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return <AuthForms />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Voting System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              {user.role === "admin" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user.role === "admin" ? <AdminDashboard /> : <VotingCardsList />}
      </main>
    </div>
  );
}
