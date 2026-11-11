// All site content lives here. Edit this file to update the portfolio —
// no GitHub API calls are needed to render it, so nothing can rate-limit or fail to load.
// (The Lab section is the exception: it ships with a build-time snapshot and only
// refreshes from GitHub on top of that. See src/lab.js.)

export const profile = {
  name: 'Rahul Chandra',
  role: 'Senior Game Programmer · C++ / C#',
  location: 'London, UK',
  avatar: '/images/avatar.jpg',
  intro:
    'Senior game programmer with 5+ years of C++ and C#, building abilities, AI, networking and tools that are fast and easy for designers to tune. I\'ve worked on an unannounced AAA console and PC game, Red Rust Pioneers (co-op survival on Steam) and mobile titles that hit #1 on the UK App Store.',
  stats: [
    { value: '5+', label: 'Years in games' },
    { value: '3+', label: 'Shipped titles' },
    { value: '#1', label: 'UK App Store' },
    { value: 'AAA', label: 'Console & PC' },
  ],
  links: {
    email: 'rahulchandra99@gmail.com',
    linkedin: 'https://www.linkedin.com/in/rahulchandra99/',
    github: 'https://github.com/RahulChandra99',
    youtube: 'https://www.youtube.com/@rahulchandra4125/videos',
    itch: 'https://rahul-chandra.itch.io',
    resume: 'https://drive.google.com/file/d/15Fina3iX3wO0lpioefzt546BpA9Eolwy/view?usp=sharing',
  },
  // Icons live in public/icons (Simple Icons, CC0). Entries without an icon show their text.
  // Languages and fundamentals first, engines after.
  techStack: [
    { name: 'C++', icon: 'cplusplus' },
    { name: 'C#', icon: 'csharp' },
    { name: 'Python', icon: 'python' },
    { name: 'OpenGL', icon: 'opengl' },
    { name: 'Unreal', icon: 'unrealengine' },
    { name: 'Unity', icon: 'unity' },
    { name: 'Linux', icon: 'linux' },
    { name: 'Git', icon: 'git' },
    { name: 'Perforce', icon: 'perforce' },
  ],
}

// Current game, shown as the large feature card.
export const featured = {
  title: 'Red Rust Pioneers',
  studio: 'fish in a bottle',
  role: 'C++ Unreal Game Developer',
  details: { platform: 'PC', engine: 'Unreal Engine 5', duration: 'Apr 2026 – Present', role: 'C++ Unreal Game Developer' },
  status: 'In development · Steam',
  image: '/images/red-rust-pioneers.jpg',
  banner: '/images/rrp-hero.jpg',
  summary:
    "A cooperative PvE survival-crafting game with Western fantasy elements, and the studio's first own-IP title.",
  highlights: [
    'Quest system with shared objectives, stage progression and rewards',
    'Replicated, physics-driven wagon with multiplayer passenger handling',
    'Server-authoritative crafting and modular cabin building',
  ],
  tags: ['Unreal Engine 5', 'C++', 'Multiplayer', 'PCG'],
  link: { label: 'Wishlist on Steam', url: 'https://store.steampowered.com/app/3664440/Red_Rust_Pioneers/' },
}

// Work history, newest first.
export const experience = [
  {
    company: 'fish in a bottle',
    role: 'C++ Unreal Game Developer',
    dates: 'Apr 2026 – Present',
    place: 'Remote, UK',
    project: 'Red Rust Pioneers (PC)',
    highlights: [
      'Quest architecture with shared objectives, stage progression and reward distribution',
      'Optimised PCG pathways for large-scale procedural world traversal',
    ],
    tags: ['Unreal', 'C++', 'Multiplayer'],
  },
  {
    company: 'Revived Overworld',
    role: 'C++ Unreal Gameplay / AI Programmer · Contract',
    dates: 'Dec 2024 – Apr 2026',
    place: 'Remote',
    project: 'Unannounced AAA project (Console & PC)',
    highlights: [
      '10+ multiplayer-ready GAS abilities (dash, teleport, invisibility, shield, fireball, rewind) in a large shared codebase',
      'Plug-and-play AI behaviour system with reusable Patrol, Chase and Attack tasks',
      'Trace-based hit detection redesign plus internal ability-debugging tools',
    ],
    tags: ['Unreal', 'GAS', 'AI'],
  },
  {
    company: 'BeGames Ltd.',
    role: 'Senior Unity Gameplay Programmer',
    dates: 'Jan 2022 – Jan 2024',
    place: 'London, UK',
    project: '3+ shipped mobile titles, incl. The Wombats & Mavin Runner',
    highlights: [
      'Shipped gameplay for music titles that reached #1 on the UK App Store',
      'Editor tooling that cut designer level-setup time by ~35%',
      'Profiling and asset-loading work that improved performance and load times by ~25%',
    ],
    tags: ['Unity', 'C#', 'Mobile'],
  },
  {
    company: 'HoloWorld',
    role: 'AR/VR Unity Engineer',
    dates: 'May 2021 – Feb 2022',
    place: 'Mysore, India',
    project: 'AR educational apps',
    highlights: [
      'Interactive AR experiences that teach science and maths concepts, built with educators',
    ],
    tags: ['Unity', 'AR/VR'],
  },
]

