
export const DISASTER_MODULES = [
  {
    id: 'fire',
    title: 'Fire Safety & Prevention',
    type: 'Fire',
    description: 'Learn how to prevent fires and what to do if one starts in your home or school.',
    lessons: 5,
    xp: 500,
    color: 'red',
    icon: 'Flame',
    image: 'https://picsum.photos/seed/fire1/800/600',
    lessonsList: [
      { id: 1, title: "Introduction to Fire Basics", duration: "10 min", videoUrl: "https://www.youtube.com/embed/2H-WtzZbFSQ", description: "A fundamental overview of how fire behaves and the chemistry behind combustion.", completed: false },
      { id: 2, title: "Fire Model in Home Visit", duration: "15 min", videoUrl: "https://www.youtube.com/embed/t9604DkWDms", description: "Learn how to assess and model fire risks during standard residential safety inspections.", completed: false },
      { id: 3, title: "Smoke Alarm Detection", duration: "12 min", videoUrl: "https://www.youtube.com/embed/hRKetFUBCbw", description: "Master the placement and maintenance of smoke alarms for early detection.", completed: false },
      { id: 4, title: "Educator", duration: "20 min", videoUrl: "https://www.youtube.com/embed/UiI0myazZyw", description: "Strategies for educating communities and families on proactive fire prevention.", completed: false },
      { id: 5, title: "Documentor", duration: "15 min", videoUrl: "https://www.youtube.com/embed/D_HDiAV8F0Y", description: "Best practices for documenting fire hazards and safety compliance reports.", completed: false },
    ]
  },
  {
    id: 'flood',
    title: 'Flood Awareness',
    type: 'Flood',
    description: 'Understanding rising waters, emergency kits, and evacuation routes.',
    lessons: 4,
    xp: 400,
    color: 'blue',
    icon: 'Waves',
    image: 'https://picsum.photos/seed/flood1/800/600',
    lessonsList: [
      { id: 1, title: "Introduction to Floods", duration: "12 min", videoUrl: "https://www.youtube.com/embed/xmCYMQp673s", description: "Learn the fundamentals of flood mechanics, types, and the science behind rising waters.", completed: false },
      { id: 2, title: "Understanding Operation of Floods Tool", duration: "18 min", videoUrl: "https://www.youtube.com/embed/n9R_wffGZdI", description: "A technical guide on using simulation tools to model flood paths and impact zones.", completed: false },
      { id: 3, title: "Climate Adaptation Planning", duration: "20 min", videoUrl: "https://www.youtube.com/embed/MjMXNBcz658", description: "Strategic frameworks for long-term community resilience against changing flood patterns.", completed: false },
      { id: 4, title: "Flood Risk and Vulnerability Assessment", duration: "25 min", videoUrl: "https://www.youtube.com/embed/7sJlzCl3ir0", description: "Master the techniques for identifying high-risk areas and vulnerable infrastructure in flood plains.", completed: false },
    ]
  },
  {
    id: 'earthquake',
    title: 'Earthquake Readiness',
    type: 'Earthquake',
    description: 'Drop, Cover, and Hold on. Master the essentials of earthquake safety.',
    lessons: 4,
    xp: 600,
    color: 'orange',
    icon: 'Zap',
    image: 'https://picsum.photos/seed/quake1/800/600',
    lessonsList: [
      { id: 1, title: "Overview of Earthquake", duration: "10 min", videoUrl: "https://www.youtube.com/embed/8edjPWGhHuM", description: "An introductory look at seismic activity and what causes tectonic shifts.", completed: false },
      { id: 2, title: "Earthquake Teaching Tools", duration: "15 min", videoUrl: "https://www.youtube.com/embed/GQQCvsxHtJo", description: "A guide to the tools and resources available for teaching seismic safety and preparedness.", completed: false },
      { id: 3, title: "What To Do During an Earthquake", duration: "12 min", videoUrl: "https://www.youtube.com/embed/G57mxR1X5cI", description: "Essential survival protocols to follow when the shaking starts, including 'Drop, Cover, and Hold On'.", completed: false },
      { id: 4, title: "Potential Earthquake Hazards", duration: "20 min", videoUrl: "https://www.youtube.com/embed/eEc4QVG_Hyg", description: "Identifying and mitigating secondary hazards like falling objects and utility failures.", completed: false },
    ]
  }
];

export const LEADERBOARD_DATA = [
  { id: 1, name: 'Alex Thompson', points: 4500, rank: 1, avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 2, name: 'Sarah Chen', points: 4200, rank: 2, avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 3, name: 'Marcus Miller', points: 3800, rank: 3, avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 4, name: 'Elena Rodriguez', points: 3500, rank: 4, avatar: 'https://picsum.photos/seed/elena/100/100' },
  { id: 5, name: 'Jordan Lee', points: 3100, rank: 5, avatar: 'https://picsum.photos/seed/jordan/100/100' }
];

export const USER_STATS = {
  overallReadiness: 72,
  modulesCompleted: 4,
  quizzesPassed: 12,
  rank: 154,
  achievements: [
    { id: 'first-module', title: 'Beginner Responder', icon: 'Award' },
    { id: 'quiz-master', title: 'Quiz Whiz', icon: 'Trophy' }
  ]
};
