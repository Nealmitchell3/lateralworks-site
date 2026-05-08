// content/representative-experience.ts
//
// Long-form representative-project content for the /results modal.
// Lives separately from site-data.ts to keep that file lean.

export interface RepresentativeProject {
  project: string;
  client: string;
  type: string;
  problem: string;
  solution: string;
  role: string;
  outcomes: string;
}

export interface RepresentativeExperience {
  intro: string;
  subline: string;
  projects: RepresentativeProject[];
}

export const representativeExperience: RepresentativeExperience = {
  intro: "Representative experience",
  subline:
    "Hundreds of projects spanning thirty-plus years of FTTM expertise.",
  projects: [
    {
      project: "Fab8 (Malta, NY)",
      client: "GlobalFoundries",
      type: "Fab start-up",
      problem:
        "Deliver a greenfield mega-semiconductor fab in under two years to meet predicted market demand. $5M/day cost of delay. Large customer expecting initial capacity of advanced process technology. Significant growth step for the newly formed GlobalFoundries after the AMD acquisition. $7B program.",
      solution:
        "An integrated cross-functional planning system and team structure to implement FTTM best practices, establishing a culture of schedule acceleration, transparency, early warning, and trend analysis. Involved not just the GF team but every supplier on the program. The eventual macro-micro schedule system had over 125,000 tasks, 8 major modules, and twice-daily refreshes/roll-ups.",
      role:
        "Programmed the initial macro plan (end-to-end), established the core team, established weekly Refresh Planning, drove schedule accelerations, developed and implemented macro and micro integrated plans, established twice-daily Refresh of module micro schedules, coached the executive team, trained a large internal program-management team, and established a project-planning and acceleration system used continuously on future programs (fab expansion and advanced process node development).",
      outcomes:
        "First Silicon produced from the initial >1,000-tool line two weeks ahead of schedule. $70M in savings due to early delivery. The program involved facility construction, tool procurement, installation and qualification, process transfer, and product qualification, including the initial 2,500-person fab staffing and operations start-up.",
    },
    {
      project: "Playstation",
      client: "LSI & Sony",
      type: "New product development",
      problem:
        "Create core ASIC technology for a gaming console using a new 5x gate design in order to bring Sony's Playstation to market ahead of its competition.",
      solution:
        "Prioritized seven potential vertical market segments to focus on a single segment and specific customer to generate pull-through speed. Co-developed with the customer, established an empowered core team, engaged the customer in VOC, and implemented an aggressive schedule-acceleration system. The schedule laterally integrated every aspect of the complete hardware and software solution for Sony. VOC was essential for limited scope and accelerated schedule.",
      role:
        "Built models and facilitated market-segment prioritization. Drove the focus on a single segment and customer in order to focus and accelerate development. Established the first cross-functional team at LSI. Programmed and structured the macro plan and implemented aggressive 3x/week refresh planning that resulted in the compressed schedule. Coached executive leadership and advised on larger-scale deployment to all LSI development projects.",
      outcomes:
        "Early delivery of prototypes to Sony accelerated Sony's system design, with final engineering samples integrated in under 15 months — 12 months ahead of schedule. Enabled Sony to beat Nintendo to market and establish a market leadership that remains today. Generated $700M in revenue in the first year for LSI, doubling the size of the company. The 500K Technology became the foundation of LSI's ASIC and design methodology for more than seven years. Each of the seven members of the Core Team later became CEOs of major Silicon Valley companies, due to this project's success.",
    },
    {
      project: "Velo",
      client: "Philips Electronics",
      type: "Breakthrough technology",
      problem:
        "Deliver the first mobile device using Microsoft's new mobile operating system, where Philips had a 24-month exclusivity from Microsoft — meaning development of a first-of-a-kind mobile device could take no longer than 12 months. Develop all the hardware and software for the device. Interface with Toshiba (concurrently developing the CPU) and Microsoft (developing the operating system and key applications). Develop contract-manufacturing partner capability and ramp first-year production — all completed in 12 months.",
      solution:
        "Set up a separate, colocated, fully dedicated program team physically located away from Philips' larger Silicon Valley research center. Established a 20-person core group to design and manage a program using 350 subcontractors and suppliers — one of the first truly outsourced co-development programs in the world. Implemented almost all of the FTTM best practices to define and manage the team, define and refine the product (MVP), plan and execute the project, and create the corporate environment that delivered everything the team needed to maintain project speed.",
      role:
        "Convinced Philips executive leadership to do this project differently — set it up outside the normally slow Philips hierarchy and provisioned it with what the team needed, including a faster outsourced strategy in which a small core group at Philips would design and manage while much larger \"just-in-time\" resource groups from multiple companies would do most of the actual development. Established a core team that included key development and manufacturing partners in a seamless, singularly focused project effort. The FTTM schedule system provided the glue that held it all together.",
      outcomes:
        "The Velo started mass production 13 months from team formation. Philips maintained 11 months of exclusivity on the OS before Microsoft licensed it to other hardware companies. Velo won Product of the Year at CES in its first year of production. Tony Fadell, the engineering leader and our client, went on to develop the iPod, iPhone, and iPad at Apple, and later founded Nest before selling it to Google. Tony brought many of the Velo project practices with him and implemented them on the Apple programs he managed.",
    },
    {
      project: "HID Lighting",
      client: "HID Labs",
      type: "GreenTech start-up",
      problem:
        "Get the first product to market from an A-round venture-funded start-up with limited runway and a small team. Take a lighting-efficiency technology that could be used in many applications and determine which application, segment, and customers to focus on, in order to develop the proof of concept and eventual first commercial product in less than 12 months — the investor milestone for the B round of financing.",
      solution:
        "Built market-decision models with a group of industry lighting SMEs that led to the selection of a specific use-case taking advantage of the technology's current maturity and capabilities, where selected customers would see the highest value in energy efficiency. Then assembled a core team to drive engineering and low-volume production in order to meet the investor's 12-month performance window.",
      role:
        "Facilitated market and application focus and the development of MVP specifications. Set up the core team and drove development through weekly refresh meetings. Used market and product-feature prioritization models to maintain development focus and further reduce schedule duration. Reduced the MVP to what customers valued = faster schedule.",
      outcomes:
        "First prototypes released eight months from team formation, accelerating the second round of VC funding by four months and resulting in a 4x valuation of the company ahead of schedule. The product was eventually produced in volume and markets expanded. The company and IP were later acquired per investor plans. The same system used for a $7B fab was used for a 50-person start-up — one scaled up, one scaled down — same FTTM results.",
    },
    {
      project: "20nm process",
      client: "IBM, GF, Infineon, ST, Samsung, and GlobalFoundries",
      type:
        "Joint development consortium — advanced semiconductor node development",
      problem:
        "Develop an advanced semiconductor process in under two years using a consortium of partners who would jointly develop the technology and each commercialize using their own IP into their own products. Leverage the technical and financial capabilities of six major competitive semiconductor players such that the manufacturing process and design tools were transferable to each partner's design teams and fabs, so each partner could develop subsequent product designs using the technology. Protect IP, get competitors to cooperate, set up team governance, and accelerate learning cycles in an aging IBM foundry in Fishkill, New York.",
      solution:
        "Designed and formed a Core Team with key technical leads from each partner. Facilitated the group toward mutually shared outcomes around key integration milestones and doneness criteria. Developed detailed execution plans incorporating each partner's contribution and key interface points. Increased the number of learning cycles, made them more concurrent, and reduced the cycle-time of each in order to learn faster. 20nm at the time was seen as an almost impossible target within the team's two-year window set by the consortium's leadership group — true path-finding technology.",
      role:
        "Set up the team, defined roles, and modeled cooperative behavior — first by joint planning, then through weekly refresh planning cycles. Defined a single \"product boss\" to lead the team and created single leaders for each technical area. With six companies involved, each wanting to lead and drive each aspect, setting up single-point management governance was a significant achievement. Programmed out the macro plan to show the team that it would take five years to realize the technical goals — which drove faster, more, and more concurrent learning cycles. Set up FTTM schedules that were eventually integrated to the Fab MES for automatic daily updating.",
      outcomes:
        "The initial 20nm process and design methods/tools were developed and transferred to each partner in 24 months, taking three years out of the baseline schedule. Each partner further refined the base technology, adding their unique IP. lateralworks later managed the transfer of the 20nm process to both GlobalFoundries Fab 8 (NY) and Fab 1 (Dresden, Germany), and then on to development projects that designed-in and manufactured GF's customer products.",
    },
  ],
};
