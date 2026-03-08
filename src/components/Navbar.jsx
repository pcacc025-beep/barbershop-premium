import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
    const navRef = useRef(null)
    const logoRef = useRef(null)
    const linksRef = useRef([])
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = ['Services', 'About', 'Testimonials', 'Contact']

    useEffect(() => {
        // Entrance animation
        gsap.fromTo(
            [logoRef.current, ...linksRef.current],
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
        )

        // Scroll detection
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNavClick = (e, id) => {
        e.preventDefault()
        if (location.pathname !== '/') {
            navigate('/#' + id.toLowerCase())
            // Brief timeout to allow navigation before scroll
            setTimeout(() => {
                const el = document.getElementById(id.toLowerCase())
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            const el = document.getElementById(id.toLowerCase())
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: 'smooth' })
            }
        }
        setMenuOpen(false)
    }

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-obsidian/95 backdrop-blur-md border-b border-gold/20 py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex flex-col leading-none" data-cursor-hover>
                        <span className="font-playfair font-900 text-2xl tracking-[0.15em] text-warm-white">
                            BARBER
                        </span>
                        <span className="font-cormorant text-xs tracking-[0.5em] shimmer-text font-300">
                            1 9 2 7
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            to="/gallery"
                            className="font-inter text-xs tracking-[0.25em] uppercase text-warm-gray hover:text-gold transition-colors duration-300 relative group"
                            data-cursor-hover
                        >
                            Portfolio
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                        </Link>
                        {navLinks.map((link, i) => (
                            <a
                                key={link}
                                ref={el => linksRef.current[i] = el}
                                href={`#${link.toLowerCase()}`}
                                onClick={(e) => handleNavClick(e, link)}
                                className="font-inter text-xs tracking-[0.25em] uppercase text-warm-gray hover:text-gold transition-colors duration-300 relative group"
                                data-cursor-hover
                            >
                                {link}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href="tel:+1234567890"
                            className="magnetic-btn px-6 py-2.5 border border-gold/60 text-gold font-inter text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
                            data-cursor-hover
                        >
                            Call Now
                        </a>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        data-cursor-hover
                    >
                        <span className={`block w-6 h-px bg-warm-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-px bg-warm-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-px bg-warm-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-xl flex flex-col items-center justify-center gap-10 transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="font-playfair text-4xl text-warm-white hover:text-gold transition-colors duration-300 tracking-widest"
                >
                    Home
                </Link>
                <Link
                    to="/gallery"
                    onClick={() => setMenuOpen(false)}
                    className="font-playfair text-4xl text-warm-white hover:text-gold transition-colors duration-300 tracking-widest"
                >
                    Portfolio
                </Link>
                {navLinks.map((link) => (
                    <a
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        onClick={(e) => handleNavClick(e, link)}
                        className="font-playfair text-4xl text-warm-white hover:text-gold transition-colors duration-300 tracking-widest"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </>
    )
}
