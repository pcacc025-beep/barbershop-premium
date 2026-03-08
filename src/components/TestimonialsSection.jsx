import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        name: 'Marcus A.',
        role: 'Executive, Finance',
        review: "The most cinematic barbershop experience I've ever had. The hot towel shave alone is worth every penny. I've been coming here for 8 years and I'll never go anywhere else.",
        rating: 5,
        avatar: 'MA',
    },
    {
        name: 'Daniel T.',
        role: 'Creative Director',
        review: "They understand the geometry of a face. My fade is always architectural — not just a haircut, it's a silhouette. The attention to detail is unmatched in this city.",
        rating: 5,
        avatar: 'DT',
    },
    {
        name: 'Robert K.',
        role: 'Entrepreneur',
        review: "I walked in with a messy beard and walked out looking like a Forbes cover. The beard grooming service is transformative. I get compliments every single week.",
        rating: 5,
        avatar: 'RK',
    },
    {
        name: 'Samuel O.',
        role: 'Attorney',
        review: "The ambiance alone sets BARBER 1927 apart. Dark, quiet, intentional. It's the only place where I actually disconnect from work and enjoy the ritual of grooming.",
        rating: 5,
        avatar: 'SO',
    },
]

function MagneticCard({ children, className, index }) {
    const cardRef = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })
    const rotateY = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 })

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect()
        const xVal = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const yVal = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        rotateX.set(-yVal * 6)
        rotateY.set(xVal * 6)
    }

    const handleMouseLeave = () => {
        rotateX.set(0)
        rotateY.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={className}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: -8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
        >
            {children}
        </motion.div>
    )
}

export default function TestimonialsSection() {
    const sectionRef = useRef(null)
    const headRef = useRef(null)
    const lineRef = useRef(null)

    useEffect(() => {
        // Header word-by-word stagger
        const h2 = headRef.current?.querySelector('h2')
        if (h2) {
            gsap.to(h2.querySelectorAll('.tw'), {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: { trigger: headRef.current, start: 'top 75%' }
            })
        }

        // Decorative line expand
        if (lineRef.current) {
            gsap.fromTo(lineRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1, duration: 1.2, ease: 'power3.inOut',
                    scrollTrigger: { trigger: lineRef.current, start: 'top 85%' }
                }
            )
        }

        // Stagger star animations per card
        const cards = sectionRef.current?.querySelectorAll('.testimonial-card')
        cards?.forEach((card, i) => {
            const stars = card.querySelectorAll('.star-icon')
            gsap.fromTo(stars,
                { opacity: 0, scale: 0, rotation: -180 },
                {
                    opacity: 1, scale: 1, rotation: 0,
                    stagger: 0.08,
                    duration: 0.4,
                    ease: 'back.out(2)',
                    scrollTrigger: { trigger: card, start: 'top 80%' }
                }
            )
        })
    }, [])

    return (
        <section ref={sectionRef} id="testimonials" className="py-32 bg-obsidian-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div ref={headRef} className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-px bg-gold" />
                        <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Testimonials</span>
                    </div>
                    <h2 className="font-playfair text-5xl md:text-7xl font-bold text-warm-white" style={{ perspective: '1000px' }}>
                        {['The', 'Verdict.'].map((word, i) => (
                            <span key={i} className={`tw inline-block mr-3 md:mr-4 last:mr-0 ${word === 'Verdict.' ? 'gold-text italic' : ''}`} style={{ opacity: 0, transform: 'translateY(40px)' }}>
                                {word}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Expanding gold line */}
                <div ref={lineRef} className="w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-16 origin-left" style={{ scaleX: 0 }} />

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t, i) => (
                        <MagneticCard
                            key={i}
                            index={i}
                            className="testimonial-card group p-8 md:p-10 border border-gold/10 hover:border-gold/35 bg-obsidian transition-all duration-500 relative overflow-hidden"
                        >
                            {/* Quote decoration */}
                            <motion.div
                                className="font-playfair text-7xl text-gold/10 leading-none mb-4 select-none"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                            >
                                "
                            </motion.div>

                            {/* Stars with stagger spin-in */}
                            <div className="flex gap-1.5 mb-5">
                                {Array.from({ length: t.rating }).map((_, si) => (
                                    <svg key={si} className="star-icon w-4 h-4 text-gold fill-gold" style={{ opacity: 0 }} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="font-cormorant italic text-lg md:text-xl text-warm-cream leading-relaxed mb-8">
                                {t.review}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gold/10">
                                <motion.div
                                    className="w-11 h-11 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center"
                                    whileHover={{ scale: 1.15, borderColor: 'rgba(201,168,76,0.8)' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <span className="font-playfair text-xs font-bold text-gold">{t.avatar}</span>
                                </motion.div>
                                <div>
                                    <div className="font-inter text-warm-white text-sm font-500">{t.name}</div>
                                    <div className="font-inter text-warm-gray text-xs tracking-wider">{t.role}</div>
                                </div>
                            </div>

                            {/* Hover glow */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </MagneticCard>
                    ))}
                </div>
            </div>
        </section>
    )
}
