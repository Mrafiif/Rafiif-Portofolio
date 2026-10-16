export interface Certification {
  title: string;
  issuer: 'Kaggle' | 'Dicoding Indonesia' | 'BPPK — Ministry of Finance RI';
  href: string;
}

export const certifications: Certification[] = [
  {
    title: 'Full-Stack Developer Internship Certificate',
    issuer: 'BPPK — Ministry of Finance RI',
    href: '/files/sertifikat-magang-bppk.pdf',
  },
  { title: 'Python', issuer: 'Kaggle', href: 'https://www.kaggle.com/learn/certification/mrafiif/python' },
  { title: 'Intro to Machine Learning', issuer: 'Kaggle', href: 'https://www.kaggle.com/learn/certification/mrafiif/intro-to-machine-learning' },
  { title: 'Intro to Deep Learning', issuer: 'Kaggle', href: 'https://www.kaggle.com/learn/certification/mrafiif/intro-to-deep-learning' },
  { title: 'Prompt Engineering untuk Software Developer', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/GRX5WRKGRZ0M' },
  { title: 'Belajar Machine Learning untuk Pemula', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/JMZVL2K73XN9' },
  { title: 'Belajar Dasar AI', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/4EXG1G0NQPRL' },
  { title: 'Belajar Membuat Front-End Web untuk Pemula', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/ERZRL72QOZYV' },
  { title: 'Belajar Dasar Pemrograman JavaScript', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/N9ZONOVM6XG5' },
  { title: 'Belajar Dasar Pemrograman Web', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/MRZMWQJYKPYQ' },
  { title: 'Memulai Pemrograman dengan Python', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/KEXLM3RDWZG2' },
  { title: 'Introduction to Financial Literacy', issuer: 'Dicoding Indonesia', href: 'https://www.dicoding.com/certificates/L4PQ93WKOPO1' },
];
