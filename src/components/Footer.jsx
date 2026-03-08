import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
    const footerRef = useRef(null)

    useEffect(() => {
        const els = footerRef.current?.querySelectorAll('.footer-reveal')
        if (els) {
            gsap.fromTo(els,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: footerRef.current, start: 'top 85%' }
                }
            )
        }
    }, [])

    const handleLinkClick = (e, id) => {
        e.preventDefault()
        const el = document.getElementById(id)
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    return (
        <footer ref={footerRef} className="relative bg-obsidian border-t border-gold/15 py-20 px-6 overflow-hidden">
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="font-playfair font-black text-[18vw] text-white/[0.015] select-none">1927</span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-2 footer-reveal" style={{ opacity: 0 }}>
                        <div className="mb-6">
                            <div className="font-playfair font-black text-3xl tracking-[0.1em] text-warm-white">BARBER</div>
                            <div className="font-cormorant text-sm tracking-[0.5em] shimmer-text">1 9 2 7</div>
                        </div>
                        <p className="font-inter text-warm-gray text-sm leading-relaxed max-w-xs">
                            Heritage luxury grooming for the modern gentleman. Where every visit is a ritual, and every cut is a statement.
                        </p>
                        <div className="mt-6 flex gap-4">
                            {['IG', 'FB', 'TW'].map(s => (
                                <a key={s} href="#" className="w-9 h-9 border border-gold/30 flex items-center justify-center text-warm-gray hover:border-gold hover:text-gold font-inter text-[10px] tracking-wider transition-all duration-300" data-cursor-hover>
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="footer-reveal" style={{ opacity: 0 }}>
                        <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold uppercase mb-6">Navigate</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Services', id: 'services' },
                                { label: 'Gallery', id: 'gallery' },
                                { label: 'About', id: 'about' },
                                { label: 'Testimonials', id: 'testimonials' },
                            ].map(link => (
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        onClick={(e) => handleLinkClick(e, link.id)}
                                        className="font-inter text-sm text-warm-gray hover:text-gold transition-colors duration-300"
                                        data-cursor-hover
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-reveal" style={{ opacity: 0 }}>
                        <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold uppercase mb-6">Visit Us</h4>
                        <ul className="space-y-4">
                            <li>
                                <div className="font-inter text-[10px] tracking-wider text-warm-gray uppercase mb-1">Address</div>
                                <div className="font-inter text-sm text-warm-white">127 Heritage Lane<br />New York, NY 10001</div>
                            </li>
                            <li>
                                <div className="font-inter text-[10px] tracking-wider text-warm-gray uppercase mb-1">Phone</div>
                                <a href="tel:+1234567890" className="font-inter text-sm text-gold hover:text-gold-light transition-colors" data-cursor-hover>
                                    (123) 456-7890
                                </a>
                            </li>
                            <li>
                                <div className="font-inter text-[10px] tracking-wider text-warm-gray uppercase mb-1">Hours</div>
                                <div className="font-inter text-sm text-warm-white">Mon–Sat: 9am–8pm<br />Sunday: 10am–6pm</div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-reveal border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ opacity: 0 }}>
                    <div className="gold-divider hidden md:block flex-1 mr-8" />
                    <p className="font-inter text-xs text-warm-gray tracking-wider text-center">
                        © 2024 BARBER 1927. Est. New York, 1927. All rights reserved.
                    </p>
                    <div className="gold-divider hidden md:block flex-1 ml-8" />
                </div>
            </div>
        </footer>
    )
}
