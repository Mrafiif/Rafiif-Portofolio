import type { ImageMetadata } from 'astro';

import ainoteCover from '../assets/projects/ainote/cover.png';
import ainoteHero from '../assets/projects/ainote/hero.jpg';
import ainoteRekaman from '../assets/projects/ainote/rekaman.jpg';
import ainoteForm from '../assets/projects/ainote/form.jpg';
import ainotePeserta from '../assets/projects/ainote/peserta.jpg';
import ainoteTranskrip from '../assets/projects/ainote/transkrip.jpg';
import ainoteTranskrip2 from '../assets/projects/ainote/transkrip2.jpg';
import ainoteProfil from '../assets/projects/ainote/profil.jpg';
import copaiHero from '../assets/projects/copai/hero.jpg';
import primaLogin from '../assets/projects/primakp/login.jpg';
import primaDashboard from '../assets/projects/primakp/dashboard.jpg';
import primaHome from '../assets/projects/primakp/home.jpg';
import ar from '../assets/projects/misc/ar.png';
import cisco from '../assets/projects/misc/cisco.png';
import zoowhiz from '../assets/projects/misc/zoowhiz.png';
import netflix from '../assets/projects/misc/netflix.png';
import weather from '../assets/projects/misc/weather.png';
import dpAfter from '../assets/projects/doorprize/08-after.jpg';
import dpHome from '../assets/projects/doorprize/01-home.jpg';
import dpOpening from '../assets/projects/doorprize/03-opening.jpg';
import dpIntro from '../assets/projects/doorprize/04-intro.jpg';
import dpSpinning from '../assets/projects/doorprize/06-spinning.jpg';
import dpPopup from '../assets/projects/doorprize/07-popup.jpg';
import dpSettings from '../assets/projects/doorprize/settings-prizes.jpg';

export interface Project {
  slug: string;
  title: string;
  /** One line shown on cards. */
  summary: string;
  /** Where/for whom it was built. */
  context: string;
  year?: string;
  category: 'AI' | 'Web App' | 'Mobile' | 'Network' | 'UI/UX' | 'Data' | 'AR';
  /** Long description for the case-study page. */
  overview: string;
  problem?: string;
  highlights: string[];
  stack: string[];
  cover: ImageMetadata;
  gallery?: { src: ImageMetadata; alt: string }[];
  links?: { label: string; href: string }[];
  /** Short facts shown in the case-study sidebar, e.g. Role / Timeline / Scale. */
  facts?: { label: string; value: string }[];
  /** Demo video served from public/, shown on the case-study page. */
  video?: { src: string; caption?: string };
  /** Featured projects get the large cards at the top. */
  featured?: boolean;
  /** Draft projects are not rendered anywhere. Flip to false once the content is ready. */
  draft?: boolean;
}

