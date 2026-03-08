import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { AnimatePresence } from 'framer-motion'

// Components
import PreLoader from './components/PreLoader'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ScrollStory from './components/ScrollStory'
import ParallaxShowcase from './components/ParallaxShowcase'
import ServicesSection from './components/ServicesSection'
import HorizontalScroll from './components/HorizontalScroll'
import GallerySection from './components/GallerySection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function LandingPage() {
    const [loaded, setLoaded] = useState(false)
    const lenisRef = useRef(null)

    useEffect(() => {
        // ─── Lenis smooth scroll ───
        const lenis = new Lenis({
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            lerp: 0.08,
        })
        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })
        gsap.ticker.lagSmoothing(0)

        return () => {
            lenis.destroy()
            gsap.ticker.remove(lenis.raf)
        }
    }, [])

    const handlePreloaderComplete = () => {
        setLoaded(true)
        setTimeout(() => ScrollTrigger.refresh(), 100)
    }

    return (
        <div className="min-h-screen bg-obsidian text-warm-white overflow-x-hidden">
            <AnimatePresence>
                {!loaded && <PreLoader onComplete={handlePreloaderComplete} />}
            </AnimatePresence>

            <Navbar />

            <main>
                <HeroSection />
                <ScrollStory />
                <ParallaxShowcase />
                <ServicesSection />
                <HorizontalScroll />
                <GallerySection />
                <TestimonialsSection />
                <CTASection />
                <ContactSection />
            </main>

            <Footer />
        </div>
    )
}
