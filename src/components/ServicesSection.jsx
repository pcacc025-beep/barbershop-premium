import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const services = [
    {
        id: '01',
        title: 'Expert Fades & Cuts',
        description: 'From classic gentleman cuts to modern high fades — every line sculpted with surgical precision using premium Wahl and Andis tools.',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=700&q=85&auto=format&fit=crop',
        detail: 'Starting from $45',
        duration: '45 min',
    },
    {
        id: '02',
        title: 'Hot Towel Shaves',
        description: 'A ritual born in antiquity. Hot towels, pre-shave oil, straight razor, and post-shave balm. The most civilized experience known to man.',
        image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&q=85&auto=format&fit=crop',
        detail: 'Starting from $60',
        duration: '60 min',
    },
    {
        id: '03',
        title: 'Premium Beard Grooming',
        description: 'Bespoke beard shaping, conditioning, and sculpting. We transform your beard from overgrown to architectural — a statement you wear every day.',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700&q=85&auto=format&fit=crop',
        detail: 'Starting from $50',
        duration: '50 min',
    },
]

function MagneticButton({ children, href, className }) {
    const btnRef = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 250, damping: 15 })
    const springY = useSpring(y, { stiffness: 250, damping: 15 })

    const handleMouseMove = (e) => {
        const rect = btnRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * 0.3)
        y.set((e.clientY - centerY) * 0.3)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.a
            ref={btnRef}
            href={href}
            className={className}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            data-cursor-hover
        >
            {children}
        </motion.a>
    )
}

export default function ServicesSection() {
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const sec = sectionRef.current
        if (!sec) return

        // Header — letter stagger reveal
        const titleEl = headerRef.current?.querySelector('h2')
        if (titleEl) {
            gsap.to(titleEl.querySelectorAll('.word'), {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power4.out',
                scrollTrigger: { trigger: sec, start: 'top 70%' }
            })
        }

        // Card stacking effect — each card slides over the previous
        cardsRef.current.forEach((card, i) => {
            if (!card) return

            // Entrance — scale + clip path
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.92,
                    clipPath: 'inset(15% 5% 15% 5%)',
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 40%',
                        scrub: 1,
                    },
                }
            )

            // Pin + stack effect
            if (i < services.length - 1) {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 15%',
                    end: 'bottom 15%',
                    pin: true,
                    pinSpacing: false,
                })
            }

            // Parallax on the image inside each card
            const img = card.querySelector('.service-img')
            if (img) {
                gsap.to(img, {
                    yPercent: -20,
                    scale: 1.1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                })
            }

            // Title characters stagger
            const cardTitle = card.querySelector('.card-title')
            if (cardTitle) {
                const txt = cardTitle.textContent
                cardTitle.innerHTML = ''
                txt.split('').forEach(c => {
                    const s = document.createElement('span')
                    s.textContent = c === ' ' ? '\u00A0' : c
                    s.style.display = 'inline-block'
                    s.style.opacity = '0'
                    s.style.transform = 'translateY(30px)'
                    cardTitle.appendChild(s)
                })

                gsap.to(cardTitle.children, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.02,
                    duration: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 70%',
                    }
                })
            }
        })
    }, [])

    return (
        <section ref={sectionRef} id="services" className="relative py-32 px-6 bg-obsidian-100">
            {/* Lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-px bg-gold" />
                        <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">What We Do</span>
                    </div>
                    <h2 className="font-playfair text-5xl md:text-7xl font-bold text-warm-white leading-tight" style={{ perspective: '1000px' }}>
                        {['Crafted', 'for', 'the', 'Gentleman.'].map((word, i) => (
                            <span key={i} className="word inline-block mr-3 md:mr-4 last:mr-0" style={{ opacity: 0, transform: 'translateY(60px) rotateX(-30deg)', overflow: 'hidden' }}>
                                {word}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Stacking Service Cards */}
                <div className="space-y-6">
                    {services.map((service, i) => (
                        <div
                            key={service.id}
                            ref={el => cardsRef.current[i] = el}
                            className="group relative grid md:grid-cols-2 gap-0 border border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden bg-obsidian-200"
                            style={{ opacity: 0 }}
                        >
                            {/* Image with parallax */}
                            <div className={`relative h-64 md:h-96 overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="service-img w-full h-[120%] object-cover origin-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-obsidian-200/60 to-transparent" />

                                {/* Circular number badge */}
                                <div className="absolute top-8 left-8 md:top-10 md:left-10 w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
                                    <span className="font-playfair text-xl font-bold text-gold">{service.id}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`flex flex-col justify-center p-10 md:p-16 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                                <h3 className="card-title font-playfair text-3xl md:text-5xl font-bold text-warm-white leading-tight mb-4" style={{ perspective: '600px' }}>
                                    {service.title}
                                </h3>

                                <motion.p
                                    className="font-inter text-warm-gray leading-relaxed mb-8 text-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {service.description}
                                </motion.p>

                                <div className="flex items-center justify-between pt-6 border-t border-gold/10">
                                    <div>
                                        <motion.div
                                            className="font-inter text-gold text-lg font-500"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            viewport={{ once: true }}
                                        >
                                            {service.detail}
                                        </motion.div>
                                        <div className="font-inter text-warm-gray text-xs tracking-wider mt-1">{service.duration} session</div>
                                    </div>
                                    <MagneticButton
                                        href="tel:+1234567890"
                                        className="px-8 py-3.5 border border-gold/50 text-gold font-inter text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 inline-block"
                                    >
                                        Book Now
                                    </MagneticButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
