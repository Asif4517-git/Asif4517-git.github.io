/* Project case-study content.
   Only claims backed by the live sites, public repos or the portfolio's
   original copy are included. Statuses are deliberately explicit. */
window.PROJECT_DETAILS = {
  jln: {
    kicker: "Interactive 3D · Simulation",
    title: "JLN Stadium, Kochi — 3D Drone Simulation",
    status: "Live project",
    statusType: "live",
    summary: "A real-time, browser-native reconstruction of the Jawaharlal Nehru International Stadium in Kaloor, Kochi — home of Kerala Blasters — with a running 11-a-side match and the Manjappada yellow wall.",
    built: [
      "A two-tier oval bowl with 24 seating bays, a scalloped PTFE membrane roof, floodlight masts and a 105 × 68 m pitch with goals, nets, dugouts, LED boards and a big screen.",
      "Kaloor surroundings traced from OpenStreetMap: Stadium Road, Stadium Round, the Old NH 47, the Thevara–Perandoor canal, the Kochi Metro viaduct and three real metro stations — plus thousands of building footprints and road segments.",
      "A match simulation with passing, dribbling, tackles, keeper saves, throw-ins, goals, a compressed match clock and a live score in the HUD and on the stadium screens.",
      "An instanced Manjappada crowd with raised arms, animated flags and Malayalam banners.",
      "Drone, orbit and cinematic camera modes, viewpoint shortcuts, day / sunset / night lighting, keyboard controls and a touch D-pad on phones."
    ],
    stack: ["three.js r149", "Procedural geometry", "InstancedMesh", "Canvas textures", "OpenStreetMap data", "Vanilla JS"],
    learned: "How to build a big scene out of code instead of downloaded models — generating geometry and textures at runtime, keeping draw calls under control with instancing, and bundling the whole thing into one self-contained HTML file that needs no network calls.",
    note: "This grew out of an idea for an interactive 3D simulation of a real local place. It is an artistic reconstruction from map data, not a photorealistic digital twin and not a live map feed.",
    shots: [
      { src: "images/jln-01.webp", cap: "Drone overview of the stadium and Kaloor surroundings" },
      { src: "images/jln-02.webp", cap: "Match view inside the bowl" },
      { src: "images/jln-03.webp", cap: "Manjappada yellow wall and banners" },
      { src: "images/jln-04.webp", cap: "Night lighting mode" },
      { src: "images/jln-05.webp", cap: "Goal moment on the big screen" }
    ],
    links: [
      { label: "Open live simulation", href: "https://asif4517-git.github.io/JLN-STADIUM-KOCHI-3D-/", primary: true },
      { label: "View source on GitHub", href: "https://github.com/Asif4517-git/JLN-STADIUM-KOCHI-3D-" }
    ]
  },

  chemlab: {
    kicker: "Web · Education",
    title: "ChemLab Kerala",
    status: "Live project",
    statusType: "live",
    summary: "An educational website for the Kerala Class 10 chemistry syllabus: learn a concept, try a virtual experiment, then test yourself — all in a clean, dark dashboard.",
    built: [
      "An Interactive Lab with 8 animated virtual experiments. Each one lists apparatus, chemicals, procedure, equation, observation, explanation and a safety note.",
      "25 chemical reactions plus a Balance Equation game.",
      "An interactive periodic table with all 118 elements — electronic configuration, group, period, block, properties and uses — with colour-by-category filters and search.",
      "7 chapters of the Kerala Class 10 syllabus, a 90-question Quick Quiz in three difficulty levels, revision mode and a daily chemistry challenge.",
      "A progress dashboard that tracks chapters studied, questions mastered and experiments tried, saved locally in the browser."
    ],
    stack: ["React / Next.js", "Frontend UI", "Interactive simulations", "Local progress", "CSS"],
    learned: "Turning a textbook into something you can click: structuring learning content into modules, making progress visible, and keeping explanations readable instead of burying them in decorative UI.",
    note: "Progress is stored on the device in the browser. No accounts, authentication or server-side user database are needed for the learning experience.",
    shots: [
      { src: "images/previews/chemlab-home.webp", cap: "Home dashboard with the six learning modules" },
      { src: "images/previews/chemlab-lab.webp", cap: "Interactive Lab — experiment cards and chapters" },
      { src: "images/previews/chemlab-periodic.webp", cap: "Interactive periodic table with all 118 elements" },
      { src: "images/previews/chemlab-chapters.webp", cap: "Chapter Explorer for the Class 10 syllabus" }
    ],
    links: [
      { label: "Open ChemLab Kerala", href: "https://chemlab-kerala.vercel.app/", primary: true }
    ]
  },

  nes: {
    kicker: "Embedded · Gaming",
    title: "ESP32 Handheld Game Console",
    status: "Hands-on prototype",
    statusType: "built",
    summary: "A custom handheld retro-gaming experiment built around an ESP32 development board — a complete device, not just an emulator installed on a screen.",
    built: [
      "An ESP32 DevKit-style board driving a 2.4-inch ILI9341 TFT display (no touch).",
      "Physical game-console-style buttons, SD-card storage and custom wiring and pin mapping.",
      "A MAX98357A I²S audio amplifier with a speaker for game audio.",
      "Experimentation with ESP32 NES emulation firmware, including Nofrendo / esp32-nesemu.",
      "A rechargeable battery power system with charging and voltage-boosting components."
    ],
    stack: ["ESP32 DevKit", "Arduino C++", "ILI9341 TFT", "MAX98357A I²S", "SD card", "TP4056 + boost"],
    learned: "Display drivers, button input, SD access, I²S audio and power delivery all have to agree before a game boots. Most of the work was integration and debugging, not writing game logic.",
    note: "This is a prototype. I don't publish battery runtime, emulator compatibility lists or benchmarks because I haven't measured them properly.",
    shots: [],
    links: []
  },

  wled: {
    kicker: "Hardware · RGB",
    title: "ESP32 + WLED Smart RGB Lighting",
    status: "Ongoing experiment",
    statusType: "ongoing",
    summary: "A smart-lighting and PC lighting-control experiment: an ESP32 running WLED, driven by a Python desktop dashboard that can follow the screen, music and PC hardware stats.",
    built: [
      "An ESP32 running WLED with addressable LED strips and effect palettes, controlled over the local network.",
      "A Python / Flask dashboard with a web UI for modes, palettes, brightness and settings — no cloud service involved.",
      "DDP pixel output over UDP for the live modes, so effects can update at a much higher frame rate than HTTP requests allow.",
      "Performance, Music, Screen, Custom and Off modes: CPU / RAM / GPU load ramps, FFT-based audio reactivity, dominant-colour and edge-zone screen capture, and WLED's own effects.",
      "Screen capture, audio capture, system monitoring and WLED API modules split into their own files so each experiment can be tested independently."
    ],
    stack: ["ESP32 + WLED", "Python / Flask", "DDP (UDP)", "NumPy / Pillow", "soundcard", "psutil / NVML", "JavaScript UI"],
    learned: "Ambient lighting is a software problem too: colour extraction, frame rate, network protocols and effect design all decide whether the result feels alive or laggy.",
    note: "The mode list comes from the project's own README. Some behaviour still depends on the exact hardware and setup, so I treat the PC-stat and audio features as ongoing experiments rather than a finished product.",
    shots: [
      { src: "images/pc-setup.webp", cap: "The real desk this lighting was built for" }
    ],
    links: [
      { label: "View the controller source", href: "https://github.com/Asif4517-git/Esp-32-led-controller", primary: true }
    ]
  },

  schooltv: {
    kicker: "Web · School tech",
    title: "School Information TV Display",
    status: "Built",
    statusType: "built",
    summary: "A web-based information display for a school screen, built with Vite in a gold-and-dark theme with Malayalam text.",
    built: [
      "A full-screen layout with school branding, a live clock and date.",
      "A scrolling information ticker and a slideshow-style content playlist.",
      "Malayalam Unicode text with careful typography and contrast for reading from a distance."
    ],
    stack: ["Vite", "HTML / CSS", "JavaScript", "Malayalam Unicode"],
    learned: "On a wall display, readable information design matters more than clever animation: big type, calm motion, high contrast and a clear hierarchy.",
    note: "Content is authored locally for the display. There is no live school data feed or backend attached to it.",
    shots: [],
    links: []
  },

  sensor: {
    kicker: "Embedded · Sensors",
    title: "School Multi-Sensor Dashboard",
    status: "School project",
    statusType: "built",
    summary: "A school electronics project made by repurposing an earlier automatic-gate prototype into a small multi-sensor monitoring dashboard.",
    built: [
      "Microcontroller-based electronics reused from the earlier gate experiment.",
      "MQ-135 air-quality / gas sensing with analog sensor readings.",
      "An I²C LCD displaying readings in a compact dashboard-style layout."
    ],
    stack: ["Microcontroller", "MQ-135", "Analog input", "I²C LCD", "C++"],
    learned: "Repurposing an existing prototype is faster than starting over, and an analog sensor reading is only useful once you understand what it does — and does not — tell you.",
    note: "These are exploratory analog readings, not calibrated measurements or certified air-quality monitoring.",
    shots: [],
    links: []
  },

  radio: {
    kicker: "Audio · Networking",
    title: "ESP32 Internet Radio",
    status: "Built",
    statusType: "built",
    summary: "Streaming internet radio on an ESP32 with I²S playback, a speaker and an amplifier — a small device with a surprising number of failure modes.",
    built: [
      "Wi-Fi connected ESP32 pulling audio stream URLs from the internet.",
      "I²S audio output into an amplifier and speaker.",
      "Iteration on stream URL reliability, DNS behaviour, audio quality and interference."
    ],
    stack: ["ESP32", "I²S audio", "Wi-Fi", "Amplifier", "Arduino C++"],
    learned: "Real-world debugging: stream URLs die, DNS fails, and a noisy ground loop can ruin otherwise working code. Those problems taught more than the happy path.",
    shots: [],
    links: []
  },

  marauder: {
    kicker: "Wireless · Learning",
    title: "ESP32 Wi-Fi Marauder Exploration",
    status: "Ongoing experiment",
    statusType: "experiment",
    summary: "An authorised, educational exploration of ESP32-based Wi-Fi firmware and wireless-networking concepts in my own lab.",
    built: [
      "Experimenting with ESP32 boards and firmware built around their Wi-Fi radios.",
      "Learning how firmware, hardware and network frames relate to each other.",
      "Studying security tooling from a defensive, educational point of view."
    ],
    stack: ["ESP32", "Wi-Fi", "Firmware", "Networking concepts"],
    learned: "A tiny board with a radio can teach a lot about how networks advertise themselves — and why responsible, authorised testing matters.",
    note: "This is an ongoing learning experiment, not a finished tool. I don't claim a specific board, feature set or test result, and nothing here is tested against networks I don't own or have explicit permission to use.",
    shots: [],
    links: []
  },

  airchat: {
    kicker: "Android · Full-stack",
    title: "AirChat — Android Chat Experiment",
    status: "Learning build",
    statusType: "built",
    summary: "A native Android messenger experiment with a Node.js relay server — built to learn mobile architecture, realtime messaging and WebRTC calls by actually implementing them.",
    built: [
      "A Kotlin / Material 3 Android app with 1:1 chat, replies, reactions, temporary chats and search.",
      "A WebRTC call stack with a server-side call state machine, foreground service and a full-screen incoming call UI.",
      "A Node.js backend for chat relay and call signalling, with an admin console and end-to-end tests.",
      "Google Sign-In for accounts and a signed APK built from the source project."
    ],
    stack: ["Kotlin", "Material 3", "WebRTC", "Node.js", "Room cache", "Git"],
    learned: "Mobile apps are systems, not screens: optimistic sends, offline outboxes, reconnect logic and call state all have to work together before a chat feels reliable.",
    note: "This is a self-directed learning project with a built APK and a public repo — not a published store app, and I make no claims about active users.",
    shots: [],
    links: [
      { label: "View the AirChat repo", href: "https://github.com/Asif4517-git/whatslite", primary: true }
    ]
  },

  pcsetup: {
    kicker: "DIY · Workspace",
    title: "Custom RGB PC & Desk Setup",
    status: "Personal build",
    statusType: "built",
    summary: "My real workspace: a compact black desk, a PC tower and monitor, hand-made foam wall art and ESP32/WLED ambient lighting everywhere.",
    built: [
      "A black PC tower and monitor in a compact desk arrangement, with open books and everyday gear on the desk.",
      "DIY foam-based wall art: a Batman-style emblem, an ROG-inspired badge and a Spider-Man symbol.",
      "ESP32 / WLED ambient RGB behind the monitor, around the tower and under the desk.",
      "Experiments with screen-dominant colours, music-reactive effects and PC hardware stats as lighting input."
    ],
    stack: ["ESP32", "WLED", "Addressable LEDs", "Foam art", "DIY wiring"],
    learned: "A workspace is a design project. Placement, diffusion and restraint matter more than simply adding more LEDs.",
    note: "The photo above is my actual setup. The screen, music and hardware-stat driven lighting features are experiments rather than finished, always-on features.",
    shots: [
      { src: "images/pc-setup.webp", cap: "My desk at night with the ambient lighting on" }
    ],
    links: []
  },

  billing: {
    kicker: "Software · Early experiment",
    title: "Billing Software Experiment",
    status: "Early experiment",
    statusType: "experiment",
    summary: "An early software exploration of products, prices, calculations and transactions — the kind of program that could actually be used in a small shop.",
    built: [
      "Product and price entry with basic calculation logic.",
      "A bill / transaction view to see what was added and what the total is.",
      "Simple CRUD-style data handling and a working UI."
    ],
    stack: ["UI", "Business logic", "CRUD"],
    learned: "Software that sits inside everyday work has to be boringly reliable: totals must be right and the interface has to be obvious.",
    note: "An early experiment to learn the logic, not a finished commercial billing product.",
    shots: [],
    links: []
  },

  rc: {
    kicker: "Origin · Kid builder",
    title: "RC Cars, Mods & First Machines",
    status: "Where it started",
    statusType: "built",
    summary: "Long before ESP32 and websites, I was taking remote-control cars apart — modifying chassis, motors and bodies and building my own cars, buses and trucks.",
    built: [
      "Modified RC car chassis, motors and bodies.",
      "Home-made DIY cars, buses and trucks from available parts.",
      "A lot of broken plastic and a lot of reassembly."
    ],
    stack: ["Mechanics", "Motors", "DIY builds"],
    learned: "The “can I build it?” habit started here. Hardware first, always — and taking things apart is a perfectly good way to learn.",
    shots: [],
    links: []
  }
};
