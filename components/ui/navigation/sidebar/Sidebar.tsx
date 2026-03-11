"use client"
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LayoutDashboard, FileText, Users, Shield, Settings } from 'lucide-react';

export default function Sidebar() {
    const t = useTranslations('sidebar');
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Listings', icon: FileText, href: '/dashboard/listings' },
        { name: 'Users', icon: Users, href: '/dashboard/users' },
        { name: 'Roles & Permissions', icon: Shield, href: '/dashboard/roles' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 pt-16">
            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">© 2025 Sayil Platform</p>
            </div>
        </aside>
    );
}