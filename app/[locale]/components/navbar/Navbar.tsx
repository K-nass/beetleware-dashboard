import { Globe, Bell, ChevronDown, User } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
            {/* Left: Logo */}
            <div className="w-64 flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Sayil</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-6">
                {/* Language Switcher */}
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>العربية</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        2
                    </span>
                </button>

                {/* User Profile */}
                <button className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Administrator</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </header>
    );
}