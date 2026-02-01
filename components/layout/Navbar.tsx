"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Terminal className="w-6 h-6 text-cyan-400 group-hover:text-purple-400 transition-colors" />
                    <span className="text-xl font-bold font-mono tracking-wider text-slate-100">
                        SENTINEL
                    </span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">
                        DASHBOARD
                    </Link>
                    <Link href="/leaderboard" className="text-sm font-mono text-slate-400 hover:text-purple-400 transition-colors">
                        LEADERBOARD
                    </Link>
                    <Link href="/about" className="text-sm font-mono text-slate-400 hover:text-slate-200 transition-colors">
                        ABOUT
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center">
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border-2 border-cyan-500/50 hover:border-cyan-500 transition-colors",
                                    userButtonPopoverCard: "bg-slate-900 border border-slate-800",
                                    userButtonPopoverActionButton: "hover:bg-slate-800",
                                    userButtonPopoverActionButtonText: "text-slate-300",
                                    userButtonPopoverFooter: "hidden"
                                }
                            }}
                        />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-sm border border-slate-700 rounded transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                LOGIN_TERMINAL
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
}
