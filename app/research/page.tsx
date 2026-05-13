import Link from "next/link";
import { siteOpenGraphDefaults } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — lateralworks",
  description:
    "lateralworks Research Project — three decades of competency-based research into the practices of fast-to-market technology teams.",
  alternates: { canonical: "/research" },
  openGraph: { ...siteOpenGraphDefaults, url: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">
            <Link href="/about" className="text-gold hover:text-gold-light transition-colors">About</Link>
            <span className="text-gold/50 mx-2">/</span>
            <span>Research</span>
          </p>
          <h1 className="font-semibold tracking-tight text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl">
            The research project
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            We conduct ongoing research into the best practices of highly successful new product
            development teams, and we continuously maintain a current best-practice experience base.
            This &ldquo;competency-based&rdquo; research forms the core of our consulting practice,
            keeping us at the cutting edge of new thinking before, in many cases, it is documented
            by the academic community.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              Our focus has been, and remains, on practical solutions that can be applied to real-life
              client problems, rather than theoretical or esoteric ideas that &ldquo;publish well&rdquo;
              but tend to be difficult to implement in practice. The study is ongoing, with new clients,
              projects, and experiences added every year.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              The practices are culturally refined through implementation projects around the world —
              what worked in San Jose, California is likely to change in Shanghai, China, based on
              cultural differences and human behaviors.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 — FTTM best practices */}
      <section className="bg-cream-dark py-20 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-10">
            <p className="section-label mb-3">01 — Best practices</p>
            <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl max-w-2xl">
              FTTM best practices (Fast-Time-to-Market)
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="max-w-2xl">
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                FTTM was first researched by lateralworks in the early 1990s, through an extensive
                multi-company study of over 500 people involved in fast-to-market projects in Silicon
                Valley. Over the past three decades lateralworks has engaged with hundreds of teams
                trying to accelerate the delivery of new technology products to market, and continues
                to study fast team practices through its international consulting practice. Each
                engagement builds on the research database in terms of both changing practices and
                deployment tactics.
              </p>
            </div>
            <figure>
              <img
                src="/images/research/host-team.webp"
                alt="Host and team relationship diagram"
                className="w-full h-auto block bg-white"
              />
              <figcaption className="text-[13px] font-light italic text-ink-muted leading-relaxed mt-4">
                Host — the organization outside of the project team that provides resources, support,
                and guidance; the &ldquo;functional management hierarchy.&rdquo; The host can provision
                and interrupt teams; it can create the conditions for success or failure of development
                projects. Fast organizations focus on rapid provisioning and interrupt removal.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section 2 — Overview of the study project */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-10">
            <p className="section-label mb-3">02 — Overview</p>
            <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl max-w-2xl">
              Overview of the study project
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <figure>
              <img
                src="/images/research/mindset-host-team.webp"
                alt="Mindset, Host, and Team framework"
                className="w-full h-auto block bg-white"
              />
              <figcaption className="text-[13px] font-light italic text-ink-muted leading-relaxed mt-4">
                FTTM Best Practices Framework — the provisioning Host, with practices organized around
                Mindset, Environment, and Portfolio.
              </figcaption>
            </figure>
            <div className="max-w-2xl space-y-6">
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                FTTM outcomes are a function of two inputs: the behavior of the team, and the
                environment within which the team operates. Individual project teams can achieve fast
                cycle-time results, often to the detriment of other projects (by stealing resources).
                The portfolio of projects therefore remains slow if the environment within which the
                teams operate is not oriented to help teams move faster.
              </p>
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                Senior management must create the right environment through specific behaviors and
                mindset, a fast development framework, lateral organization structures, and fast
                decision-making systems. It is easy to make one project go fast at the expense of
                others, so the challenge is to balance the portfolio so the highest-value projects
                get the resources they need to get to market quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — The FTTM system */}
      <section className="bg-cream-dark py-20 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-10">
            <p className="section-label mb-3">03 — The system</p>
            <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl max-w-2xl">
              The FTTM system
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="max-w-2xl space-y-6">
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                We call this environment the &ldquo;Host&rdquo; environment. In fast corporate cultures,
                the Host empowers heavyweight teams, removes interrupts, and provisions teams so they
                can be successful. In normal/slow corporate environments the Host tends to interrupt
                teams by not providing resources when needed, filling the pipeline with more projects
                than there are resources to deliver in a timely manner, not developing the &ldquo;bench
                strength&rdquo; of skills needed to create the technology, and controlling cost (at all
                costs) without understanding its economic impact on speed — i.e. arriving to market
                late.
              </p>
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                In short: provision teams for success, eliminate the interrupts.
              </p>
            </div>
            <figure>
              <img
                src="/images/research/fttm-system.webp"
                alt="FTTM System diagram"
                className="w-full h-auto block bg-white"
              />
              <figcaption className="text-[13px] font-light italic text-ink-muted leading-relaxed mt-4">
                The &ldquo;FTTM system&rdquo; is designed to deliver the right products — what
                customers want and value — at the right time.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section 4 — The framework */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-10">
            <p className="section-label mb-3">04 — The framework</p>
            <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl max-w-2xl">
              The framework
            </h2>
          </div>
          <figure className="mb-12">
            <img
              src="/images/research/framework-matrix.webp"
              alt="FTTM best-practice matrix"
              className="w-full h-auto block bg-white"
            />
            <figcaption className="text-[13px] font-light italic text-ink-muted leading-relaxed mt-4 max-w-3xl">
              Best-practice matrix — best practices based on the lateralworks ongoing research project
              into the practices of fast teams. The study was initiated in 1990 and continues today,
              with new ideas and insights added through client consulting engagements around the
              world. Both the practices and the deployment tactics have evolved through continuous
              improvement, cultural adaptation, and changing collaboration technology.
            </figcaption>
          </figure>
          <div className="max-w-3xl space-y-6">
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              Best practices broadly fall into three categories: Mindset, Host, and Team (horizontal
              axis). Down the vertical columns is a second classification: Portfolio, Environment,
              and Execution. For example, &ldquo;2.1 Fuzzy-front-end is managed&rdquo; is a practice
              performed by the Host that relates to the portfolio planning and management process.
              Most of the Portfolio practices are owned by the Host, with the exception of &ldquo;3.1
              Co-develop with tier-1 customers; continuously refine requirements,&rdquo; which belongs
              to the Team but relates to how the Portfolio is managed.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              One could argue for a different classification of some of the practices, as they could
              fall in multiple locations on the matrix. We chose this configuration, but what is more
              important is that there are mindset, host, and team practices we observed that enabled
              the right products to get to market at the right time. Overriding these practices was a
              corporate mindset that speed was the most critical asset of the company, and this
              mindset was understood by the leadership team and practiced consistently. They
              didn&apos;t just say it — they did it.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              In the study we generally describe the practices that make up each category using a
              contrasting technique to accentuate the differences in terms of &ldquo;normal&rdquo;
              (the typical team or corporate environment) and &ldquo;best&rdquo; in class. Although it
              may seem at times as though we are exaggerating, all of the &ldquo;normal&rdquo;
              conditions we describe are observed in real-world situations. Each new project generates
              more live examples.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              Few companies follow all the &ldquo;best&rdquo; practices, but a lot of them follow many
              of the practices described as &ldquo;normal,&rdquo; and they also consider it normal to
              behave that way. The difference between &ldquo;normal&rdquo; and &ldquo;best&rdquo;
              separates the fast from the slow teams and companies.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              When we speak about speed, we always mean &ldquo;right product delivered at the right
              time.&rdquo; FTTM is not just being fast — it is also delivering what customers want and
              value at a given point in time. Balancing this equation is hard: on time with the right
              product, not a de-featured or technically compromised product. Going fast is relatively
              easy when functionality or quality is compromised, but what the best-in-class teams do
              is deliver what customers want, when they want it. This requires knowing what they want
              (listening to them), being flexible enough to adapt as their requirements change, and
              then being able to execute on aggressive timelines through continuously pulling-in
              (accelerating) the schedule.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              They did this by continuously changing the product and continuously changing the
              schedule. This is counterintuitive, as one would expect that the way to solve the
              problem is to fix as many of the variables as possible. When teams fixed the spec and
              fixed the date, they almost always failed — missing both by wide margins. Why? Because
              nothing is fixed; everything is always changing, especially in technology development.
            </p>
            <p className="text-base font-light text-ink-secondary leading-relaxed">
              On the contrary, fast teams kept the product definition fluid and the schedule fluid,
              always adapting them to the dynamic conditions of ever-changing cutting-edge technology
              development. The practices outlined here describe how they did, and do, it — how they
              execute using counterintuitive thinking. To understand why this is counterintuitive
              thinking is to really understand the best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold tracking-tight text-white text-2xl lg:text-3xl mb-2">
              Want to know more, or join the study?
            </h3>
            <p className="text-sm font-light text-white/50">
              Get in touch about the research project, or about participating in continued research.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-[12px] font-semibold tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors"
          >
            Get in touch →
          </Link>
        </div>
      </section>
    </>
  );
}
