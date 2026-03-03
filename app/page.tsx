import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Certifications from '@/components/sections/Certifications'
import Contact from '@/components/sections/Contacts'
import ClientOnly from '@/components/layout/ClientOnly'

export default function Home() {
  return (
    <main className="min-h-screen">
      <ClientOnly >
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Certifications />
      <Contact />
      </ClientOnly>
    </main>
  )
}
