import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Splits text into individual characters with GSAP stagger animation
 * on ScrollTrigger. Used for cinematic text reveals.
 */
export default function TextSplitter({
    children,
    as: Tag = 'div',
    className = '',
    stagger = 0.03,
    duration = 0.6,
    ease = 'power3.out',
    delay = 0,
    y = 40,
    start = 'top 80%',
    scrub = false,
}) {
    const containerRef = useRef(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const text = el.textContent
        el.innerHTML = ''

        // Wrap each character in a span
        text.split('').forEach((char) => {
            const span = document.createElement('span')
            span.textContent = char === ' ' ? '\u00A0' : char
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.style.transform = `translateY(${y}px) rotateX(-60deg)`
            span.style.transformOrigin = 'bottom center'
            span.className = 'char-span'
            el.appendChild(span)
        })

        const chars = el.querySelectorAll('.char-span')

        if (scrub) {
            gsap.to(chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: stagger,
                ease: ease,
                scrollTrigger: {
                    trigger: el,
                    start: start,
                    end: 'bottom 20%',
                    scrub: 1,
                },
            })
        } else {
            gsap.to(chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: ease,
                scrollTrigger: {
                    trigger: el,
                    start: start,
                    once: true,
                },
            })
        }

        return () => ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === el) st.kill()
        })
    }, [children])

    return (
        <Tag ref={containerRef} className={className} style={{ perspective: '1000px' }}>
            {children}
        </Tag>
    )
}
