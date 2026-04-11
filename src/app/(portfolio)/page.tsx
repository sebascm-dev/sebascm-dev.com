// Portfolio home — all sections
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import { getProfile } from '@/app/actions/profile'

export default async function Home() {
  const profile = await getProfile()

  return (
    <>
      <Hero profile={profile} />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  )
}
