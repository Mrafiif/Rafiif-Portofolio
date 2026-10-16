// Single source of truth for personal info. Edit here, the whole site updates.
export const site = {
  name: 'Muhammad Rafiif Dzakwan',
  shortName: 'Rafiif Dzakwan',
  initials: 'RD',
  handle: '@mrafiif',
  role: 'Full-Stack Developer & IT Support',
  location: 'Jakarta, Indonesia',
  email: 'mrafiifdzakwan@gmail.com',
  tagline: 'I build practical web apps that replace manual work — and keep the infrastructure behind them running.',
  description:
    'Muhammad Rafiif Dzakwan — final-year Informatics student, Full-Stack Developer and IT Support Intern based in Jakarta. Portfolio of AI-powered web apps, internal tools and network projects.',
  // TODO: replace with the link to your latest CV (Google Drive "anyone with the link", or put the PDF in public/files/ and use '/files/cv.pdf')
  cvUrl: 'https://drive.google.com/file/d/1_EN9Jg-o48tVtQkqqaXoDU-mfGNFjRER/view?usp=sharing',
  openToWork: true,
  socials: {
    github: 'https://github.com/Mrafiif',
    linkedin: 'https://linkedin.com/in/mrafiif',
    instagram: 'https://instagram.com/mrafiif',
  },
} as const;

export const nav = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
] as const;
