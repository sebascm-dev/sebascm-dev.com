import type { Project } from '@/lib/types'

export const projects: Project[] = [
  {
    id: 'fisio-celia',
    title: 'Fisio Celia',
    description: 'App web para fisioterapeuta — gestión de citas, pacientes y servicios.',
    longDescription:
      'Aplicación web completa desarrollada para una fisioterapeuta profesional. Permite gestionar su agenda de citas, mostrar sus servicios y facilitar el contacto con pacientes. Diseñada con foco en la experiencia de usuario y la profesionalidad.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
    demoUrl: 'https://celiamunozfisio.com',
    featured: true,
    image: '/proyectos/imagen-celiamunozfisio.webp',
  },
]
