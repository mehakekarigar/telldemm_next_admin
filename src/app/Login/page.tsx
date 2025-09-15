// src/app/Login/page.tsx
"use client";
import Label from "@/components/form/Label";
import Link from "next/link";
import React, { useState, ChangeEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { login } from "../services/authService";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = await login({ email, password });
      Cookies.set("auth_token", token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoDetails = () => {
    setEmail("admin@demo.com");
    setPassword("123456");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="login-container">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="logo-text">Telldemm</h2>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          {/* Demo Fill Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={fillDemoDetails}
              className="demo-button"
              disabled={loading}
            >
              <span className="demo-button-text">Fill Demo Details</span>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <span>Signing you in...</span>
              </div>
            )}

            <div className="input-group">
              <Label htmlFor="email" className="input-label">
                Email Address
              </Label>
              <input
                id="email"
                placeholder="admin@demo.com"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <Label htmlFor="password" className="input-label">
                Password
              </Label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="forgot-link"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                <span className="submit-button-text">
                  {loading ? "Signing In..." : "Sign In"}
                </span>
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          {/* <div className="demo-info">
            <p className="text-sm text-gray-600">
              <strong>Demo:</strong> admin@demo.com / 123456
            </p>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        /* Floating background elements */
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(30, 136, 229, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .circle-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 120px;
          height: 120px;
          top: 30%;
          right: 30%;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        /* Container */
        .login-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #1e88e5;
          animation: progressBar 2s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressBar {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
          }
        }

        /* Logo */
        .logo-text {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e88e5;
          animation: logoGlow 2s ease-in-out infinite alternate;
        }

        @keyframes logoGlow {
          from { text-shadow: 0 0 5px rgba(30, 136, 229, 0.3); }
          to { text-shadow: 0 0 15px rgba(30, 136, 229, 0.6), 0 0 25px rgba(30, 136, 229, 0.3); }
        }

        /* Demo Button */
        .demo-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(45deg, #1e88e5, #42a5f5);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .demo-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 136, 229, 0.3);
        }

        .demo-button:active {
          transform: translateY(0);
        }

        .demo-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .demo-button:hover::before {
          left: 100%;
        }

        .demo-button-text {
          position: relative;
          z-index: 1;
        }

        /* Input Fields */
        .input-group {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .input-group:nth-child(1) { animation-delay: 0.1s; }
        .input-group:nth-child(2) { animation-delay: 0.2s; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .input-field {
          appearance: none;
          border-radius: 8px;
          position: relative;
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
          color: #111827;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #1e88e5;
          background: white;
          box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
          transform: scale(1.02);
        }

        .input-field:hover {
          border-color: #d1d5db;
        }

        /* Submit Button */
        .submit-button {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0.875rem 1rem;
          border: none;
          border-radius: 8px;
          background: #1e88e5;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          background: #1976d2;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .submit-button-text {
          position: relative;
          z-index: 1;
        }

        /* Loading */
        .loading-message {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          background: rgba(30, 136, 229, 0.1);
          border: 1px solid rgba(30, 136, 229, 0.2);
          border-radius: 8px;
          color: #1e88e5;
          font-size: 0.875rem;
          gap: 0.5rem;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(30, 136, 229, 0.3);
          border-top: 2px solid #1e88e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error Message */
        .error-message {
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          text-align: center;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Forgot Link */
        .forgot-link {
          font-size: 0.875rem;
          color: #1e88e5;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .forgot-link:hover {
          color: #1976d2;
          text-decoration: underline;
        }

        /* Demo Info */
        .demo-info {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .login-container {
            margin: 1rem;
            padding: 1.5rem;
          }
          
          .logo-text {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}