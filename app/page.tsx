"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Map as MapIcon, Coffee, Search, ShieldCheck, Navigation2, LogIn, LayoutDashboard, Store } from "lucide-react"
import MapComponent from "@/components/MapComponent"
import { getPublicApprovedCafes, getKeywordMappings } from "./dashboard/actions"

export default function LandingPage() {
  const { data: session } = useSession()
  const [dbCafes, setDbCafes] = useState<any[]>([])
  const [keywordMapping, setKeywordMapping] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPublicApprovedCafes(),
      getKeywordMappings()
    ]).then(([cafes, keywords]) => {
      setDbCafes(cafes)
      setKeywordMapping(keywords)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-white/70 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SIG Cafe Logo" className="w-12 h-12 object-contain drop-shadow-md transition-transform hover:scale-105" />
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase hidden sm:block">SIG Cafe</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#map" className="hover:text-blue-600 transition-colors">Eksplorasi Peta</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tentang SIG</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Bantuan</a>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Link 
                href={(session?.user as any)?.role === "owner_cafe" ? "/dashboard/owners" : "/dashboard"}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20"
              >
                <LogIn size={18} /> Masuk Akun
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 flex flex-col">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 text-center max-w-5xl mx-auto overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm text-blue-600 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-10 border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck size={16} /> Sistem Informasi Geografis Terverifikasi
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
            Temukan Titik <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Café Terbaik</span> di Sekitar Anda
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">
            SIG Cafe memudahkan Anda mencari lokasi nongkrong yang strategis dengan data geografis yang akurat, real-time, dan terverifikasi oleh tim kurator kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#map" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:-translate-y-1 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30">
              Mulai Eksplorasi <Navigation2 size={20} className="rotate-45" />
            </a>
            {!session && (
              <Link href="/register" className="bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-2xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm hover:shadow-md">
                <Store size={20} className="text-blue-600" /> Daftar Sebagai Owner
              </Link>
            )}
          </div>
          
          {/* Stats Badges */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl"><Coffee size={24} className="text-orange-600" /></div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900">{dbCafes.length}+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Terdaftar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl"><MapIcon size={24} className="text-blue-600" /></div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900">Akurat</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titik Pemetaan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="flex-1 min-h-[700px] p-4 md:p-8 bg-white">
          <div className="w-full h-full max-w-7xl mx-auto">
            {loading ? (
              <div className="w-full h-[600px] bg-slate-50 rounded-[3rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                <div className="animate-spin text-blue-600 mb-4">
                  <Coffee size={40} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan Peta SIG...</p>
              </div>
            ) : (
              <div className="w-full h-[750px] relative group overflow-hidden rounded-[3rem] shadow-2xl border border-slate-100">
                <MapComponent dbCafes={dbCafes} keywordMapping={keywordMapping} />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
            <img src="/logo.png" alt="SIG Cafe Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">SIG Cafe</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 SIG Cafe. Developed with Leaflet, OSM, and Foursquare.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm font-bold">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}