"use client";

import { useAuth } from "@/contexts/AuthContext";
import { VotingCardsList } from "@/components/VotingCardsList";
import { AdminDashboard } from "@/components/AdminDashboard";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export default function Home() {
  const { user, isAuthenticated, showRegisterForm, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Voting System
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {showRegisterForm
                ? "Create your account"
                : "Sign in to your account"}
            </p>
          </div>
          {showRegisterForm ? <RegisterForm /> : <LoginForm />}
        </div>
      </div>
    );
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
                Welcome, {user?.name}
              </span>
              {user?.role === "admin" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              )}
              <button onClick={() => logout()} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user?.role === "admin" ? <AdminDashboard /> : <VotingCardsList />}
      </main>
    </div>
  );
}