export const projects: Project[] = [
  {
    // Demo version. After the event: fill in the outcome below and add the GitHub link.
    slug: 'door-prize-system',
    title: 'Door Prize Draw System',
    summary: 'Slot-machine style raffle for a company anniversary event — readable on an LED screen, fair by design, and fully offline.',
    context: 'Company anniversary event',
    year: '2026',
    category: 'Web App',
    featured: true,
    overview:
      'A single-page web app that runs the door prize draw at a company anniversary event: 312 participants, 20 prizes and 103 winners. The operator runs the whole show with one key — home banner, 3-2-1 opening, a reveal for every prize, then all winner boxes spin at once and stop one by one. Brand names in the visuals are anonymized and participant names are sample data.',
    problem:
      'Most company door prize draws run on a generic spin-wheel website: one name at a time, small text, nothing tied to the event. The brief asked for slot-machine name boxes with the prize photo beside them, readable from the back of the room on an LED screen, and reliable on the day with no internet dependency.',
    highlights: [
      'Fair draw: winners picked with crypto.getRandomValues at the moment the operator presses stop, and nobody can win twice.',
      '“Not present? Redraw” sets an absent winner aside and draws again in one click.',
      'Operator panel: import employees from CSV/Excel with automatic de-duplication, manage prizes and photos, export winners to Excel.',
      'One-key show flow with keyboard shortcuts for every action (next prize, redraw, fullscreen, mute).',
      'Built for event-day risk: runs fully offline from one folder, auto-saves every draw (localStorage + IndexedDB), backup/restore to JSON, plus a PowerPoint Plan B.',
      'Three.js sky scene (clouds, balloons, stars) behind the draw, designed first in Figma with a mapped user flow.',
    ],
    stack: ['JavaScript', 'Three.js', 'HTML & CSS', 'IndexedDB', 'Figma'],
    facts: [
      { label: 'Role', value: 'Concept, UI/UX design, front-end build (AI-assisted)' },
      { label: 'Timeline', value: '~2 weeks, October 2026' },
      { label: 'Scale', value: '312 participants · 20 prizes · 103 winners' },
    ],
    cover: dpAfter,
    video: { src: '/media/doorprize-demo.mp4', caption: 'Demo run of the full show flow.' },
    gallery: [
      { src: dpHome, alt: 'Home banner: waiting screen before the draw' },
      { src: dpOpening, alt: '3-2-1 opening with the DOORPRIZE title drop' },
      { src: dpIntro, alt: 'Prize intro: photo and number of winners' },
      { src: dpSpinning, alt: 'Every winner box spinning at once' },
      { src: dpPopup, alt: 'Winner announcement card' },
      { src: dpAfter, alt: 'Winners stay on screen until the next prize' },
      { src: dpSettings, alt: 'Operator panel: prize management' },
    ],
  },
  {
    slug: 'ainote-kp',
    title: 'AINOTE-KP',
    summary: 'Turns meeting recordings into official BPPK-format minutes — transcription, speaker identification and AI summaries in one flow.',
    context: 'Internship · BPPK, Ministry of Finance RI',
    year: '2026',
    category: 'AI',
    featured: true,
    overview:
      'A full-stack web app that converts meeting recordings into official minutes (notula) that follow the BPPK Ministry of Finance document format. Staff upload an audio file or an existing transcript, and the system transcribes it, identifies who spoke, and drafts the discussion summary and conclusions automatically.',
    problem:
      'Writing official meeting minutes by hand meant re-listening to long recordings and manually matching statements to speakers before formatting everything into the required template.',
    highlights: [
      'Speech-to-text with Groq Whisper and speaker diarization with AssemblyAI.',
      'Voice profile enrollment so speakers are recognized by name, not "Speaker A".',
      'AI-generated discussion summaries and conclusions using LLaMA 3.3 70B via Groq.',
      'Imports existing transcripts from Microsoft Teams and Zoom (VTT).',
      'Output follows the official BPPK minutes template.',
    ],
    stack: ['FastAPI', 'Node.js', 'JavaScript', 'Groq Whisper', 'AssemblyAI', 'LLaMA 3.3 70B'],
    cover: ainoteCover,
    gallery: [
      { src: ainoteHero, alt: 'Landing screen: upload a meeting recording to generate minutes' },
      { src: ainoteRekaman, alt: 'Meeting information form: document identity, date, time, place and agenda' },
      { src: ainoteForm, alt: 'Participant list, signatory fields and the Generate Minutes button' },
      { src: ainotePeserta, alt: 'Transcript mode: supported VTT, TXT and DOCX formats' },
      { src: ainoteTranskrip, alt: 'Transcript file upload' },
      { src: ainoteTranskrip2, alt: 'Voice enrollment: register an employee voice profile' },
      { src: ainoteProfil, alt: 'Voice sample upload with quality verification' },
    ],
    // TODO: add { label: 'GitHub', href: 'https://github.com/Mrafiif/<repo>' } if the repository is public
  },
  {
    slug: 'cop-ai',
    title: 'CoP-AI',
    summary: 'Generates 11-section Community of Practice "Lesson Learned" reports straight from discussion recordings.',
    context: 'Internship · BPPK, Ministry of Finance RI',
    year: '2026',
    category: 'AI',
    featured: true,
    overview:
      'A full-stack web app that produces official Community of Practice (CoP) Lesson Learned reports from discussion recordings. The full transcript is analysed by an LLM that fills in every section of the report — from the executive summary to recommendations.',
    problem:
      'CoP sessions produce valuable knowledge, but turning an hour-long discussion into a structured 11-section report was slow and inconsistent between authors.',
    highlights: [
      'Transcription with Groq Whisper large-v3.',
      'Claude AI or LLaMA 3.3 70B auto-fills Executive Summary, Issue Statement, Background, Objectives, Key Learnings, Conclusions, Recommendations and more.',
      'Accepts Teams VTT, Zoom, DOCX and TXT transcripts as input.',
    ],
    stack: ['FastAPI', 'Node.js', 'Groq Whisper', 'Claude AI', 'LLaMA 3.3 70B'],
    cover: copaiHero,
    // TODO: add a GitHub link if the repository is public
  },
  {
    slug: 'prima-kp',
    title: 'PRIMA KP',
    summary: 'WFH scheduling and attendance monitoring portal that replaced manual spreadsheets for Pusdiklat KP staff.',
    context: 'Internship · BPPK, Ministry of Finance RI',
    year: '2026',
    category: 'Web App',
    featured: true,
    overview:
      'PRIMA KP (Portal Informasi & Monitoring Kehadiran) is a web portal for scheduling work-from-home days and monitoring staff attendance at Pusdiklat Keuangan Publik. Employees sign in with their NIP and see a live calendar; admins manage schedules from a dedicated panel.',
    problem:
      'WFH schedules were tracked in shared spreadsheets, which made it hard to see who was in the office on a given day and easy to overwrite each other’s data.',
    highlights: [
      'Login with employee ID (NIP).',
      'Real-time schedule calendar for all staff.',
      'Admin panel for managing schedules and attendance.',
      'PostgreSQL Row Level Security so each user can only modify their own data.',
    ],
    stack: ['JavaScript', 'PostgreSQL', 'Row Level Security'],
    cover: primaLogin,
    gallery: [
      { src: primaLogin, alt: 'PRIMA KP login page' },
      { src: primaDashboard, alt: 'PRIMA KP dashboard' },
      { src: primaHome, alt: 'PRIMA KP schedule calendar' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/primakp2026/PRIMA-KP' }],
  },
  {
    slug: 'campus-network',
    title: 'Campus Network Infrastructure',
    summary: 'Multi-layer campus network topology simulated in Cisco Packet Tracer.',
    context: 'Academic project',
    category: 'Network',
    overview:
      'A simulated campus network designed in Cisco Packet Tracer, with a multi-layer architecture and routing configured to serve devices across multiple campus buildings.',
    highlights: ['Hierarchical (multi-layer) network design.', 'Routing configured between campus segments.'],
    stack: ['Cisco Packet Tracer', 'Routing', 'Network Design'],
    cover: cisco,
    links: [{ label: 'GitHub', href: 'https://github.com/Mrafiif/campus_network_cisco' }],
  },
  {
    slug: 'weather-app',
    title: 'Weather App',
    summary: 'Flutter weather app with location-based hourly and weekly forecasts.',
    context: 'Personal project',
    category: 'Mobile',
    overview:
      'A mobile weather application built with Flutter that integrates a real-time weather API to show location-based forecasts with hourly and weekly views.',
    highlights: ['Real-time weather API integration.', 'Location-based forecasts.', 'Hourly and weekly forecast views.'],
    stack: ['Flutter', 'Dart', 'REST API'],
    cover: weather,
    links: [{ label: 'GitHub', href: 'https://github.com/Mrafiif/weather_apps_Rafiif' }],
  },
  {
    slug: 'netflix-data-visualization',
    title: 'Netflix Data Visualization',
    summary: 'Exploratory data analysis of the Netflix catalogue with Python.',
    context: 'Academic project',
    category: 'Data',
    overview:
      'Exploratory data analysis on Netflix datasets using Python, visualizing content trends such as genre distribution, release patterns and regional content preferences.',
    highlights: ['Genre distribution analysis.', 'Release-year trends.', 'Regional content comparison.'],
    stack: ['Python', 'Pandas', 'Data Visualization'],
    cover: netflix,
    links: [{ label: 'GitHub', href: 'https://github.com/Mrafiif/Netflix-Data-Visualization-Rafiif' }],
  },
  {
    slug: 'zoo-whiz',
    title: 'Zoo-Whiz App Design',
    summary: 'Interactive Figma prototype for a zoo companion app, focused on accessibility.',
    context: 'UI/UX project',
    category: 'UI/UX',
    overview:
      'An interactive prototype for a zoo companion app designed in Figma, with a focus on intuitive navigation, accessibility and inclusive design.',
    highlights: ['Interactive, clickable prototype.', 'Accessibility-first layout and navigation.'],
    stack: ['Figma', 'Prototyping'],
    cover: zoowhiz,
    links: [{ label: 'Figma prototype', href: 'https://www.figma.com/proto/X8ztOjce6jlHgDet0ZeeRd/Untitled?node-id=1-2' }],
  },
  {
    slug: 'augmented-reality',
    title: 'Augmented Reality Lenses',
    summary: 'Face- and body-tracking AR experiences built with Lens Studio.',
    context: 'Personal project',
    category: 'AR',
    overview:
      'Augmented reality experiences built with Lens Studio that use face tracking and body tracking to react to the user’s movement in real time.',
    highlights: ['Real-time face tracking.', 'Body tracking.'],
    stack: ['Lens Studio', 'JavaScript'],
    cover: ar,
    links: [{ label: 'GitHub', href: 'https://github.com/Mrafiif/Augmented-Reality-Apps' }],
  },
];

export const publishedProjects = projects.filter((p) => !p.draft);
