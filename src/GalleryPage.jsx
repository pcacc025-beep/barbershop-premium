import { useEffect, useState, useRef } from 'react'
import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

export default function GalleryPage() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
        if (data) setImages(data)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-obsidian text-warm-white">
            <Navbar />

            <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-px bg-gold" />
                    <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Full Portfolio</span>
                </div>
                <h1 className="font-playfair text-6xl md:text-8xl font-bold">The <span className="gold-text italic">Collection.</span></h1>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(n => <div key={n} className="aspect-square bg-white/5 animate-pulse rounded-2xl" />)
                    ) : images.map((img, i) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
                        >
                            <img
                                src={img.image_url}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={img.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-gold text-[10px] uppercase tracking-widest mb-2">{img.category}</p>
                                <h3 className="text-xl font-bold">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
