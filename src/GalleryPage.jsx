import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Camera, ChevronRight, LayoutGrid, Image as ImageIcon } from 'lucide-react'

export default function GalleryPage() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        const { data } = await supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setImages(data)
        }
        setLoading(false)
    }

    const categories = ['All', ...new Set(images.map(img => img.category))]

    const filteredImages = filter === 'All'
        ? images
        : images.filter(img => img.category === filter)

    return (
        <div className="min-h-screen bg-obsidian text-warm-white selection:bg-gold selection:text-obsidian">
            <Navbar />

            {/* Ambient background effect */}
            <div className="fixed inset-0 pointer-events-none opacity-20 transition-opacity duration-1000">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-warm-white/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <header className="relative pt-52 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px bg-gold" />
                        <span className="font-inter text-[10px] tracking-[0.6em] text-gold uppercase font-black">Visual Symphony</span>
                    </div>
                    <h1 className="font-playfair text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter mb-12">
                        The <br />
                        <span className="gold-text italic pr-4">Portfolio.</span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 mt-16 border-t border-white/5 pt-12">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${filter === cat
                                        ? 'bg-gold border-gold text-obsidian font-black'
                                        : 'border-white/10 text-warm-gray hover:border-gold/50 hover:text-warm-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-60 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="aspect-[4/5] bg-white/5 rounded-[2rem] border border-white/5 animate-shimmer" />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="py-40 text-center border border-dashed border-white/10 rounded-[3rem]">
                        <ImageIcon className="mx-auto text-gold/30 mb-6" size={48} />
                        <p className="text-warm-gray font-playfair text-2xl italic">The collection is currently in curation.</p>
                        <p className="text-[10px] uppercase tracking-[0.4em] mt-4 opacity-40">Updates Incoming</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredImages.map((img, i) => (
                                <motion.div
                                    layout
                                    key={img.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                                    className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900"
                                >
                                    <img
                                        src={img.image_url}
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-[0.22, 1, 0.36, 1] group-hover:scale-110"
                                        alt={img.title}
                                    />

                                    {/* Glass Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 p-8 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.22, 1, 0.36, 1]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                                            <p className="text-gold text-[9px] uppercase tracking-[0.3em] font-black">{img.category}</p>
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mb-4 line-clamp-1">{img.title}</h3>
                                        <div className="w-8 h-px bg-white/20" />
                                    </div>

                                    {/* Corner Lens Effect */}
                                    <div className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                                        <div className="absolute inset-0 border border-gold/30 rounded-full animate-spin-slow" />
                                        <Camera className="text-gold" size={16} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    )
}
