"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Languages,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const credentials = [
    {
      role: "Administrator",
      phone: "+966512345678",
      pass: "Admin@123456",
    },
    { role: "Agent", phone: "+966507654321", pass: "agent123" },
    {
      role: "Manager",
      phone: "+966509876543",
      pass: "manager123",
      note: "First time login",
    },
  ];

  const handleSelectCredentials = (user: { phone: string; pass: string }) => {
    setPhone(user.phone);
    setPassword(user.pass);
  };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        phoneNumber: phone,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid phone number or password");
      } else if (result?.ok) {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-12 lg:gap-24 overflow-y-auto">
      {/* Left Section: Branding and Sample Credentials */}
      <div className="w-full max-w-md flex flex-col gap-8 py-8 md:py-0">
        <div className="text-white space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80">Land Management Platform</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 opacity-70" />
            <h2 className="text-lg font-semibold">Sample Credentials</h2>
          </div>

          <div className="space-y-4">
            {credentials.map((user, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/15 transition-all group"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm md:text-base">{user.role}</p>
                  <p className="text-xs md:text-sm opacity-70">{user.phone}</p>
                  {user.note && (
                    <p className="text-[10px] text-yellow-400 font-medium px-1.5 py-0.5 bg-yellow-400/10 rounded w-fit mt-1">
                      {user.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleSelectCredentials(user)}
                  className="text-[10px] md:text-xs font-semibold px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 active:scale-95 transition-all whitespace-nowrap"
                >
                  Use these credentials
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative mb-8 md:mb-0">
        <div className="absolute top-6 right-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors cursor-pointer group">
            <Languages className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              Login to Your Account
            </h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number (e.g., +966501234567)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 placeholder:text-sm text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Lock className="w-4 h-4 text-gray-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-900 pr-12 placeholder:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-4 bg-primary font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
