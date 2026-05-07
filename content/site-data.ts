// ============================================================
// LATERALWORKS — MASTER CONTENT FILE
// Edit this file to update all site content.
// ============================================================

export const siteConfig = {
  name: "lateralworks",
  tagline: "accelerated development",
  founded: "Silicon Valley · Founded 1988",
  email: "contact@lateralworks.com",
  phone: "",
  address: "Silicon Valley, CA",
  copyright: "© lateralworks. all rights reserved.",
};

export const nav = {
  links: [
    { label: "Methodology", href: "/methodology" },
    { label: "Software", href: "/software" },
    { label: "Academy", href: "/academy" },
    { label: "Results", href: "/results" },
    { label: "Consulting", href: "/consulting" },
    { label: "Ideas", href: "/ideas" },
    { label: "Papers", href: "/papers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Start a Conversation", href: "/contact" },
};

export const home = {
  hero: {
    headline: "We accelerated the team that built the iPod.",
    body: "lateralworks has been delivering fast-time-to-market results on advanced technology programs since 1988. Our FTTM methodology, fastProjectAI software suite, and structured training have been proven on 200+ projects — from Sony's first PlayStation to $7 billion semiconductor fabs.",
    cta1: { label: "See Our Results", href: "/results" },
    cta2: { label: "Explore FTTM", href: "/methodology" },
  },
  stats: [
    { number: "200+", label: "FTTM Projects", sub: "Worldwide since 1988" },
    { number: "36", label: "Years of Research", sub: "Continuously refined" },
    { number: "$7B+", label: "Programs Accelerated", sub: "Semiconductor to software" },
    { number: "$5M", label: "Per Day Saved", sub: "GlobalFoundries Fab8" },
  ],
  clients: {
    label: "Trusted by teams at",
    logos: [
      "GlobalFoundries",
      "Charles Schwab",
      "Philips",
      "Texas Instruments",
      "Intel",
      "Applied Materials",
      "Tektronix",
      "Alta Devices",
      "Sony",
    ],
  },
  pillars: {
    sectionLabel: "What We Do",
    headline: "Four ways to get products to market faster.",
    items: [
      {
        number: "01",
        category: "Methodology",
        title: "The FTTM Framework",
        body: "Thirty-six years of original research into how the fastest technology teams in the world actually work. Not theory — observed best practices from 500+ people, continuously refined through hundreds of global engagements.",
        link: { label: "Explore the Framework →", href: "/methodology" },
      },
      {
        number: "02",
        category: "Software",
        title: "fastProjectAI Suite",
        body: "fastProjectAI, fastDecisionAI, and Cost-of-delayAI — Microsoft Office add-ins that operationalize FTTM methodology. The Wigglechart alone has changed how teams see schedule acceleration. Version 4.12, actively maintained.",
        link: { label: "See the Software →", href: "/software" },
      },
      {
        number: "03",
        category: "Academy",
        title: "Learn FTTM",
        body: "Structured courses built from 80+ sequential modules covering Critical Path Method, Refresh Planning, Decision Modeling, Portfolio Management, and more. The methodology, now self-paced.",
        link: { label: "Start Learning →", href: "/academy" },
      },
      {
        number: "04",
        category: "Consulting",
        title: "Engagement Services",
        body: "We join your team, not just advise it. Multi-month partnerships that have delivered first silicon ahead of schedule on $7B fabs, accelerated $15M in IT savings, and shipped products that defined entire categories.",
        link: { label: "How We Engage →", href: "/consulting" },
      },
    ],
  },
  results: {
    sectionLabel: "Proven Results",
    headline: "Programs that changed industries.",
    cta: { label: "All Results →", href: "/results" },
    items: [
      {
        industry: "Semiconductor",
        client: "GlobalFoundries",
        headline: "$5M/day saved. First silicon ahead of schedule.",
        body: "Fab8 in Malta, NY — a $7B greenfield fab. lateralworks joined as one of the initial 5-person planning team and stayed through first silicon, 2 weeks ahead of target.",
        link: { label: "Read the full story →", href: "/results#globalfoundries" },
      },
      {
        industry: "Consumer Electronics",
        client: "Philips → iPod",
        headline: "The methodology that built the iPod.",
        body: "The engineering executive who led the Philips Velo PDA project — built using FTTM — later applied these same practices at Apple to create the iPod, iPhone, and iPad. His name is Tony Fadell.",
        link: { label: "Read the full story →", href: "/results#philips" },
      },
      {
        industry: "Enterprise IT",
        client: "Charles Schwab",
        headline: "$15M annual savings. Program of the Year.",
        body: "IT Infrastructure Rationalization — 1,100 servers, 145 applications, 3-year program. lateralworks structured the portfolio, accelerated the savings, and helped it win Schwab's internal program of the year.",
        link: { label: "Read the full story →", href: "/results#schwab" },
      },
    ],
  },
  ideasPreview: {
    sectionLabel: "Ideas Library",
    cta: { label: "Browse All Ideas →", href: "/ideas" },
  },
  academyCta: {
    badge: "New",
    headline: "The FTTM Academy — structured learning for accelerated teams.",
    body: "80+ sequential modules covering everything from Critical Path basics to advanced Macro-Micro Roll-up. Concept → Function → Practice. The same knowledge that powers 200+ global engagements, now self-paced.",
    cta: { label: "Explore the Academy", href: "/academy" },
    modules: [
      { product: "fastProjectAI", count: "40+ modules", topic: "Critical Path & Scheduling" },
      { product: "fastDecisionAI", count: "20+ modules", topic: "Decision Modeling" },
      { product: "Cost-of-delayAI", count: "10+ modules", topic: "Business Case Modeling" },
      { product: "FTTM Concepts", count: "191 articles", topic: "Methodology & Strategy" },
    ],
  },
  finalCta: {
    headline: "Your product deserves to ship on time.",
    body: "Whether you need a consulting engagement, the fastProjectAI software suite, structured training, or just want to understand the FTTM framework — let's start a conversation.",
    cta1: { label: "Start a Conversation", href: "/contact" },
    cta2: { label: "See Results First", href: "/results" },
  },
};

export const team = {
  sectionLabel: "The Team",
  headline: "Not boutique. A network of world-class specialists.",
  cta: { label: "Meet the Full Team →", href: "/about" },
  members: [
    {
      name: "Neal Mitchell",
      role: "Founder",
      photo: "/images/team/neal-mitchell.jpg",
      bio: "200+ FTTM projects · Co-founded tech startup with exit · Original FTTM Research Team Member",
      detailBio: [
        "Neal founded lateralworks in 1988 and has led 200+ FTTM engagements across semiconductors, consumer electronics, automotive, defense, and enterprise IT. He is an original member of the FTTM research team that initiated the practice's foundational benchmarking study in 1990, and has spent the 36 years since translating those findings into running programs.",
        "His track record spans some of the most technically ambitious programs of the past three decades. At GM's SATURN — a $6B program — he stood up the Program Management System that re-engineered GM's five-year product lifecycle into 36 months, pulling 18 months out of the original plan. At Digital Equipment Corporation he led the MicroVAX engagement that delivered $60M in savings and shipped DEC's first product ever to ship ahead of schedule, then expanded into a five-year program reaching 17 product lines. At IBM Austin he restructured the $500M RS-6000 program — 175 separate projects — and pulled 12 months of schedule variance out of the plan; the team won IBM's engineering excellence awards.",
        "Before lateralworks, Neal co-founded Mitchell Management Systems, a software and management consulting firm that grew to $20M in revenue at 50% annual growth before being sold to a NYSE company in 1987. He has lectured on FTTM and program management to government and private-sector audiences across Asia, the Middle East, and Europe. Other engagements include Philips, Sun Microsystems, Tektronix, LSI Logic, Silterra Malaysia, Charles Schwab, the U.S. Navy Seabees, BMW, and the Australian Department of Defense.",
      ],
    },
    {
      name: "Mark Edmonds, Ph.D.",
      role: "Founder",
      photo: "/images/team/mark-edmonds.jpg",
      bio: "Physics Ph.D. · Directed 100+ person programs at Philips, National Semiconductor/Texas Instruments",
      detailBio: [
        "Mark joined lateralworks as a Founder following two careers at Philips: six years in Philips Research Laboratories managing the next-generation product programs, and eight years in the Product Concept and Application Lab running systems development where time-to-market was the critical constraint. He earned his BSc in Physics and PhD in real-time signal processing at the University of London.",
        "At Philips Research, Mark led the team that developed Europe's third-generation UMTS prototype as part of the Race II program — 14 companies across 9 countries, hundreds of people — and demonstrated it on time. The same work led to W-CDMA, Japan's 3G standard, and Mark went on to represent Philips at the ETSI SMG5 international standards committee. He later managed Philips Semiconductor's 3G development program — a 120-person effort spanning Germany, the Netherlands, two teams in France, and two teams in the USA.",
        "National Semiconductor recruited Mark to rescue an ailing Bluetooth program with a five-site team across California, Washington, Scotland, Germany, and Denmark. First samples landed in eight months and the team became first to market with a car-audio-compatible Bluetooth system, winning customers including Hewlett-Packard. Subsequent FTTM engagements include Zarlink's 12-channel 2.5 Gbps module that won Cisco as a customer after coming in ahead of schedule, RFMD's WiFi PCI Express recovery, and chipset programs ranging from VDSL to single-chip WiFi to LCD-TV.",
      ],
    },
    {
      name: "Bob Biddinger",
      role: "Founder Emeritus",
      photo: "/images/team/bob-biddinger.jpg",
      bio: "Early HP employee · Seagate founding team · Original FTTM Research Team Member · Prolific speaker and Silicon Valley company builder",
      detailBio: [
        "Bob is a Founder Emeritus of lateralworks and the original architect of the FTTM benchmarking study that initiated the practice. In 1992 he launched the landmark best-practices study across thirteen major high-technology organizations to identify the applied business practices of the world's fastest companies and teams — the 33 discrete practices that emerged became the foundation of FTTM and continue to anchor the methodology today.",
        "Before founding the practice, Bob was an early Hewlett-Packard employee and a member of the founding team at Seagate Technology, where he served as Vice President of Administration and Human Resources. He held executive operating positions at Memorex Corporation and Lockheed Missiles & Space Company, has served on the faculty of California universities, and has spoken publicly on Fast-Time-to-Market practices throughout his career.",
        "His consulting and management engagements span IBM, Cypress Semiconductor, 3Com, General Electric, and the SATURN Corporation. At LSI Logic he established cross-functional teams and a new product development structure that delivered next-generation silicon — a $100M+ technology program — in 18 months from concept to first customer design, more than a 50% cycle time reduction. The 500K technology that resulted gave Sony a time-to-market advantage that effectively eliminated a competitor in the multimedia market. At Conner Peripherals, during the company's run as the fastest-growing in U.S. history, he supervised the development of the \"Launch Team\" concept that cut development cycle time to under six months from concept to volume.",
      ],
    },
    {
      name: "Alan E. Rush, Ph.D.",
      role: "Associate",
      photo: null,
      bio: "Ph.D. · Stanford Business School · Fast Operating Strategy Developer · Original FTTM Research Team Member",
      detailBio: [
        "Alan is one of the original members of the FTTM research team and a developer of the Fast Operating Strategy framework that sits alongside FTTM as part of the lateralworks methodology. With a Ph.D. and a Stanford Business School background, he brings 30+ years of experience advising senior executives who oversee portfolios of new product introductions — typically through short, high-leverage engagements built around 60–90 minute one-on-one sessions with the executive.",
        "His track record across program acceleration is substantial. The majority of project schedule reductions on his consulting engagements have come in around one-third; one achieved a two-thirds reduction. The major accelerations have been in computer peripherals, disk storage, mainframe computers, operating system software, and directional drilling tools for the oil and gas industry.",
        "Alan's clients have included Alcoa, Allied Signal, Boeing, Emerson Electric, FMC, General Electric, General Signal, Hewlett-Packard, Hitachi, Lockheed, Tandem, Tektronix, and Smith International, as well as a range of startups and small businesses. Beyond FTTM, his consulting addresses Total Quality Management Systems, Activity-Based Cost Management, Process Improvement, CEO 90-day Action Planning, Strategic Alliances, and IT Strategy.",
      ],
    },
    {
      name: "James R. Schmook, Ph.D.",
      role: "Associate",
      photo: "/images/team/james-schmook.jpg",
      bio: "Commander, U.S. Navy (Ret.) · Ph.D. · Strategy & coaching · Original FTTM Research Team Member",
      detailBio: [
        "Jim is an original member of the FTTM research team — a research partner in the Lateral Work Systems best-practice study of the early 1990s — and brings strategy and coaching experience built across a 26-year U.S. Navy career and three decades of corporate consulting. He retired as a Commander, U.S. Navy. His Ph.D. in Organizational Behavior is from U.S. International University in San Diego, with a Master's in Learning Theory from San Jose State and additional doctoral work at UC Santa Barbara and George Washington University.",
        "Before consulting, Jim served as Vice President of Quality and Vice President of Business Development at a Fortune 500 manufacturing company in the oil services industry, and as Adjunct Professor of Management at Pepperdine University's M.A. program. His consulting practice covers FTTM, e-commerce implementation, Activity-Based Cost Management, Fast Operating Model deployment, process improvement, and strategic alliances.",
        "His engagements range across commercial and government clients. In the commercial sector: Ford, Samsung, Johnson & Johnson, IBM, Tektronix, Smith International, National Semiconductor, Bausch & Lomb, and SEMATECH. In the government and defense sector: a multi-year ABC and process improvement engagement across the Army's Installation Management Agency in Europe and the Pacific, work with the U.S. Marine Corps on stateside base operations effectiveness, and a long tenure as a project planning trainer for USAID conducting workshops in Asia, Africa, Latin America, and the Middle East.",
      ],
    },
    {
      name: "Barbara Grant, Ph.D.",
      role: "Associate",
      photo: "/images/team/barbara-grant.jpg",
      bio: "VC-backed startup CEO · VC Fund Manager · IBM executive · Original FTTM Research participant (at IBM)",
      detailBio: [
        "Barbara joined lateralworks bringing three decades of executive leadership across major corporations and Silicon Valley startups. She participated in the original FTTM research while at IBM, where she spent 21 years rising to Vice President and General Manager of the Data Storage Division. Over the course of her IBM career, she led teams that developed and introduced more than 50 new IBM products — including new lithographic materials for semiconductor manufacturing, TFT LCD technology used in the ThinkPad product line, high-density magnetoresistive heads for hard disk drives, and the technologies behind the world's highest-capacity tape drives and storage subsystems. She is the inventor of eight patents and numerous technical publications across multiple technology sectors. In 1996, Women in Technology International elected her to its inaugural Hall of Fame class for her leadership and technology development at IBM.",
        "After IBM, Barbara was CEO of Siros Technologies, a Silicon Valley startup developing optical components and subsystems for the communications and storage markets. Under her leadership, Siros raised more than $60M from top-tier venture capital and corporate investors. She is currently a Partner at American River Ventures, a venture capital fund managing more than $100M in early-stage technology investments.",
        "Her board experience spans technology and academic institutions: she serves on the boards of Agoura Technologies, Integrated Materials, Triformix, and Xponent Photonics, and on the Sacramento Area Region Technology Alliance. She is also a member of the University of California, Davis Board of Visitors and its Research Advisory Board. Barbara holds a BS in chemistry from Arizona State University and a PhD in organic chemistry from Stanford University.",
      ],
    },
    {
      name: "Cheryl Beninga",
      role: "Associate",
      photo: "/images/team/cheryl-beninga.jpg",
      bio: "Former Intel executive · VC investor/fund manager · 40+ portfolio companies",
      detailBio: [
        "Cheryl brings 20+ years of venture capital investment experience working with leading technology investors, including Intel Capital and GE Ventures. Across her investing career she has been responsible for billions of dollars in venture investments, including over $50M in early-stage technology investments that yielded more than $2B in returned value, working at every stage from Seed round through IPO and across M&A transactions.",
        "She began her career at Chevron and Hewlett-Packard before joining Intel in the early 1990s. At Intel she moved from product marketing into Intel Capital, where she served as Director and Senior Investment Manager from 1998 to 2006, with portfolio responsibility across stages and sectors. She subsequently joined American River Ventures as Managing Director, where her investments included SynapSense — a Folsom-based data center power management company that successfully exited to Panduit. She is currently Managing Director of Beninga Advisors, the strategy and financing advisory firm, and Wai-Mohala Ventures.",
        "In 2017, Cheryl co-founded FourthWave, a non-profit accelerator program for women-led, high-potential technology companies. FourthWave alumnae have collectively raised more than $150M in venture capital. She also serves on the Board of Advisors for the Carlsen Center for Innovation & Entrepreneurship at California State University Sacramento. She holds an MBA in General Management from Harvard Business School and a BS in Finance from Indiana University's Kelley School of Business. In 2025 she was named an honoree of the Sacramento Inno Awards.",
      ],
    },
  ],
};

export const methodology = {
  hero: {
    label: "Methodology",
    headline: "The FTTM Framework",
    subhead: "Thirty-six years of original research. Not theory.",
    body: "Fast-Time-to-Market (FTTM) is a body of research and methodology developed from observing 500+ people on hundreds of the world's fastest-moving technology programs. What separates the teams that ship on time — or early — from those that don't is not talent. It's how they work.",
  },
  sections: [
    {
      label: "Research Foundation",
      headline: "A competency-based research program, not a consulting framework",
      body: "We conduct ongoing research into the best practices of highly successful new product development teams, and we continuously maintain a current best-practice experience base. This research forms the core of our consulting practice — keeping us at the cutting edge of new thinking before, in many cases, it is documented by the academic community.",
    },
    {
      label: "Core Principles",
      headline: "What we've learned in 36 years",
      items: [
        {
          title: "The Critical Path is rarely where you think it is",
          body: "Most teams focus on the obvious critical path. It's the second or third — the one hiding in plain sight — that derails programs.",
        },
        {
          title: "Buffer is not slack — it is a managed resource",
          body: "Positive and negative buffer in a schedule are fundamentally different things that must be tracked and managed with rigor.",
        },
        {
          title: "Speed comes from decision quality, not decision speed",
          body: "The fastest teams make better decisions, not faster decisions. fastDecisionAI methodology addresses this directly.",
        },
        {
          title: "Portfolio drag is the silent schedule killer",
          body: "Too many active projects starves each one of resources. FTTM Portfolio methodology identifies and eliminates this drag.",
        },
      ],
    },
  ],
};

export const software = {
  hero: {
    label: "Software",
    headline: "fastProjectAI Suite",
    subhead: "FTTM methodology, operationalized in Microsoft Office.",
    body: "fastProjectAI, fastDecisionAI, and Cost-of-delayAI are Office add-ins that bring FTTM methodology directly into the tools your team already uses. Version 4.12, actively maintained.",
  },
  products: [
    {
      id: "fastproject",
      name: "fastProjectAI",
      tagline: "Critical Path & Schedule Acceleration",
      body: "fastProjectAI implements the FTTM approach to project scheduling — including the Wigglechart, which visualizes schedule acceleration in a way that standard Gantt charts simply cannot. 40+ training modules.",
      modules: "40+ modules",
      features: [
        "Wigglechart visualization",
        "Critical Path identification",
        "Buffer management",
        "Refresh planning",
        "Macro-Micro Roll-up",
      ],
    },
    {
      id: "fastdecision",
      name: "fastDecisionAI",
      tagline: "Decision Quality & Modeling",
      body: "fastDecisionAI brings structured decision analysis to the program level. Teams that make better decisions accelerate faster. 20+ training modules.",
      modules: "20+ modules",
      features: [
        "Decision quality framework",
        "Structured analysis templates",
        "Risk and uncertainty modeling",
        "Decision documentation",
        "Portfolio decision alignment",
      ],
    },
    {
      id: "fastroi",
      name: "Cost-of-delayAI",
      tagline: "Business Case & ROI Modeling",
      body: "Cost-of-delayAI builds rigorous business cases for technology programs — quantifying the value of schedule acceleration in terms leadership understands. 10+ training modules.",
      modules: "10+ modules",
      features: [
        "ROI acceleration modeling",
        "Sensitivity analysis",
        "Portfolio ROI comparison",
        "Time-to-market financial impact",
        "Executive presentation templates",
      ],
    },
  ],
};

export const academy = {
  hero: {
    label: "Academy",
    headline: "Learn FTTM",
    subhead: "Structured courses for accelerated teams.",
    body: "The FTTM Academy delivers 80+ sequential modules covering everything from Critical Path basics to advanced Macro-Micro Roll-up. Concept → Function → Practice. The same knowledge that powers 200+ global engagements, now self-paced.",
  },
  tracks: [
    {
      product: "fastProjectAI",
      count: "40+ modules",
      topic: "Critical Path & Scheduling",
      description: "From CPM fundamentals through advanced Wigglechart mastery. The complete scheduling methodology.",
    },
    {
      product: "fastDecisionAI",
      count: "20+ modules",
      topic: "Decision Modeling",
      description: "Structured decision quality. How the best teams frame, analyze, and commit to decisions.",
    },
    {
      product: "Cost-of-delayAI",
      count: "10+ modules",
      topic: "Business Case Modeling",
      description: "Quantifying the financial impact of schedule acceleration. Built for program leaders.",
    },
    {
      product: "FTTM Concepts",
      count: "191 articles",
      topic: "Methodology & Strategy",
      description: "The complete ideas library. Thirty-six years of research, organized and searchable.",
    },
  ],
};

export const results = {
  hero: {
    label: "Results",
    headline: "Programs that changed industries.",
    body: "lateralworks has delivered measurable schedule acceleration on some of the most demanding programs in technology — semiconductor fabs, consumer electronics, enterprise IT. These are a few of those stories.",
  },
  caseStudies: [
    {
      id: "globalfoundries",
      industry: "Semiconductor",
      client: "GlobalFoundries",
      metric: "$5M/day saved",
      submetric: "First silicon 2 weeks ahead of schedule",
      headline: "$5M/day saved. First silicon ahead of schedule.",
      body: "Fab8 in Malta, NY — a $7 billion greenfield semiconductor fabrication plant. lateralworks joined as one of the initial 5-person planning team and stayed through first silicon, finishing 2 weeks ahead of target. At $5 million per day of operational value, every day of acceleration has a clear dollar value.",
      detail: "This engagement demonstrated FTTM at its largest scale — a multi-year, multi-billion dollar program where schedule acceleration had direct, measurable financial impact on one of the most capital-intensive projects in the history of semiconductor manufacturing.",
    },
    {
      id: "philips",
      industry: "Consumer Electronics",
      client: "Philips → iPod",
      metric: "The methodology behind the iPod",
      submetric: "Tony Fadell · Philips Velo → Apple",
      headline: "The methodology that built the iPod.",
      body: "The engineering executive who led the Philips Velo PDA project — built using FTTM methodology — later applied these same practices at Apple to create the iPod, iPhone, and iPad. His name is Tony Fadell.",
      detail: "FTTM's influence on consumer technology extends well beyond direct engagements. The practices proven on the Philips Velo became part of the operating DNA that Tony Fadell brought to Apple — arguably the most consequential product development run in consumer electronics history.",
    },
    {
      id: "schwab",
      industry: "Enterprise IT",
      client: "Charles Schwab",
      metric: "$15M annual savings",
      submetric: "Internal Program of the Year",
      headline: "$15M annual savings. Program of the Year.",
      body: "IT Infrastructure Rationalization — 1,100 servers, 145 applications, 3-year program. lateralworks structured the portfolio, accelerated the savings timeline, and helped it win Charles Schwab's internal program of the year.",
      detail: "Enterprise IT programs often struggle with portfolio complexity — too many active projects, unclear critical paths, and diffuse accountability. This engagement applied FTTM portfolio methodology to one of the largest IT rationalization programs in financial services.",
    },
  ],
};

export const consulting = {
  hero: {
    label: "Consulting",
    headline: "We join your team. Not just advise it.",
    body: "lateralworks consulting engagements are multi-month partnerships. We are embedded practitioners, not visiting advisors. The measure of success is schedule acceleration — in weeks, months, and dollars.",
  },
  model: {
    headline: "How we engage",
    steps: [
      {
        number: "01",
        title: "Discovery",
        body: "We assess your current program state — schedule health, critical path clarity, decision quality, and portfolio drag. This produces a candid picture of where acceleration is possible.",
      },
      {
        number: "02",
        title: "Methodology Application",
        body: "We apply fastProjectAI suite and practices to your actual program. Not a training exercise — live application on your real schedule, your real decisions, your real portfolio.",
      },
      {
        number: "03",
        title: "Team Transfer",
        body: "Sustainable acceleration requires that your team internalizes the practices. We train while we work, so the capability stays after we leave.",
      },
      {
        number: "04",
        title: "Measurement",
        body: "We track schedule performance against baseline throughout the engagement. Acceleration is measured, not assumed.",
      },
    ],
  },
  services: [
    {
      title: "Program Acceleration",
      body: "Direct engagement on a specific critical program. We join the team, apply FTTM, and measure the acceleration. Typical engagement: 3–12 months.",
    },
    {
      title: "Portfolio Optimization",
      body: "FTTM applied at the portfolio level — identifying drag, rationalizing the active project list, and reallocating resources to maximize ROI across the portfolio.",
    },
    {
      title: "Education & Training",
      body: "Structured FTTM training for your team — from executive overview sessions to deep technical workshops on Critical Path Method, Decision Quality, and fastProjectAI tools.",
    },
  ],
};

export const ideas = {
  hero: {
    label: "Ideas",
    headline: "166 articles. 36 years of thinking.",
    body: "The lateralworks ideas library — research findings, methodology insights, and practical guidance accumulated across three decades of fast-time-to-market work.",
  },
  categories: [
    "Critical Path",
    "Portfolio",
    "Strategy",
    "Team",
    "VOC",
    "Innovation",
    "FTTM Mindset",
    "Decisions",
  ],
  articles: [
    {
      category: "Critical Path Analysis",
      date: "Dec 2024",
      title: "It's the second or third critical path that can sneak up and bite you",
      excerpt: "Most teams spend their energy managing the obvious critical path. The real schedule risk is often hiding in the near-critical paths that could become critical with any slip.",
      href: "/ideas/second-third-critical-path",
    },
    {
      category: "Planning",
      date: "Sep 2024",
      title: "Positive vs Negative Buffer (i.e. Margin)",
      excerpt: "Buffer and margin are not the same thing. Treating them as interchangeable is one of the most common — and costly — mistakes in program planning.",
      href: "/ideas/positive-negative-buffer",
    },
    {
      category: "FTTM Mindset",
      date: "Oct 2019",
      title: "Agile and FTTM",
      excerpt: "Agile and Fast-Time-to-Market are not competing methodologies. Understanding how they relate — and where each applies — is essential for technology leaders.",
      href: "/ideas/agile-and-fttm",
    },
    {
      category: "Strategy",
      date: "Oct 2019",
      title: "The Norm — Why average performance is the enemy of fast",
      excerpt: "The statistical norm is not a goal. It's a ceiling. Understanding why organizations regress to average performance — and how to break that pattern — is the starting point for FTTM.",
      href: "/ideas/the-norm",
    },
    {
      category: "Decisions",
      date: "Mar 2019",
      title: "The quality of a decision is not the quality of its outcome",
      excerpt: "Good decisions sometimes produce bad outcomes. Bad decisions sometimes get lucky. Separating decision quality from outcome quality is foundational to building fast teams.",
      href: "/ideas/decision-quality",
    },
    {
      category: "Portfolio",
      date: "Jan 2019",
      title: "Too many active projects is the most common — and least discussed — schedule killer",
      excerpt: "Portfolio overload creates resource starvation across all active projects. The fix is rarely adding resources. It's reducing active project count.",
      href: "/ideas/portfolio-overload",
    },
  ],
};

export const about = {
  hero: {
    label: "About",
    headline: "lateralworks",
    subhead: "Accelerated development since 1988.",
    body: "lateralworks is a consulting firm based in the San Francisco Bay Area with an international client base. We help our clients deliver advanced technology on or ahead of schedule. For over 36 years lateralworks has helped clients define the right project and then rapidly execute product development and market introduction to maximize ROI.",
  },
  story: {
    headline: "The research project that became a practice",
    body: "lateralworks conducts ongoing research into best practices of successful teams — a study initiated in 1990. The research project is called Fast-Time-to-Market (FTTM). We have developed a best practice database through experience on hundreds of development projects. These practices and experiences form the foundation of our work with clients.",
  },
};

export const contact = {
  hero: {
    label: "Contact",
    headline: "Start a conversation.",
    body: "Whether you're facing a specific program challenge, evaluating the fastProjectAI software, or want to understand how FTTM applies to your organization — we're straightforward to talk to.",
  },
  email: "contact@lateralworks.com",
  location: "Silicon Valley, CA",
  prompt: "Describe your program challenge or question, and we'll respond directly.",
};

export const footer = {
  tagline: "Silicon Valley. Founded 1988. 200+ FTTM projects. The methodology behind teams that changed the world.",
  columns: [
    {
      label: "Approach",
      links: [
        { label: "Methodology", href: "/methodology" },
        { label: "Research", href: "/methodology#research" },
        { label: "FTTM Framework", href: "/methodology#framework" },
      ],
    },
    {
      label: "Software",
      links: [
        { label: "fastProjectAI", href: "/software#fastproject" },
        { label: "fastDecisionAI", href: "/software#fastdecision" },
        { label: "Cost-of-delayAI", href: "/software#fastroi" },
        { label: "Academy", href: "/academy" },
      ],
    },
    {
      label: "Services",
      links: [
        { label: "Consulting", href: "/consulting" },
        { label: "Training", href: "/consulting#training" },
        { label: "Results", href: "/results" },
        { label: "Ideas Library", href: "/ideas" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
};
