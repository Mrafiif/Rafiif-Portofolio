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
  // TODO: replace with the link to your latest CV (Google Drive "anyone with the link", or put the PDF in public/files/ and use '/files/cv.pdf')
  cvUrl: 'https://drive.google.com/file/d/1_EN9Jg-o48tVtQkqqaXoDU-mfGNFjRER/view?usp=sharing',
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
