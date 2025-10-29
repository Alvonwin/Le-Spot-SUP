"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function SignupPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", formData);
    // Add signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-ocean-dark to-ocean">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-ocean rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.auth.signup.title}
          </h1>
          <p className="text-ocean-light">{t.auth.signup.subtitle}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">
                {t.auth.signup.name}
              </label>
              <input
                type="text"
                id="name"
                placeholder={t.auth.signup.namePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">
                {t.auth.signup.email}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t.auth.signup.emailPlaceholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2">
                {t.auth.signup.password}
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ocean-light hover:bg-ocean text-white font-semibold py-3 rounded transition-colors"
            >
              {t.auth.signup.submitButton}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {t.auth.signup.hasAccount}{" "}
            <Link href="/login" className="text-ocean-light hover:underline">
              {t.auth.signup.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
