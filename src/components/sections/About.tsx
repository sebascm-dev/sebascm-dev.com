import Image from 'next/image'
import { about } from '@/data/about'

export default function About() {
  return (
    <section id="sobre-mi" className="py-24 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-sm text-[var(--accent)] mb-12 tracking-widest uppercase">
          Sobre mí
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Estudiante de informática que construye cosas reales.
            </h2>
            <p className="text-[var(--foreground)]/60 leading-relaxed text-base">
              {about.bio}
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl border border-[var(--accent)]/30 translate-x-3 translate-y-3" />
              <Image
                src={about.photo}
                alt={`Foto de ${about.name}`}
                width={320}
                height={320}
                className="relative rounded-2xl object-cover w-[320px] h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
