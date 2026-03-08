import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
    BarChart3,
    Image as ImageIcon,
    MessageSquare,
    Settings,
    Upload,
    Trash2,
    LogOut,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    Camera
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('contacts')
    const [contacts, setContacts] = useState([])
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Upload State
    const [newImage, setNewImage] = useState({ title: '', category: 'Masterpiece', file: null })
    const [previewUrl, setPreviewUrl] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (authenticated) {
            fetchData()
        }
    }, [authenticated])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [contactsRes, galleryRes] = await Promise.all([
                supabase.from('contacts').select('*').order('created_at', { ascending: false }),
                supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
            ])

            if (contactsRes.data) setContacts(contactsRes.data)
            if (galleryRes.data) setGallery(galleryRes.data)
        } catch (err) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === 'admin1927') {
            setAuthenticated(true)
            setError('')
        } else {
            setError('ACCESS DENIED: INVALID KEY')
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewImage({ ...newImage, file })
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!newImage.file) return

        setUploading(true)
        try {
            const file = newImage.file
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `portfolio/${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath)

            // 3. Save to Database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert([{
                    title: newImage.title || 'Barber Portfolio Work',
                    category: newImage.category,
                    storage_path: filePath,
                    image_url: publicUrl
                }])

            if (dbError) throw dbError

            // UI Refresh
            setNewImage({ title: '', category: 'Masterpiece', file: null })
            setPreviewUrl(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            fetchData()
            alert('PORTFOLIO UPDATED SUCCESSFULLY')
        } catch (err) {
            console.error(err)
            alert('UPLOAD FAILED: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const deleteImage = async (img) => {
        if (!confirm('Permanently remove this work from your portfolio?')) return

        try {
            await supabase.storage.from('gallery').remove([img.storage_path])
            await supabase.from('gallery_images').delete().eq('id', img.id)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const deleteContact = async (id) => {
        if (!confirm('Archive this message?')) return
        await supabase.from('contacts').delete().eq('id', id)
        fetchData()
    }

    if (!authenticated) {
        return (
            <div className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-zinc-900 border border-gold/20 p-12 rounded-[2rem] shadow-2xl backdrop-blur-xl"
                >
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gold/10">
                            <Settings className="text-gold animate-spin-slow" size={40} />
                        </div>
                        <h2 className="font-playfair text-4xl text-warm-white font-bold tracking-tight">VANGUARD</h2>
                        <p className="text-gold text-[10px] uppercase tracking-[0.5em] mt-3 opacity-60">Admin Lockdown</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-warm-white focus:outline-none focus:border-gold transition-all duration-300 text-center tracking-[1em]"
                                placeholder="••••"
                            />
                        </div>
                        {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}
                        <button className="w-full py-5 bg-gold text-obsidian font-black rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-xs shadow-lg shadow-gold/20">
                            Initialize Session
                        </button>
                    </form>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#080808] text-warm-white flex font-inter">
            {/* Sidebar */}
            <aside className="w-72 bg-black border-r border-white/5 p-10 flex flex-col justify-between sticky top-0 h-screen">
                <div>
                    <div className="flex flex-col mb-16 px-2">
                        <span className="font-playfair text-2xl font-black tracking-tighter">BARBER 1927</span>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-warm-gray tracking-[0.3em] uppercase">Operations Live</span>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        <SidebarLink
                            active={activeTab === 'contacts'}
                            onClick={() => setActiveTab('contacts')}
                            icon={<MessageSquare size={20} />}
                            label="Messages"
                            count={contacts.length}
                        />
                        <SidebarLink
                            active={activeTab === 'gallery'}
                            onClick={() => setActiveTab('gallery')}
                            icon={<ImageIcon size={20} />}
                            label="Creative Studio"
                            count={gallery.length}
                        />
                    </nav>
                </div>

                <button
                    onClick={() => setAuthenticated(false)}
                    className="flex items-center gap-4 text-warm-gray hover:text-gold transition-colors text-[10px] uppercase tracking-[0.4em] px-2 mb-4"
                >
                    <LogOut size={16} />
                    Terminate
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-16 max-w-6xl">
                <header className="flex items-end justify-between mb-20">
                    <div>
                        <p className="text-gold text-[10px] uppercase tracking-[0.5em] mb-4">Dashboard / {activeTab}</p>
                        <h1 className="font-playfair text-6xl font-bold capitalize tracking-tight">{activeTab === 'gallery' ? 'Creative Studio' : activeTab}</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest text-warm-gray">
                            Last Sync: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'contacts' && (
                        <motion.div
                            key="contacts"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid gap-6"
                        >
                            {loading ? <AdminLoader /> : contacts.length === 0 ? <EmptyState label="Inbox is currently empty" /> : (
                                contacts.map(msg => (
                                    <div key={msg.id} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl group hover:border-gold/20 transition-all duration-500 hover:bg-zinc-800/50 shadow-2xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-gold border border-white/5">
                                                    {msg.name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl tracking-tight">{msg.name}</h3>
                                                    <p className="text-warm-gray text-[10px] uppercase tracking-widest mt-1 opacity-60">{msg.email} • {new Date(msg.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteContact(msg.id)}
                                                className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/5 text-gold text-[9px] uppercase tracking-[0.2em] rounded-lg border border-gold/10 mb-6">
                                            <div className="w-1 h-1 bg-gold rounded-full" />
                                            {msg.service}
                                        </div>
                                        <p className="text-warm-white/90 text-sm leading-[1.8] font-inter border-l-2 border-gold/20 pl-6 italic">"{msg.message}"</p>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-16"
                        >
                            {/* Upload Zone */}
                            <section className="bg-zinc-900 border border-gold/10 p-12 rounded-[2.5rem] shadow-3xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 bg-gold/5 rounded-xl flex items-center justify-center border border-gold/10">
                                        <Plus className="text-gold" size={20} />
                                    </div>
                                    <h2 className="font-playfair text-2xl font-bold">New Portfolio Entry</h2>
                                </div>

                                <form onSubmit={handleFileUpload} className="space-y-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <div className="flex flex-col space-y-3">
                                                <label className="text-[10px] uppercase tracking-[0.3em] text-warm-gray font-bold">Piece Title</label>
                                                <input
                                                    value={newImage.title}
                                                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                                    className="bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:border-gold/50 outline-none transition-all placeholder:text-white/10"
                                                    placeholder="e.g. Sharp Taper Fade"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label className="text-[10px] uppercase tracking-[0.3em] text-warm-gray font-bold">Style Category</label>
                                                <select
                                                    value={newImage.category}
                                                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                                    className="bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:border-gold/50 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option>Masterpiece</option>
                                                    <option>Classic Cut</option>
                                                    <option>Modern Fade</option>
                                                    <option>Grooming</option>
                                                    <option>Studio</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="portfolio-upload"
                                                accept="image/*"
                                            />
                                            <label
                                                htmlFor="portfolio-upload"
                                                className="block aspect-video bg-black/40 border-2 border-dashed border-white/5 rounded-3xl cursor-pointer hover:border-gold/40 transition-all overflow-hidden relative"
                                            >
                                                {previewUrl ? (
                                                    <img src={previewUrl} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-warm-gray group-hover:text-gold transition-colors">
                                                        <Camera size={32} />
                                                        <span className="text-[10px] uppercase tracking-widest">Select Image</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        disabled={uploading || !newImage.file}
                                        className="w-full py-6 bg-gold text-obsidian font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all transform active:scale-95 disabled:opacity-20 disabled:grayscale uppercase tracking-[0.3em] text-xs shadow-xl shadow-gold/10"
                                    >
                                        {uploading ? <AdminLoader small /> : <Upload size={18} />}
                                        {uploading ? 'PROCESSING...' : 'COMMIT TO PORTFOLIO'}
                                    </button>
                                </form>
                            </section>

                            {/* Portfolio Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {loading ? <AdminLoader /> : gallery.map(img => (
                                    <motion.div
                                        layout
                                        key={img.id}
                                        className="relative group rounded-3xl overflow-hidden aspect-[4/5] border border-white/5 bg-zinc-900"
                                    >
                                        <img src={img.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                                            <p className="text-gold text-[8px] uppercase tracking-[0.4em] mb-2">{img.category}</p>
                                            <h4 className="font-bold text-sm tracking-tight mb-6">{img.title}</h4>
                                            <button
                                                onClick={() => deleteImage(img)}
                                                className="bg-red-500/20 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

function SidebarLink({ active, onClick, icon, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 ${active
                    ? 'bg-gold text-obsidian font-bold shadow-lg shadow-gold/20'
                    : 'text-warm-gray hover:bg-white/5 hover:text-warm-white'
                }`}
        >
            <div className="flex items-center gap-4">
                <span className={active ? 'text-obsidian' : 'text-gold/60'}>{icon}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black">{label}</span>
            </div>
            {count !== undefined && (
                <span className={`text-[9px] w-6 h-6 flex items-center justify-center rounded-lg font-bold ${active ? 'bg-obsidian/10 border border-obsidian/20' : 'bg-white/5 border border-white/5'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    )
}

function AdminLoader({ small }) {
    return (
        <div className={`flex items-center justify-center ${small ? '' : 'py-32'}`}>
            <div className={`${small ? 'w-5 h-5 border-2' : 'w-12 h-12 border-4'} border-gold/20 border-t-gold rounded-full animate-spin`} />
        </div>
    )
}

function EmptyState({ label }) {
    return (
        <div className="text-center py-40 bg-zinc-900/50 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-warm-gray text-[10px] uppercase tracking-[0.5em] italic">{label}</p>
        </div>
    )
}
