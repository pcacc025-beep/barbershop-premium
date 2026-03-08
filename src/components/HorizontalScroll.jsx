import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const processSteps = [
    {
        num: '01',
        title: 'Consultation',
        desc: 'We listen. Every face is a canvas. Your barber studies your bone structure, hair texture, and lifestyle to craft a look that is uniquely yours.',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80&auto=format&fit=crop',
    },
    {
        num: '02',
        title: 'Preparation',
        desc: 'Hot towels. Pre-shave oils. We prime every follicle for the cleanest cut possible. This is where ritual begins — and the outside world fades.',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80&auto=format&fit=crop',
    },
    {
        num: '03',
        title: 'Execution',
        desc: 'Precision fades, sculpted lines, razor-sharp edges. Your barber becomes a surgeon — working with hand-calibrated tools and decades of experience.',
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80&auto=format&fit=crop',
    },
    {
        num: '04',
        title: 'Finishing',
        desc: 'Aftershave balm, styling product, and one final inspection under golden light. You don\'t just leave looking better — you leave feeling reborn.',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80&auto=format&fit=crop',
    },
]

export default function HorizontalScroll() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const headRef = useRef(null)
    const progressRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        // Header reveal
        gsap.fromTo(headRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 80%' }
            }
        )

        // Horizontal scroll with pinning
        const cards = track.querySelectorAll('.process-card')
        const totalScroll = track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
            x: () => -totalScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${totalScroll}`,
                pin: true,
                scrub: 1.2,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (progressRef.current) {
                        gsap.set(progressRef.current, { scaleX: self.progress })
                    }
                },
            },
        })

        // Stagger-in each card as it scrolls into view
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, scale: 0.9, rotateY: -8 },
                {
                    opacity: 1, scale: 1, rotateY: 0,
                    duration: 0.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: scrollTween,
                        start: 'left 90%',
                        end: 'left 60%',
                        scrub: true,
                    },
                }
            )

            // Parallax image inside each card
            const img = card.querySelector('.process-img')
            if (img) {
                gsap.fromTo(img,
                    { xPercent: -15 },
                    {
                        xPercent: 15,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: scrollTween,
                            start: 'left right',
                            end: 'right left',
                            scrub: true,
                        },
                    }
                )
            }
        })

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill())
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative bg-obsidian overflow-hidden"
            style={{ height: '100vh' }}
        >
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-obsidian-300" style={{ opacity: 0 }}>
                <div ref={progressRef} className="h-full bg-gold origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>

            {/* Header (pinned) */}
            <div ref={headRef} className="absolute top-8 left-8 z-20" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-8 h-px bg-gold" />
                    <span className="font-inter text-[10px] tracking-[0.5em] text-gold uppercase">The Protocol</span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-warm-white">
                    Four Steps. <span className="gold-text italic">One Masterpiece.</span>
                </h2>
            </div>

            {/* Horizontal Track */}
            <div ref={trackRef} className="flex h-full items-center gap-8 pl-[50vw] pr-[30vw] pt-20">
                {processSteps.map((step, i) => (
                    <div
                        key={step.num}
                        className="process-card flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[40vw] h-[65vh] relative bg-obsidian-200 border border-gold/10 overflow-hidden group"
                        style={{ perspective: '1200px' }}
                    >
                        {/* Background Image with Parallax */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={step.image}
                                alt={step.title}
                                className="process-img w-[130%] h-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-200 via-obsidian-200/80 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-14">
                            <div>
                                <span className="font-playfair text-8xl md:text-9xl font-black text-gold/15 leading-none block mb-4">
                                    {step.num}
                                </span>
                                <h3 className="font-playfair text-4xl md:text-5xl font-bold text-warm-white mb-4">
                                    {step.title}
                                </h3>
                                <p className="font-inter text-warm-gray text-sm leading-relaxed max-w-sm">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Step indicator */}
                            <div className="flex items-center gap-3">
                                {processSteps.map((_, si) => (
                                    <div
                                        key={si}
                                        className={`h-px transition-all duration-500 ${si === i ? 'w-12 bg-gold' : 'w-6 bg-warm-gray/30'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Corner decoration */}
                        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>
        </section>
    )
}
