import React, { useState } from "react";
import supabase from "@/src/supabase-client";
import { Page } from "../types";
import EyeIcon from "./icons/EyeIcon";

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate API login delay
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would validate credentials here
      setCurrentPage("Dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-kadin-navy relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-kadin-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-kadin-light-navy/80 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-kadin-white">
            KADIN <span className="text-kadin-gold">360</span>
          </h1>
          <h2 className="mt-4 text-xl font-semibold text-kadin-light-slate">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-kadin-slate">
            Access your dashboard, network, and opportunities.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-kadin-light-slate mb-1"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-kadin-white bg-kadin-navy focus:outline-none focus:ring-1 focus:ring-kadin-gold focus:border-kadin-gold focus:z-10 sm:text-sm"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-kadin-light-slate mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-kadin-white bg-kadin-navy focus:outline-none focus:ring-1 focus:ring-kadin-gold focus:border-kadin-gold focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-kadin-gold focus:ring-kadin-gold border-gray-600 rounded bg-kadin-navy"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-kadin-slate"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-kadin-gold hover:text-yellow-400"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-kadin-navy bg-kadin-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kadin-gold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-kadin-navy"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-kadin-navy group-hover:text-kadin-navy/80"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-kadin-slate">
            Don't have an account?{" "}
            <a
              onClick={() => setCurrentPage("Gabung Sekarang")}
              className="font-medium text-kadin-gold hover:text-yellow-400 cursor-pointer"
            >
              Register now
            </a>
          </p>
          <p className="mt-4">
            <a
              onClick={() => setCurrentPage("Beranda")}
              className="text-sm text-kadin-slate hover:text-kadin-white cursor-pointer flex items-center justify-center gap-1"
            >
              &larr; Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
