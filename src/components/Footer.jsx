import React from 'react'
import { Plane, Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 pt-8 px-6 pb-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-stone-700" />
            <span className="font-semibold text-stone-900 tracking-tight">FlightSearch</span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900 transition-colors">About</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Terms</a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:contact@flightsearch.com"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} FlightSearch. Powered by Amadeus API.
          </p>
        </div>
      </div>
    </footer>
  )
}
