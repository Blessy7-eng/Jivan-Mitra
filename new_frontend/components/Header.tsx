'use client';

import { Globe, Bell, User, Activity } from 'lucide-react'; // Added Activity icon
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Greeting */}
          <div className="flex items-center gap-4">
            {/* UPDATED: Added the Activity icon and the animate-up-down class */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-200 animate-up-down">
              <Activity className="w-6 h-6" strokeWidth={2.5} />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-slate-900 leading-none">Jivan-Mitra</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">
                Namaste, {userName}
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 font-bold">
                  <Globe className="w-4 h-4 text-blue-500" strokeWidth={2} />
                  <span className="hidden sm:inline text-xs">EN</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 font-bold">
                <DropdownMenuItem className="cursor-pointer">English</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">हिंदी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">मराठी (Marathi)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900 rounded-xl">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>

            {/* User Avatar */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title={`Logged in as ${userName}`}
            >
              <User className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}