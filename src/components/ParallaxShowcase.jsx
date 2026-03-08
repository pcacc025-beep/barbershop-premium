import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxShowcase() {
    const sectionRef = useRef(null)
    const layer1Ref = useRef(null)
    const layer2Ref = useRef(null)
    const layer3Ref = useRef(null)
    const textRef = useRef(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Framer Motion parallax from mouse
    const x1 = useTransform(mouseX, [-500, 500], [15, -15])
    const y1 = useTransform(mouseY, [-500, 500], [10, -10])
    const x2 = useTransform(mouseX, [-500, 500], [-10, 10])
    const y2 = useTransform(mouseY, [-500, 500], [-8, 8])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left - rect.width / 2)
        mouseY.set(e.clientY - rect.top - rect.height / 2)
    }

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        // Multi-layer parallax on scroll
        gsap.to(layer1Ref.current, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
        })

        gsap.to(layer2Ref.current, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
        })

        gsap.to(layer3Ref.current, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
        })

        // Text reveal letter-by-letter
        const textEl = textRef.current
        if (textEl) {
            const text = textEl.textContent
            textEl.innerHTML = ''
            text.split('').forEach(char => {
                const span = document.createElement('span')
                span.textContent = char === ' ' ? '\u00A0' : char
                span.style.display = 'inline-block'
                span.style.opacity = '0'
                span.style.transform = 'translateY(100%) rotateX(-90deg)'
                span.style.transformOrigin = 'bottom'
                textEl.appendChild(span)
            })

            gsap.to(textEl.children, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.02,
                duration: 0.5,
                ease: 'power4.out',
                scrollTrigger: { trigger: textEl, start: 'top 75%' }
            })
        }

        // Scale-in reveal for the image
        gsap.fromTo('.parallax-main-img', {
            clipPath: 'inset(30% 30% 30% 30%)',
            scale: 1.3,
        }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 20%', scrub: 1 }
        })
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-0 bg-obsidian overflow-hidden"
            style={{ height: '150vh' }}
            onMouseMove={handleMouseMove}
        >
            {/* Background Layer 1 — furthest */}
            <div ref={layer1Ref} className="absolute inset-0 flex items-center justify-center">
                <div className="font-playfair font-black text-[25vw] text-white/[0.015] select-none whitespace-nowrap">
                    PRECISION
                </div>
            </div>

            {/* Background Layer 2 — gold circles */}
            <motion.div ref={layer2Ref} className="absolute inset-0 pointer-events-none" style={{ x: x1, y: y1 }}>
                <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full border border-gold/10" />
                <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full border border-gold/5" />
                <div className="absolute bottom-[15%] left-[40%] w-48 h-48 rounded-full border border-gold/8" />
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                {/* Main Image with clip-path reveal */}
                <motion.div className="relative mb-12" style={{ x: x2, y: y2 }}>
                    <img
                        src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85&auto=format&fit=crop"
                        alt="Barber at work"
                        className="parallax-main-img w-[80vw] md:w-[50vw] h-[40vh] md:h-[55vh] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                </motion.div>

                {/* Text with letter-by-letter reveal */}
                <div className="text-center max-w-3xl">
                    <h2
                        ref={textRef}
                        className="font-playfair font-black text-4xl md:text-7xl text-warm-white leading-tight"
                        style={{ perspective: '800px' }}
                    >
                        Where every detail matters.
                    </h2>
                    <motion.p
                        className="font-cormorant italic text-xl text-warm-gray mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        A sanctuary built on obsession.
                    </motion.p>
                </div>
            </div>

            {/* Foreground Layer 3 */}
            <div ref={layer3Ref} className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </section>
    )
}
