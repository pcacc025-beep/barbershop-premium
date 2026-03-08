import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const galleryImages = [
    {
        src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=85&auto=format&fit=crop',
        alt: 'Premium barbershop interior',
        label: 'The Chair',
        span: 'md:col-span-2 md:row-span-2',
    },
    {
        src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=85&auto=format&fit=crop',
        alt: 'Expert fade haircut',
        label: 'Precision Fade',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=85&auto=format&fit=crop',
        alt: 'Straight razor hot shave',
        label: 'The Ritual',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1593702295094-f4f5a6a42cfa?w=600&q=85&auto=format&fit=crop',
        alt: 'Beard grooming tools',
        label: 'The Craft',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=85&auto=format&fit=crop',
        alt: 'Gentleman haircut side profile',
        label: 'Side Profile',
        span: '',
    },
]

function TiltCard({ image, index }) {
    const cardRef = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 300, damping: 30 })
    const brightness = useTransform(y, [-150, 0, 150], [1.15, 1, 0.85])

    useEffect(() => {
        if (!cardRef.current) return

        // GSAP stagger entrance with scale and rotation
        gsap.fromTo(cardRef.current,
            {
                opacity: 0,
                scale: 0.85,
                y: 60,
                rotateY: index % 2 === 0 ? -10 : 10,
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateY: 0,
                duration: 0.9,
                delay: index * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 85%',
                },
            }
        )

        // Parallax within each card on scroll
        const img = cardRef.current.querySelector('.gallery-img')
        if (img) {
            gsap.to(img, {
                yPercent: -12,
                ease: 'none',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            })
        }
    }, [index])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left - rect.width / 2)
        y.set(e.clientY - rect.top - rect.height / 2)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden group ${image.span} cursor-none`}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
                filter: `brightness(${brightness})`,
                opacity: 0,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-cursor-hover
        >
            <motion.img
                src={image.src}
                alt={image.alt}
                className="gallery-img w-full h-full object-cover"
                style={{ height: '120%' }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Cinematic gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Label reveal */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
            >
                <span className="font-inter text-[10px] tracking-[0.4em] text-gold uppercase block mb-1">{image.label}</span>
                <div className="w-8 h-px bg-gold" />
            </motion.div>

            {/* Gold corner accent */}
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-gold/40 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100" />
        </motion.div>
    )
}

export default function GallerySection() {
    const sectionRef = useRef(null)
    const headRef = useRef(null)

    useEffect(() => {
        // Header — word-by-word stagger
        const h2 = headRef.current?.querySelector('h2')
        if (h2) {
            gsap.to(h2.querySelectorAll('.gw'), {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: { trigger: headRef.current, start: 'top 75%' }
            })
        }

        // Paragraph slide-in
        const p = headRef.current?.querySelector('p')
        if (p) {
            gsap.fromTo(p,
                { opacity: 0, x: 30 },
                {
                    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 70%' }
                }
            )
        }
    }, [])

    return (
        <section ref={sectionRef} id="gallery" className="py-32 px-6 bg-obsidian">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-px bg-gold" />
                            <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Gallery</span>
                        </div>
                        <h2 className="font-playfair text-5xl md:text-7xl font-bold text-warm-white leading-tight" style={{ perspective: '1000px' }}>
                            {['The', 'Work', 'Speaks.'].map((word, i) => (
                                <span key={i} className="gw inline-block mr-3 md:mr-4 last:mr-0" style={{ opacity: 0, transform: 'translateY(50px) rotateX(-20deg)' }}>
                                    {word}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <p className="font-inter text-warm-gray text-sm max-w-xs leading-relaxed mt-6 md:mt-0">
                        Each cut is a composition. Each shave, an act of discipline.
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: '240px' }}>
                    {galleryImages.map((img, i) => (
                        <TiltCard key={i} image={img} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}
