// Single source of truth for personal info. Edit here, the whole site updates.
export const site = {
  name: 'Muhammad Rafiif Dzakwan',
  shortName: 'Rafiif Dzakwan',
  firstName: 'Rafiif',
  lastName: 'Dzakwan',
  initials: 'RD',
  handle: '@mrafiif',
  role: 'Full-Stack Developer & IT Support',
  location: 'Jakarta, Indonesia',
  email: 'mrafif85.mr@gmail.com',
  description:
    'Muhammad Rafiif Dzakwan — final-year Informatics student, Full-Stack Developer and IT Support Intern based in Jakarta. Portfolio of AI-powered web apps, internal tools and network projects.',
  // Google Drive link must be shared as "Anyone with the link".
  cvUrl: 'https://drive.google.com/file/d/1BsZL6QJuVUaVwLFjtz1b7otVjj2vjk86/view?usp=sharing',
  openToWork: true,
  socials: {
    github: 'https://github.com/Mrafiif',
    linkedin: 'https://www.linkedin.com/in/muhammad-rafiif-16b4a8245',
    instagram: 'https://www.instagram.com/mrafiif.85',
  },
} as const;

export const nav = [
  { href: '/#top', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
] as const;