// category drives the filter chips: 'unreal' | 'unity' | 'tools'
export const projects = [
  {
    title: 'Stealth, Weapons & Combat AI',
    repo: 'unreal-cpp-interaction-weapon-stealth-combat-ai-system',
    details: { platform: 'PC', engine: 'Unreal Engine 5', duration: '3 weeks', team: 'Solo', role: 'Gameplay, Systems & AI Programmer' },
    category: 'unreal',
    meta: 'UE5 · Solo · 3 weeks',
    summary: 'Hitman-inspired stealth sandbox with context interactions and smart enemy AI.',
    highlights: [
      'Tag-driven framework with AI perception and stealth evaluation',
      'Data-driven weapon stats so designers add behaviours without code',
      'Server-authoritative abilities via RPCs and motion-warped animation',
    ],
    tags: ['C++', 'AI', 'Combat', 'Multiplayer'],
    video: 'https://www.youtube.com/watch?v=21OzrVktwzA',
  },
  {
    title: 'Climbing & Parkour System',
    repo: 'ue5-cpp-parkour-climbing-mechanics',
    details: { platform: 'PC', engine: 'Unreal Engine 5', duration: 'University project', team: 'Solo', role: 'Gameplay Programmer' },
    category: 'unreal',
    meta: 'UE5 · C++ · Control Rig',
    summary: 'Zelda / Uncharted-style traversal: free climbing, ledge detection and vaulting.',
    highlights: [
      'Custom climbing movement mode with surface-aligned movement',
      'Height-based vault / climb decisions with Motion Warping',
      'Control Rig IK for hand and foot placement',
    ],
    tags: ['C++', 'Unreal Engine', 'Animation', 'Movement'],
    video: 'https://www.youtube.com/watch?v=07IdJnzLCgQ',
  },
  {
    title: 'Multiplayer Abilities with GAS',
    repo: 'unreal-cpp-combat-GAS',
    details: { platform: 'PC', engine: 'Unreal Engine 5', duration: 'Ongoing', team: 'Duo', role: 'AI / Gameplay Programmer' },
    category: 'unreal',
    meta: 'UE5 · Duo',
    summary: 'Third-person multiplayer ability framework built on the Gameplay Ability System.',
    highlights: [
      'Server-authoritative, replicated abilities and attributes',
      'Animation-driven movement abilities (dash, area attack)',
      'Modular C++ core with a Blueprint-friendly API',
    ],
    tags: ['C++', 'GAS', 'Networking'],
    video: 'https://www.youtube.com/watch?v=w7YCiTBzDqA',
  },
  {
    title: 'Multiplayer FPS Framework',
    repo: 'unreal-cpp-multiplayer-custom-fps',
    details: { platform: 'PC', engine: 'Unreal Engine 5', duration: '1+ month', team: 'Solo', role: 'Gameplay Programmer, Systems Designer' },
    category: 'unreal',
    meta: 'UE5 · Solo · 1+ month',
    summary: 'Fully replicated first-person shooter with Steam sessions.',
    highlights: [
      'Weapons, inventory, health / armour and damage',
      'Team mode, spawning, death and respawn',
      'Steam session integration and replicated UI / FX',
    ],
    tags: ['C++', 'Networking', 'Steam', 'FPS'],
    video: 'https://www.youtube.com/watch?v=wd9-LOUOrDo',
  },
  {
    title: '3D Procedural Maze Generator',
    repo: 'procedural-maze-generator-cpp',
    category: 'tools',
    meta: 'C++ · Qt · OpenGL',
    summary: 'Generates explorable 3D mazes at runtime from user parameters.',
    highlights: [
      "Prim's, Wilson's and DFS-backtracking generation",
      'Compare branching and difficulty across algorithms',
      'Bournemouth University, Animation & Software Eng.',
    ],
    tags: ['C++', 'Algorithms', 'Procedural'],
    video: 'https://www.youtube.com/watch?v=mkv6kwSWQrA',
  },
  {
    title: 'Unreal Editor Automation Toolkit',
    repo: 'unreal-automation-extension-python-qt',
    category: 'tools',
    meta: 'Python · PySide2 · UE5',
    summary: 'Dockable editor tool that automates asset organisation, actor placement and scene clean-up.',
    highlights: [
      'Python + Qt window that runs inside the Unreal editor',
      'One-click batch operations for repetitive pipeline tasks',
      'Bournemouth University, Pipeline & TD assignment',
    ],
    tags: ['Python', 'Qt', 'Tools'],
    video: 'https://www.youtube.com/watch?v=WPzAcpBbWoc',
  },
  {
    title: 'Unity Editor Tools',
    repo: 'custom-editor-tools-unity',
    category: 'unity',
    meta: 'Unity · C#',
    summary: 'Editor extensions that standardise project structure across a team.',
    highlights: [
      'Automated project folder scaffolding',
      'Custom folder icons from the Project window',
      'Shipped as a drop-in .unitypackage',
    ],
    tags: ['C#', 'Unity', 'Tools'],
  },
  // Unity project template: copy, fill in and remove the comment markers.
  // `repo` is optional: without it, set `image` (e.g. '/images/my-game.jpg' in public/images)
  // and `code` or `video` to wherever the project lives (store page, itch.io, YouTube).
  // {
  //   title: 'My Unity Game',
  //   repo: 'my-unity-repo',
  //   category: 'unity',
  //   meta: 'Unity · C# · Solo',
  //   summary: 'One line on what it is.',
  //   highlights: ['What you built', 'The technical challenge', 'The result'],
  //   tags: ['C#', 'Unity'],
  //   video: 'https://www.youtube.com/watch?v=...',
  //   details: { platform: 'PC', engine: 'Unity', duration: '2 months', team: 'Solo', role: 'Gameplay Programmer' },
  //   // Optional write-up shown on design C's project page:
  //   sections: [{ heading: 'How the combo system works', body: 'A paragraph or two.', image: '/images/combo.gif' }],
  // },
].map(p => ({
  ...p,
  image: p.image || `https://raw.githubusercontent.com/RahulChandra99/${p.repo}/main/screenshot.png`,
  code: p.code || (p.repo && `https://github.com/RahulChandra99/${p.repo}`),
}))

export const filters = [
  { id: 'all', label: 'All' },
  { id: 'unreal', label: 'Unreal' },
  { id: 'unity', label: 'Unity' },
  { id: 'tools', label: 'Tools' },
]

export const specialisms = [
  'Gameplay systems architecture',
  'Multiplayer networking & replication',
  'Abilities, weapons & combat',
  'AI behaviour systems',
  '3Cs: camera, character, control',
  'Profiling, memory & multithreading',
  'Editor tools & workflow automation',
  'Code reviews & technical design',
]

export const skills = [
  { group: 'Languages', items: ['C++17', 'C#', 'Python'] },
  { group: 'Engines', items: ['Unreal Engine 5', 'Blueprints', 'GAS', 'Unity', 'AR/VR'] },
  { group: 'Core', items: ['3D math & physics', 'Multithreading', 'Memory management', 'Profiling'] },
  { group: 'Tools', items: ['Perforce', 'Git', 'Jenkins CI/CD', 'Rider', 'Visual Studio', 'Jira', 'Linux'] },
]

export const education = [
  { degree: 'MSc Computer Animation & Visual Effects', school: 'Bournemouth University, UK', year: '2024' },
  { degree: 'BTech Computer Science Engineering', school: 'UPES, India', year: '2021' },
]
