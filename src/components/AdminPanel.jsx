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
    Plus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('contacts')
    const [contacts, setContacts] = useState([])
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [authModal, setAuthModal] = useState(true)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // New Image State
    const [newImage, setNewImage] = useState({ title: '', category: 'Precision Fade', file: null })
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (!authModal) {
            fetchData()
        }
    }, [authModal])

    const fetchData = async () => {
        setLoading(true)
        const [contactsRes, galleryRes] = await Promise.all([
            supabase.from('contacts').select('*').order('created_at', { ascending: false }),
            supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
        ])

        if (contactsRes.data) setContacts(contactsRes.data)
        if (galleryRes.data) setGallery(galleryRes.data)
        setLoading(false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        // Simple demo password - in production use Supabase Auth
        if (password === 'barber1927') {
            setAuthModal(false)
            setError('')
        } else {
            setError('Incorrect credentials.')
        }
    }

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!newImage.file) return

        setUploading(true)
        try {
            const file = newImage.file
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `uploads/${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath)

            // 3. Save to Table
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert([{
                    title: newImage.title || 'Barber Work',
                    category: newImage.category,
                    storage_path: filePath,
                    image_url: publicUrl
                }])

            if (dbError) throw dbError

            // Reset & Refresh
            setNewImage({ title: '', category: 'Precision Fade', file: null })
            if (fileInputRef.current) fileInputRef.current.value = ''
            fetchData()
            alert('Image uploaded successfully!')
        } catch (err) {
            console.error(err)
            alert('Upload failed: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const deleteImage = async (img) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            // Delete from storage
            await supabase.storage.from('gallery').remove([img.storage_path])
            // Delete from table
            await supabase.from('gallery_images').delete().eq('id', img.id)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const deleteContact = async (id) => {
        if (!confirm('Delete this message?')) return
        await supabase.from('contacts').delete().eq('id', id)
        fetchData()
    }

    if (authModal) {
        return (
            <div className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-2xl"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Settings className="text-gold" size={32} />
                        </div>
                        <h2 className="font-playfair text-3xl text-warm-white font-bold">Admin Portal</h2>
                        <p className="text-warm-gray text-xs uppercase tracking-widest mt-2">Authentication Required</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-warm-gray">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 text-warm-white focus:outline-none focus:border-gold transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-500 text-[10px] uppercase tracking-wider">{error}</p>}
                        <button className="w-full py-4 bg-gold text-obsidian font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest text-xs">
                            Enter Dashboard
                        </button>
                    </form>
                    <p className="text-center mt-8 text-[10px] text-warm-gray tracking-tighter italic">
                        Tip: User the project secret key to gain access.
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-obsidian text-warm-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex flex-col mb-12">
                        <span className="font-playfair text-xl font-bold tracking-widest">BARBER 1927</span>
                        <span className="text-[8px] text-gold tracking-[0.5em] uppercase">Control Center</span>
                    </div>

                    <nav className="space-y-2">
                        <TabButton
                            active={activeTab === 'contacts'}
                            onClick={() => setActiveTab('contacts')}
                            icon={<MessageSquare size={18} />}
                            label="Messages"
                            count={contacts.length}
                        />
                        <TabButton
                            active={activeTab === 'gallery'}
                            onClick={() => setActiveTab('gallery')}
                            icon={<ImageIcon size={18} />}
                            label="Gallery"
                            count={gallery.length}
                        />
                        <TabButton
                            active={activeTab === 'stats'}
                            onClick={() => setActiveTab('stats')}
                            icon={<BarChart3 size={18} />}
                            label="Analytics"
                        />
                    </nav>
                </div>

                <button
                    onClick={() => setAuthModal(true)}
                    className="flex items-center gap-3 text-warm-gray hover:text-red-500 transition-colors text-xs uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto max-h-screen">
                <header className="flex items-center justify-between mb-12">
                    <h1 className="font-playfair text-4xl font-bold capitalize">{activeTab} Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Supabase Connected
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'contacts' && (
                        <motion.div
                            key="contacts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid gap-6">
                                {loading ? <Loader /> : contacts.length === 0 ? <EmptyState label="No messages yet" /> : (
                                    contacts.map(msg => (
                                        <div key={msg.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl group hover:border-gold/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">{msg.name}</h3>
                                                    <p className="text-warm-gray text-xs">{msg.email} • {new Date(msg.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteContact(msg.id)}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="inline-block px-3 py-1 bg-gold/10 text-gold text-[10px] uppercase tracking-widest rounded-md mb-3">
                                                {msg.service}
                                            </div>
                                            <p className="text-warm-white/80 font-inter text-sm leading-relaxed italic">"{msg.message}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            {/* Upload Tool */}
                            <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                <h2 className="font-playfair text-xl mb-6 flex items-center gap-2">
                                    <Plus className="text-gold" size={20} />
                                    Add New Photo
                                </h2>
                                <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-[10px] uppercase text-warm-gray">Caption</label>
                                        <input
                                            value={newImage.title}
                                            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                            className="bg-obsidian border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                                            placeholder="e.g. Sharp Skin Fade"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-[10px] uppercase text-warm-gray">Category</label>
                                        <select
                                            value={newImage.category}
                                            onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                            className="bg-obsidian border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                                        >
                                            <option>Precision Fade</option>
                                            <option>Luxury Shave</option>
                                            <option>Interior</option>
                                            <option>Tools</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-[10px] uppercase text-warm-gray">File</label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={(e) => setNewImage({ ...newImage, file: e.target.files[0] })}
                                            className="text-xs text-warm-gray"
                                        />
                                    </div>
                                    <button
                                        disabled={uploading}
                                        className="md:col-span-3 py-4 bg-gold text-obsidian font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                                    >
                                        {uploading ? <Loader small /> : <Upload size={18} />}
                                        {uploading ? 'UPLOADING...' : 'UPLOAD TO GALLERY'}
                                    </button>
                                </form>
                            </section>

                            {/* Image Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {loading ? <Loader /> : gallery.map(img => (
                                    <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
                                        <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => deleteImage(img)}
                                                className="bg-red-500 p-3 rounded-full hover:scale-110 transition-transform"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[8px] uppercase tracking-widest">
                                            {img.category}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="h-[400px] flex items-center justify-center border border-white/5 rounded-3xl bg-white/5 border-dashed">
                            <p className="text-warm-gray italic">Traffic analysis coming soon...</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

function TabButton({ active, onClick, icon, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${active ? 'bg-gold text-obsidian font-bold' : 'text-warm-gray hover:bg-white/5 hover:text-warm-white'
                }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-xs uppercase tracking-widest">{label}</span>
            </div>
            {count !== undefined && (
                <span className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${active ? 'bg-obsidian/20' : 'bg-white/10'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    )
}

function Loader({ small }) {
    return (
        <div className={`flex items-center justify-center ${small ? '' : 'p-20'}`}>
            <div className={`${small ? 'w-5 h-5' : 'w-10 h-10'} border-2 border-gold/30 border-t-gold rounded-full animate-spin`} />
        </div>
    )
}

function EmptyState({ label }) {
    return (
        <div className="text-center p-20 border border-white/5 border-dashed rounded-3xl">
            <p className="text-warm-gray italic text-sm">{label}</p>
        </div>
    )
}
