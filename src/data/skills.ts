import {
  siJavascript, siTypescript, siPython, siPhp, siDart, siMysql, siHtml5,
  siReact, siNextdotjs, siNodedotjs, siFastapi, siLaravel, siFlutter, siFirebase, siPostgresql,
  siGit, siGithub, siFigma, siCisco, siAnthropic, siMeta,
} from 'simple-icons';

interface SimpleIcon { path: string; hex: string; title: string }

export interface Skill { name: string; icon?: SimpleIcon }
export interface SkillGroup { title: string; blurb: string; skills: Skill[] }

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    blurb: 'What I write day to day.',
    skills: [
      { name: 'JavaScript', icon: siJavascript },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'Python', icon: siPython },
      { name: 'PHP', icon: siPhp },
      { name: 'Dart', icon: siDart },
      { name: 'SQL' },
      { name: 'HTML & CSS', icon: siHtml5 },
    ],
  },
  {
    title: 'Frameworks & Data',
    blurb: 'Building full-stack apps end to end.',
    skills: [
      { name: 'React', icon: siReact },
      { name: 'Next.js', icon: siNextdotjs },
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'FastAPI', icon: siFastapi },
      { name: 'Laravel', icon: siLaravel },
      { name: 'Flutter', icon: siFlutter },
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'MySQL', icon: siMysql },
      { name: 'Firebase', icon: siFirebase },
    ],
  },
  {
    title: 'AI Integration',
    blurb: 'Putting speech and language models to work.',
    skills: [
      { name: 'Whisper (Speech-to-Text)' },
      { name: 'Speaker Diarization' },
      { name: 'Claude API', icon: siAnthropic },
      { name: 'LLaMA via Groq', icon: siMeta },
      { name: 'Prompt Engineering' },
    ],
  },
  {
    title: 'IT Infrastructure & Support',
    blurb: 'Keeping people and networks running.',
    skills: [
      { name: 'Network Design', icon: siCisco },
      { name: 'Wi-Fi AP Deployment' },
      { name: 'NAS Backup & Archiving' },
      { name: 'OS Installation & Config' },
      { name: 'Troubleshooting' },
      { name: 'IT Asset Inventory' },
      { name: 'Helpdesk Support' },
    ],
  },
  {
    title: 'Tools',
    blurb: 'Design and collaboration.',
    skills: [
      { name: 'Git', icon: siGit },
      { name: 'GitHub', icon: siGithub },
      { name: 'Figma', icon: siFigma },
    ],
  },
];
