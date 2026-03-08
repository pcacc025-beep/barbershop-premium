import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
    const heroRef = useRef(null)
    const titleRef = useRef(null)
    const subRef = useRef(null)
    const ctaRef = useRef(null)
    const lineRef = useRef(null)
    const scrollIndRef = useRef(null)
    const bgRef = useRef(null)
    const overlayRef = useRef(null)

    // Framer Motion scroll-linked opacity
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.92])
    const bgBlur = useTransform(scrollYProgress, [0, 0.5], [0, 10])

    useEffect(() => {
        // Master timeline for entrance — delayed by preloader
        const tl = gsap.timeline({ delay: 3 })

        // Background image zoom-in
        tl.fromTo(bgRef.current,
            { scale: 1.3, opacity: 0 },
            { scale: 1.1, opacity: 1, duration: 2, ease: 'power2.out' }
        )

        // Overlay fade
        tl.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            '-=1.5'
        )

        // Split title words — stagger appear
        if (titleRef.current) {
            const words = titleRef.current.querySelectorAll('.word')

            // Each word: clipPath reveal + y motion
            tl.fromTo(words,
                { opacity: 0, y: 80, rotateX: -45, scale: 0.95 },
                {
                    opacity: 1, y: 0, rotateX: 0, scale: 1,
                    duration: 1.2,
                    stagger: 0.18,
                    ease: 'power4.out',
                },
                '-=0.8'
            )
        }

        // Gold line expand
        tl.fromTo(lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: 'power3.inOut' },
            '-=0.6'
        )

        // Subtitle word-by-word
        if (subRef.current) {
            const subText = subRef.current.textContent
            subRef.current.innerHTML = ''
            subText.split(' ').forEach((w, i) => {
                const span = document.createElement('span')
                span.textContent = w + '\u00A0'
                span.style.display = 'inline-block'
                span.style.opacity = '0'
                span.style.transform = 'translateY(20px)'
                subRef.current.appendChild(span)
            })

            tl.to(subRef.current.querySelectorAll('span'), {
                opacity: 1,
                y: 0,
                stagger: 0.06,
                duration: 0.5,
                ease: 'power3.out',
            }, '-=0.4')
        }

        // CTA buttons entrance
        tl.fromTo(ctaRef.current?.children || [],
            { opacity: 0, y: 25, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: 'back.out(1.5)',
            },
            '-=0.3'
        )

        // Scroll indicator fade-in with bounce
        tl.fromTo(scrollIndRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            '-=0.2'
        )

        // Scroll indicator continuous bounce
        gsap.to(scrollIndRef.current?.querySelector('.scroll-line'), {
            scaleY: 1.5,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
        })

        // ── Scroll-linked parallax layers ──
        gsap.to(bgRef.current, {
            yPercent: 40,
            scale: 1.25,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            },
        })

        gsap.to(titleRef.current, {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        })

        gsap.to(ctaRef.current, {
            yPercent: 50,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: '60% top',
                scrub: 1,
            },
        })
    }, [])

    return (
        <motion.section
            id="hero"
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian"
            style={{ opacity: heroOpacity, scale: heroScale }}
        >
            {/* Background Image with Cinematic Overlay */}
            <div ref={bgRef} className="absolute inset-0 scale-130" style={{ opacity: 0 }}>
                <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1800&q=85&auto=format&fit=crop"
                    alt="Luxury Barbershop Interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/50 to-obsidian" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/50 via-transparent to-obsidian/30" />
            </div>

            {/* Vignette overlay */}
            <div ref={overlayRef} className="absolute inset-0 z-15 pointer-events-none" style={{ opacity: 0, boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)' }} />

            {/* Content */}
            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
                {/* Eyebrow */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div ref={lineRef} className="w-16 h-px bg-gold origin-left" style={{ scaleX: 0 }} />
                    <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Est. 1927 · Heritage Luxury</span>
                    <div className="w-16 h-px bg-gold origin-right" style={{ scaleX: 0 }} />
                </div>

                {/* Main Title */}
                <h1
                    ref={titleRef}
                    className="font-playfair font-black leading-none mb-6"
                    style={{ perspective: '1200px' }}
                >
                    {['The', 'Art', 'of', 'Precision'].map((word, i) => (
                        <span key={i} className="word inline-block mr-4 md:mr-6 last:mr-0" style={{ opacity: 0, transformStyle: 'preserve-3d' }}>
                            <span className={`block text-6xl md:text-8xl lg:text-[11rem] ${i === 1 || i === 3 ? 'gold-text' : 'text-warm-white'}`}>
                                {word}
                            </span>
                        </span>
                    ))}
                </h1>

                {/* Subtitle — word by word reveal */}
                <p
                    ref={subRef}
                    className="font-cormorant font-300 italic text-xl md:text-2xl text-warm-gray max-w-xl mx-auto mb-10"
                >
                    Where heritage meets obsession — every cut a masterpiece, every visit a ritual.
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                        href="tel:+1234567890"
                        className="magnetic-btn group px-10 py-5 bg-gold text-obsidian font-inter font-600 text-sm tracking-[0.25em] uppercase relative overflow-hidden"
                        data-cursor-hover
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,168,76,0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Now
                        </span>
                        <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                    </motion.a>

                    <motion.a
                        href="#services"
                        className="px-10 py-5 border border-warm-white/30 text-warm-white font-inter text-sm tracking-[0.2em] uppercase relative overflow-hidden group"
                        data-cursor-hover
                        whileHover={{ scale: 1.03, borderColor: 'rgba(201,168,76,0.6)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                            e.preventDefault()
                            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        <span className="relative z-10 group-hover:text-gold transition-colors duration-300">
                            Our Services
                        </span>
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </motion.a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                ref={scrollIndRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
                style={{ opacity: 0 }}
            >
                <span className="font-inter text-[9px] tracking-[0.4em] text-warm-gray uppercase">Scroll</span>
                <div className="scroll-line w-px h-12 bg-gradient-to-b from-gold/60 to-transparent origin-top" />
            </div>

            {/* Corner Decorations */}
            <motion.div
                className="absolute top-24 left-8 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4, duration: 0.6 }}
            >
                <div className="w-20 h-20 border-l border-t border-gold/30" />
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-8 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.2, duration: 0.6 }}
            >
                <div className="w-20 h-20 border-r border-b border-gold/30" />
            </motion.div>
        </motion.section>
    )
}
