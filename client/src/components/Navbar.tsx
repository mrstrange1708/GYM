'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/workout', label: 'Workout', icon: '💪' },
        { href: '/calendar', label: 'Calendar', icon: '📅' },
        { href: '/tracker', label: 'Tracker', icon: '📊' },
        { href: '/diet', label: 'Diet', icon: '🥗' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - hidden on mobile */}
                    <Link href="/workout" className="hidden md:flex items-center gap-2">
                        <span className="text-2xl">🏋️</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            GYM TRACKER
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center justify-around w-full md:w-auto md:gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-xl transition-all ${pathname === link.href
                                    ? 'bg-emerald-600/30 text-emerald-400'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-xl md:text-base">{link.icon}</span>
                                <span className="text-xs md:text-sm font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Logout - hidden on mobile */}
                    <button
                        onClick={() => {
                            localStorage.removeItem('gym-auth');
                            window.location.href = '/';
                        }}
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <span>🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
