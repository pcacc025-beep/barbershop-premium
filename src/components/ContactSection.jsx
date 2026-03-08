import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Send, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactSection() {
    const sectionRef = useRef(null)
    const formRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: 'General Inquiry',
        message: ''
    })

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from('.contact-header', {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: '.contact-header',
                    start: 'top 85%'
                }
            })

            // Form Elements Stagger
            gsap.from('.form-el', {
                opacity: 0,
                x: -30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 80%'
                }
            })

            // Info Cards Stagger
            gsap.from('.info-card', {
                opacity: 0,
                x: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-info',
                    start: 'top 80%'
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: sbError } = await supabase
                .from('contacts')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        service: formData.service,
                        message: formData.message
                    }
                ])

            if (sbError) throw sbError

            setSubmitted(true)
            setFormData({ name: '', email: '', service: 'General Inquiry', message: '' })
        } catch (err) {
            console.error('Error submitting to Supabase:', err)
            setError('Something went wrong. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative py-24 px-6 bg-obsidian border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left: Contact Info */}
                <div className="contact-info space-y-12">
                    <div className="contact-header">
                        <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase inline-block mb-4">Get In Touch</span>
                        <h2 className="font-playfair text-5xl md:text-7xl font-bold text-warm-white leading-tight">
                            Ready for the <span className="gold-text italic">Refinement?</span>
                        </h2>
                        <p className="mt-8 font-inter text-warm-gray text-lg max-w-md leading-relaxed">
                            Experience the pinnacle of grooming. Book your session or send us an inquiry for private events.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <InfoCard
                            icon={<MapPin className="text-gold" />}
                            title="Locate Us"
                            desc="127 Heritage Blvd, Mayfair, London"
                        />
                        <InfoCard
                            icon={<Phone className="text-gold" />}
                            title="Call Directly"
                            desc="+44 20 7946 0000"
                        />
                        <InfoCard
                            icon={<Mail className="text-gold" />}
                            title="Email Us"
                            desc="concierge@barber1927.com"
                        />
                    </div>
                </div>

                {/* Right: Submission Form */}
                <div className="relative">
                    {/* Decorative gold gradient blob */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="relative bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-xl space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-el flex flex-col space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-warm-gray">Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 font-inter text-sm focus:outline-none focus:border-gold transition-colors text-warm-white"
                                />
                            </div>
                            <div className="form-el flex flex-col space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-warm-gray">Email</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 font-inter text-sm focus:outline-none focus:border-gold transition-colors text-warm-white"
                                />
                            </div>
                        </div>

                        <div className="form-el flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-warm-gray">Service Preferred</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-lg p-4 font-inter text-sm focus:outline-none focus:border-gold transition-colors text-warm-white appearance-none"
                            >
                                <option value="The Executive Fade">The Executive Fade</option>
                                <option value="Luxury Hot Shave">Luxury Hot Shave</option>
                                <option value="Beard Sculpting">Beard Sculpting</option>
                                <option value="General Inquiry">General Inquiry</option>
                            </select>
                        </div>

                        <div className="form-el flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-warm-gray">Your Message</label>
                            <textarea
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="How can we help you?"
                                className="bg-white/5 border border-white/10 rounded-lg p-4 font-inter text-sm focus:outline-none focus:border-gold transition-colors text-warm-white resize-none"
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="form-el w-full py-5 bg-gold text-obsidian font-bold tracking-widest uppercase text-xs rounded-lg hover:bg-white transition-all duration-500 overflow-hidden flex items-center justify-center gap-3 relative group"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian animate-spin rounded-full" />
                            ) : submitted ? (
                                <>
                                    <CheckCircle size={18} />
                                    <span>Sent Successfully</span>
                                </>
                            ) : (
                                <>
                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    <span>Send Message</span>
                                </>
                            )}
                        </button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-500 text-xs mt-4"
                            >
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {submitted && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gold text-xs italic mt-4"
                            >
                                We&apos;ll get back to you within 24 hours.
                            </motion.p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}

function InfoCard({ icon, title, desc }) {
    return (
        <div className="info-card flex items-center gap-5 group">
            <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                {icon}
            </div>
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">{title}</h4>
                <p className="text-warm-white font-inter text-sm">{desc}</p>
            </div>
        </div>
    )
}
