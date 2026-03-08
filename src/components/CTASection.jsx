import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
    const sectionRef = useRef(null)
    const headRef = useRef(null)
    const btnRef = useRef(null)
    const bgTextRef = useRef(null)

    // Magnetic button
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const springX = useSpring(mx, { stiffness: 200, damping: 12 })
    const springY = useSpring(my, { stiffness: 200, damping: 12 })

    const handleBtnMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - rect.left - rect.width / 2) * 0.25)
        my.set((e.clientY - rect.top - rect.height / 2) * 0.25)
    }

    const handleBtnLeave = () => {
        mx.set(0)
        my.set(0)
    }

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        // Background text scroll parallax
        gsap.to(bgTextRef.current, {
            xPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
            },
        })

        // Heading entrance — letter by letter
        const h2 = headRef.current?.querySelector('h2')
        if (h2) {
            gsap.to(h2.querySelectorAll('.cw'), {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.07,
                duration: 0.9,
                ease: 'power4.out',
                scrollTrigger: { trigger: section, start: 'top 60%' }
            })
        }

        // Subtitle slide-up
        const sub = headRef.current?.querySelector('p')
        if (sub) {
            gsap.fromTo(sub,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 55%' }
                }
            )
        }

        // Button entrance with bounce
        gsap.fromTo(btnRef.current,
            { opacity: 0, scale: 0.85, y: 30 },
            {
                opacity: 1, scale: 1, y: 0,
                duration: 0.9,
                ease: 'back.out(1.8)',
                scrollTrigger: { trigger: section, start: 'top 50%' }
            }
        )

        // Hours fade-in stagger
        const hours = section.querySelectorAll('.hour-block')
        gsap.fromTo(hours,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 45%' }
            }
        )

        // Ambient glow pulse
        const glow = section.querySelector('.ambient-glow')
        if (glow) {
            gsap.to(glow, {
                scale: 1.3,
                opacity: 0.08,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            })
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-40 px-6 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)' }}
        >
            {/* Gold lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Large scrolling background text */}
            <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                <span
                    ref={bgTextRef}
                    className="font-playfair font-black text-[22vw] text-white/[0.02] select-none whitespace-nowrap"
                >
                    CALL NOW • RESERVE YOUR CHAIR •
                </span>
            </div>

            {/* Ambient gold glow */}
            <div className="ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl mx-auto text-center">
                <div ref={headRef}>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <motion.div
                            className="w-12 h-px bg-gold/60"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ originX: 1 }}
                        />
                        <motion.span
                            className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Reserve Your Chair
                        </motion.span>
                        <motion.div
                            className="w-12 h-px bg-gold/60"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ originX: 0 }}
                        />
                    </div>

                    <h2 className="font-playfair font-black text-5xl md:text-8xl text-warm-white leading-tight mb-6" style={{ perspective: '1000px' }}>
                        {['Ready', 'for', 'the', 'Experience?'].map((word, i) => (
                            <span key={i} className="cw inline-block mr-4 md:mr-6 last:mr-0" style={{ opacity: 0, transform: 'translateY(70px) rotateX(-35deg)', transformOrigin: 'bottom' }}>
                                {word}
                            </span>
                        ))}
                    </h2>

                    <p className="font-cormorant font-300 italic text-xl text-warm-gray mb-14 max-w-lg mx-auto" style={{ opacity: 0 }}>
                        One call. One appointment. A transformation that lasts a lifetime of first impressions.
                    </p>
                </div>

                {/* Magnetic CTA Button */}
                <div ref={btnRef} style={{ opacity: 0 }}>
                    <motion.a
                        href="tel:+1234567890"
                        className="inline-flex items-center gap-4 px-14 py-7 bg-gold text-obsidian font-inter font-600 text-base tracking-[0.3em] uppercase relative overflow-hidden group"
                        data-cursor-hover
                        style={{ x: springX, y: springY }}
                        onMouseMove={handleBtnMove}
                        onMouseLeave={handleBtnLeave}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(201,168,76,0.35)' }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Now — (123) 456-7890
                        </span>
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                        {/* Second shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out delay-200" />
                    </motion.a>

                    {/* Hours */}
                    <div className="mt-10 flex items-center justify-center gap-8 flex-wrap">
                        {[
                            { label: 'Mon–Sat', time: '9am – 8pm' },
                            { label: 'Sunday', time: '10am – 6pm' },
                            { label: 'Walk-ins', time: 'Welcome' },
                        ].map((h, i) => (
                            <div key={i} className="hour-block text-center" style={{ opacity: 0 }}>
                                <div className="font-inter text-gold text-sm font-500">{h.label}</div>
                                <div className="font-inter text-warm-gray text-xs tracking-wider mt-0.5">{h.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
