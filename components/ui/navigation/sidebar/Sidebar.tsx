"use client"
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LayoutDashboard, FileText, Users, Shield, Settings, Menu, X } from 'lucide-react';

export default function Sidebar() {
    const t = useTranslations('sidebar');
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Listings', icon: FileText, href: '/dashboard/listings' },
        { name: 'Users', icon: Users, href: '/dashboard/users' },
        { name: 'Roles & Permissions', icon: Shield, href: '/dashboard/roles' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    const navLinks = (
        <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
                const isActive = item.href === '/dashboard'
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className="w-5 h-5 mr-3 shrink-0" />
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );

    const footer = (
        <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">© 2025 Sayil Platform</p>
        </div>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-60 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle sidebar"
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/30"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 pt-16 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50
                transition-transform duration-200
                ${open ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {navLinks}
                {footer}
            </aside>
        </>
    );
}
