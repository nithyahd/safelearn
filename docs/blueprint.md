# **App Name**: SafeLearn

## Core Features:

- User Management & Authentication: Secure user registration and login for Students, Teachers, and Administrators using Firebase Authentication (Email/Password, Google).
- Interactive Learning Modules: Students can access structured learning modules on various disaster types (e.g., Earthquake, Flood, Fire) with embedded interactive quizzes to reinforce understanding. Modules, quizzes, and associated media are stored in Firestore and Storage.
- Preparedness Tracking & Gamification: Students track their preparedness scores, earn points for completed modules and quizzes, unlock badges for achievements, and view their ranking on a global leaderboard, fostering engagement and competition.
- Admin Content Management: Administrators can securely add, edit, and publish disaster learning modules, quiz questions, and manage associated educational resources directly from their dashboard.
- Emergency Broadcast System: Administrators can initiate real-time emergency broadcast alerts to all users via Firebase Cloud Messaging, with an accessible history log of past alerts in Firestore.
- Virtual Disaster Drill Simulation: Engaging scenario-based decision games allowing students to practice and make critical choices in simulated disaster situations to improve response readiness.
- AI-Powered Local Risk Tool: An AI tool that provides a simple risk level indicator (Low/Medium/High) to users based on their general location, offering personalized awareness.

## Style Guidelines:

- Primary color: Vibrant and energetic orange (#EF7215). This warm hue balances urgency with engagement, setting a dynamic tone for the platform while drawing attention to key interactive elements. (HSL: 25, 85%, 55%)
- Background color: A subtle, warm off-white (#F9F5F2) as the main canvas. Heavily desaturated but derived from the primary's hue, it avoids a stark white screen and provides visual depth without being distracting. (HSL: 25, 20%, 95%)
- Accent color: Bright and inviting yellow (#F9D124). Analogous to the primary, this vibrant yellow adds dynamism and contrast, ideal for highlighting progress, gamification elements, and key informational badges. (HSL: 55, 90%, 70%)
- Gradients and content-specific colors: Incorporate smooth gradients using tones of blue, orange, purple, and red. Disaster types will be color-coded: Fire with red/orange, Flood with blue, and Earthquake with yellow/orange to aid recognition.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, techy, and precise aesthetic, aligning with an advanced EdTech platform. Body font: 'Inter' (sans-serif) for superior readability, neutrality, and clear information presentation across all devices.
- Utilize a suite of modern, clean icons and bespoke illustrated graphics specifically depicting various disaster scenarios (fire, flood, earthquake). Design custom achievement badges and game-like indicators for a compelling visual experience.
- Implement a clean dashboard layout featuring prominent sidebar navigation for intuitive access to features. The UI will extensively use a card-based design with large rounded corners and glassmorphism or soft shadow effects for a premium, modern feel. Progress rings, animated bars, and attractive ranking cards for leaderboards will enhance interactivity. The layout is mobile-first responsive, ensuring an optimized experience across all devices.
- Integrate subtle yet impactful micro-interactions: buttons and cards will animate slightly on hover, indicating interactivity. Employ smooth page transitions, elegant loading animations or skeleton loaders. Gamification elements like XP points, badge unlocks, and preparedness scores will feature engaging, fluid animations to celebrate user achievements.
- Preparedness Analytics Dashboard: Include visual charts showing readiness trends, module completion rates, and risk-level distribution across students for administrators.