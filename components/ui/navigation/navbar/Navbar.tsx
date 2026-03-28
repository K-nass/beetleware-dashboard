"use client";

import { Globe, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LocaleSwitcher from '../../../locale/LocaleSwitcher/LocaleSwitcher';

export default function Navbar() {
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string ?? 'en';

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/admin/account/logout', { method: 'POST' });
        } catch {
            // proceed with signOut regardless
        }
        await signOut({ callbackUrl: `/${locale}` });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
            <div className="w-64 shrink">
                <h1 className="text-2xl font-bold text-gray-900">Sayil</h1>
            </div>
            <div className="flex items-center space-x-6">
                <LocaleSwitcher />

                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        2
                    </span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown((v) => !v)}
                        className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                            {session?.user?.fullName || session?.user?.role || 'User'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                            <Link
                                href={`/${locale}/dashboard/profile`}
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                            <div className="border-t border-gray-100" />
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {loggingOut ? 'Logging out...' : 'Logout'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
