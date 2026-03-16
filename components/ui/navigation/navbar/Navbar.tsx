"use client";

import { Globe, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import LocaleSwitcher from '../../../locale/LocaleSwitcher/LocaleSwitcher';

export default function Navbar() {
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);

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
                
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {session?.user?.fullName || session?.user?.role || 'User'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}