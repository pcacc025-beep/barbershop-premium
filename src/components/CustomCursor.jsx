import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
    const dotRef = useRef(null)
    const ringRef = useRef(null)

    useEffect(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
        const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
        const xToRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
        const yToRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

        const onMove = (e) => {
            xToDot(e.clientX)
            yToDot(e.clientY)
            xToRing(e.clientX)
            yToRing(e.clientY)
        }

        const onEnterInteractive = () => {
            dot.classList.add('hover')
            ring.classList.add('hover')
        }

        const onLeaveInteractive = () => {
            dot.classList.remove('hover')
            ring.classList.remove('hover')
        }

        window.addEventListener('mousemove', onMove)

        const interactives = document.querySelectorAll('a, button, .magnetic-btn, [data-cursor-hover]')
        interactives.forEach(el => {
            el.addEventListener('mouseenter', onEnterInteractive)
            el.addEventListener('mouseleave', onLeaveInteractive)
        })

        return () => {
            window.removeEventListener('mousemove', onMove)
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', onEnterInteractive)
                el.removeEventListener('mouseleave', onLeaveInteractive)
            })
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    )
}
