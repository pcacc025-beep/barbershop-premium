import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
    { value: '98', suffix: '%', label: 'Client Satisfaction' },
    { value: '15', suffix: '+', label: 'Years of Mastery' },
    { value: '500', suffix: '+', label: 'Clients Monthly' },
]

export default function ScrollStory() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const statsRefs = useRef([])
    const quoteRef = useRef(null)
    const pinnedRef = useRef(null)
    const step1Ref = useRef(null)
    const step2Ref = useRef(null)
    const lineRevealRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        // ── PINNED SCROLL STORYTELLING ──
        // Pin the about section for a storytelling sequence
        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: pinnedRef.current,
                start: 'top top',
                end: '+=200%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            },
        })

        // Step 1: Fade in heading word-by-word
        pinTl.fromTo(step1Ref.current,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1 }
        )

        // Gold line expand across screen
        pinTl.fromTo(lineRevealRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5 },
            '-=0.3'
        )

        // Step 2: Morph to stats
        pinTl.to(step1Ref.current,
            { opacity: 0, y: -40, duration: 0.5 },
            '+=0.3'
        )
        pinTl.fromTo(step2Ref.current,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
        )

        // Animated counters (triggered separately)
        statsRefs.current.forEach((el, i) => {
            if (!el) return
            const numEl = el.querySelector('.stat-num')
            const targetVal = parseInt(stats[i].value)

            gsap.fromTo(el,
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.7,
                    delay: i * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 40%' }
                }
            )

            ScrollTrigger.create({
                trigger: section,
                start: 'top 40%',
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: targetVal,
                        duration: 2.5,
                        delay: i * 0.3,
                        ease: 'power2.out',
                        onUpdate() {
                            if (numEl) numEl.textContent = Math.floor(this.targets()[0].val)
                        }
                    })
                }
            })
        })

        // Quote parallax + reveal
        gsap.fromTo(quoteRef.current,
            { opacity: 0, y: 50, scale: 0.97 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: quoteRef.current, start: 'top 80%' }
            }
        )

        // Quote image parallax
        const quoteImg = quoteRef.current?.querySelector('.quote-img')
        if (quoteImg) {
            gsap.to(quoteImg, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: quoteRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                }
            })
        }
    }, [])

    return (
        <section ref={sectionRef} id="about" className="relative bg-obsidian overflow-hidden">
            {/* ── PINNED STORYTELLING SECTION ── */}
            <div ref={pinnedRef} className="relative min-h-screen flex items-center justify-center">
                {/* Background decorative lines */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
                </div>

                <div className="max-w-5xl mx-auto text-center px-6">
                    {/* Step 1: Philosophy heading */}
                    <div ref={step1Ref} style={{ opacity: 0 }}>
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-8 h-px bg-gold" />
                            <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">Our Legacy</span>
                            <div className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-playfair text-5xl md:text-8xl font-black text-warm-white leading-tight mb-6">
                            Precision is<br />
                            <span className="gold-text italic">not a skill.</span>
                        </h2>
                        <p className="font-cormorant italic text-2xl text-warm-gray">
                            It's a philosophy we've lived by for nearly a century.
                        </p>
                    </div>

                    {/* Expanding gold line */}
                    <div ref={lineRevealRef} className="w-full h-px bg-gold my-12 origin-center" style={{ scaleX: 0 }} />

                    {/* Step 2: Stats (appears after step 1 fades) */}
                    <div ref={step2Ref} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
                        <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-4xl mx-auto">
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    ref={el => statsRefs.current[i] = el}
                                    className="text-center"
                                    style={{ opacity: 0 }}
                                >
                                    <div className="font-playfair font-black text-6xl md:text-8xl text-warm-white mb-3">
                                        <span className="stat-num">0</span>
                                        <span className="gold-text">{stat.suffix}</span>
                                    </div>
                                    <div className="font-inter text-[11px] tracking-[0.35em] text-warm-gray uppercase">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── QUOTE SECTION (below pinned) ── */}
            <div className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div
                        ref={quoteRef}
                        className="grid md:grid-cols-2 gap-12 items-center"
                        style={{ opacity: 0 }}
                    >
                        <div className="relative">
                            <div className="font-playfair text-9xl text-gold/15 leading-none absolute -top-8 -left-4 select-none">"</div>
                            <blockquote className="font-cormorant italic text-2xl md:text-4xl text-warm-cream leading-relaxed pl-6">
                                Every man deserves a chair where he feels like a king.
                                That chair has been ours for nearly a century.
                            </blockquote>
                            <div className="mt-8 pl-6">
                                <div className="font-inter text-gold text-sm tracking-widest">JAMES REEVES</div>
                                <div className="font-inter text-warm-gray text-xs tracking-wider mt-1">Founder, 1927</div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden h-80">
                            <img
                                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=85&auto=format&fit=crop"
                                alt="Master Barber at Work"
                                className="quote-img w-full h-[130%] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="font-inter text-[10px] tracking-[0.3em] text-gold uppercase">Master Craftsmanship</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
