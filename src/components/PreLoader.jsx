import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'

// Inline Lottie animation data — gold scissors opening/closing
const scissorsAnimation = {
    v: '5.7.1',
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: 'Blade1',
            sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                r: { a: 1, k: [{ t: 0, s: [0], e: [20] }, { t: 30, s: [20], e: [0] }, { t: 60, s: [0] }] },
                p: { a: 0, k: [100, 100, 0] },
                a: { a: 0, k: [0, 50, 0] },
                s: { a: 0, k: [100, 100, 100] },
            },
            shapes: [
                {
                    ty: 'rc',
                    d: 1,
                    s: { a: 0, k: [8, 80] },
                    p: { a: 0, k: [0, 10] },
                    r: { a: 0, k: 4 },
                },
                {
                    ty: 'fl',
                    c: { a: 0, k: [0.788, 0.659, 0.298, 1] },
                    o: { a: 0, k: 100 },
                },
                {
                    ty: 'el',
                    p: { a: 0, k: [0, 55] },
                    s: { a: 0, k: [18, 18] },
                },
                {
                    ty: 'st',
                    c: { a: 0, k: [0.788, 0.659, 0.298, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 2 },
                },
            ],
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: 'Blade2',
            sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                r: { a: 1, k: [{ t: 0, s: [0], e: [-20] }, { t: 30, s: [-20], e: [0] }, { t: 60, s: [0] }] },
                p: { a: 0, k: [100, 100, 0] },
                a: { a: 0, k: [0, 50, 0] },
                s: { a: 0, k: [100, 100, 100] },
            },
            shapes: [
                {
                    ty: 'rc',
                    d: 1,
                    s: { a: 0, k: [8, 80] },
                    p: { a: 0, k: [0, 10] },
                    r: { a: 0, k: 4 },
                },
                {
                    ty: 'fl',
                    c: { a: 0, k: [0.886, 0.788, 0.494, 1] },
                    o: { a: 0, k: 100 },
                },
                {
                    ty: 'el',
                    p: { a: 0, k: [0, 55] },
                    s: { a: 0, k: [18, 18] },
                },
                {
                    ty: 'st',
                    c: { a: 0, k: [0.886, 0.788, 0.494, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 2 },
                },
            ],
        },
    ],
}

export default function PreLoader({ onComplete }) {
    const loaderRef = useRef(null)
    const textRef = useRef(null)
    const counterRef = useRef(null)
    const [count, setCount] = useState(0)
    const [done, setDone] = useState(false)

    useEffect(() => {
        // Counter animation
        const counter = { val: 0 }
        gsap.to(counter, {
            val: 100,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: () => setCount(Math.floor(counter.val)),
            onComplete: () => {
                setDone(true)
                // Exit animation
                const tl = gsap.timeline({
                    onComplete: () => onComplete?.(),
                })
                tl.to(textRef.current, { y: -40, opacity: 0, duration: 0.4, ease: 'power3.in' })
                tl.to(loaderRef.current, {
                    clipPath: 'inset(0 0 100% 0)',
                    duration: 1,
                    ease: 'power4.inOut',
                }, '-=0.1')
            },
        })
    }, [])

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    ref={loaderRef}
                    className="fixed inset-0 z-[99999] bg-obsidian flex items-center justify-center flex-col"
                    style={{ clipPath: 'inset(0 0 0 0)' }}
                    exit={{ opacity: 0 }}
                >
                    {/* Lottie Scissors */}
                    <div className="w-20 h-20 mb-8 opacity-70">
                        <Lottie
                            animationData={scissorsAnimation}
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>

                    <div ref={textRef}>
                        <div className="font-playfair font-black text-4xl tracking-[0.15em] text-warm-white mb-2">
                            BARBER
                        </div>
                        <div className="font-cormorant text-sm tracking-[0.6em] shimmer-text text-center">
                            1 9 2 7
                        </div>

                        {/* Progress bar */}
                        <div className="mt-8 w-48 h-px bg-obsidian-300 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gold"
                                initial={{ width: '0%' }}
                                animate={{ width: `${count}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                        <div ref={counterRef} className="font-inter text-[10px] tracking-[0.4em] text-warm-gray mt-3 text-center">
                            {count}%
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
