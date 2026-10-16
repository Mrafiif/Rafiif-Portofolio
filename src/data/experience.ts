import type { ImageMetadata } from 'astro';
import yili from '../assets/logos/yili.png';
import kemenkeu from '../assets/logos/kemenkeu.png';
import bem from '../assets/logos/bem.png';
import hmif from '../assets/logos/hmif.jpg';
import uai from '../assets/logos/uai.png';
import sman74 from '../assets/logos/sman74.png';

export interface TimelineItem {
  period: string;
  role: string;
  org: string;
  logo: ImageMetadata;
  kind: 'work' | 'leadership' | 'education';
  points: string[];
  tags?: string[];
}

export const experience: TimelineItem[] = [
  {
    period: 'Jun 2026 — Present',
    role: 'IT Support Intern',
    org: 'PT Yili Indonesia Dairy (Yili Group)',
    logo: yili,
    kind: 'work',
    points: [
      'Planned and deployed new Wi-Fi access points while revamping the existing network infrastructure to improve coverage and connectivity.',
      'Managed employee data backup and archiving to Network Attached Storage (NAS) as part of the offboarding process.',
      'Diagnosed and resolved anomalous hardware, software and network issues through structured troubleshooting.',
      'Handled OS installation, application configuration and systematic IT asset inventory tracking.',
      'Provided day-to-day helpdesk support for internal staff.',
      'Designed and built a slot-machine style door prize system for the company anniversary event (312 participants, 20 prizes).',
    ],
    tags: ['Networking', 'Wi-Fi AP', 'NAS', 'Helpdesk', 'Asset Management'],
  },
  {
    period: 'Mar 2026 — Jun 2026',
    role: 'Full-Stack Developer Intern',
    org: 'Pusdiklat Keuangan Publik, BPPK — Ministry of Finance RI',
    logo: kemenkeu,
    kind: 'work',
    points: [
      'Built PRIMA KP, a full-stack WFH scheduling and attendance portal that replaced manual spreadsheets, secured with PostgreSQL Row Level Security.',
      'Designed and developed AINOTE-KP and CoP-AI — speech-to-text systems that turn meeting recordings into official, formatted documents.',
      'Wrote technical documentation and a final strategic report presented to the central unit.',
    ],
    tags: ['PostgreSQL', 'FastAPI', 'Node.js', 'Speech-to-Text', 'LLM'],
  },
  {
    period: '2025 — 2026',
    role: 'President',
    org: 'Student Executive Board (BEM) FST UAI',
    logo: bem,
    kind: 'leadership',
    points: [
      "Led the faculty's executive board and coordinated all departments.",
      'Initiated strategic programs including seminars and social activities.',
      'Represented FST students in university-level forums.',
    ],
  },
  {
    period: '2024 — 2025',
    role: 'Chairman',
    org: 'Informatics Student Association (HMIF) UAI',
    logo: hmif,
    kind: 'leadership',
    points: [
      'Managed academic and non-academic development programs for informatics students.',
      'Initiated technology workshops, competitions and seminars, including FORTEX 5.0.',
      'Built partnerships with external organizations and stakeholders.',
    ],
  },
];

export const education: TimelineItem[] = [
  {
    period: '2022 — Present',
    role: 'Bachelor of Informatics',
    org: 'Universitas Al-Azhar Indonesia',
    logo: uai,
    kind: 'education',
    points: ['Focus on software development, data analysis, cybersecurity and AI.'],
  },
  {
    period: '2018 — 2021',
    role: 'Natural Sciences (IPA)',
    org: 'SMAN 74 Jakarta',
    logo: sman74,
    kind: 'education',
    points: ['Strong foundation in mathematics and logic.'],
  },
];
