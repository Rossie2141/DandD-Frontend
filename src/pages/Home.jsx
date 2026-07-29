import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                V2.0 Now Live
              </div>
              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Master modern engineering challenges.
              </h1>
              <p className="mb-8 max-w-lg text-base text-slate-600 leading-relaxed sm:text-lg">
                Practice algorithmic problems, test your skills in real-time execution environments, and prepare for high-bar technical interviews.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Start Coding
                </Link>
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Browse Problems
                </Link>
              </div>
            </div>

            {/* Code Snippet Card */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] text-slate-300 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  </div>
                  <span className="font-mono text-xs text-slate-400">TwoSum.cpp</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                  <code>
                    <span className="text-rose-400">class</span> <span className="text-blue-300">Solution</span> &#123;{"\n"}
                    <span className="text-rose-400">public</span>:{"\n"}
                    {"    "}<span className="text-teal-300">vector</span>&lt;<span className="text-rose-400">int</span>&gt; <span className="text-blue-300">twoSum</span>(<span className="text-teal-300">vector</span>&lt;<span className="text-rose-400">int</span>&gt;&amp; nums, <span className="text-rose-400">int</span> target) &#123;{"\n"}
                    {"        "}<span className="text-teal-300">unordered_map</span>&lt;<span className="text-rose-400">int</span>, <span className="text-rose-400">int</span>&gt; mp;{"\n"}
                    {"        "}<span className="text-rose-400">for</span> (<span className="text-rose-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; nums.size(); ++i) &#123;{"\n"}
                    {"            "}<span className="text-rose-400">if</span> (mp.count(target - nums[i])) &#123;{"\n"}
                    {"                "}<span className="text-rose-400">return</span> &#123;mp[target - nums[i]], i&#125;;{"\n"}
                    {"            "}&#125;{"\n"}
                    {"            "}mp[nums[i]] = i;{"\n"}
                    {"        "}&#125;{"\n"}
                    {"        "}<span className="text-rose-400">return</span> &#123;&#125;;{"\n"}
                    {"    "}&#125;{"\n"}
                    &#125;;
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Tech Strip */}
        <section className="border-y border-slate-100 bg-slate-50/50 py-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Supported Environments</span>
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-slate-500">
              <span>C++</span>
              <span>Python </span>
              <span>Java </span>
              <span>TypeScript</span>
              <span>Go</span>
              <span>Rust </span>
            </div>
          </div>
        </section>

        {/* Clean Highlights Grid */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: 'terminal',
                title: 'Real-time Execution',
                desc: 'Sub-millisecond compilation with comprehensive test case results and memory profiling.'
              },
              {
                icon: 'psychology',
                title: 'Contextual Guidance',
                desc: 'Smart hints that steer you toward optimal space and time complexities without giving away solutions.'
              },
              {
                icon: 'trophy',
                title: 'Ranked Contests',
                desc: 'Weekly speed and efficiency competitions with real-time global leaderboards.'
              },
              {
                icon: 'forum',
                title: 'Peer Discussion',
                desc: 'Review alternative implementations, discuss trade-offs, and learn canonical patterns.'
              },
              {
                icon: 'query_stats',
                title: 'Skill Matrix',
                desc: 'Track mastery across dynamic programming, graph theory, and data structure archetypes.'
              },
              {
                icon: 'work',
                title: 'Curated Tracks',
                desc: 'Problem sets mapped directly to actual interview loops at modern software companies.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="group border-t border-slate-200 pt-6">
                <span className="material-symbols-outlined mb-3 text-slate-700 transition-colors group-hover:text-blue-600">
                  {feature.icon}
                </span>
                <h3 className="mb-2 text-base font-medium text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Simple Workflow Section */}
        <section className="border-t border-slate-100 bg-slate-50/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-12 text-2xl font-semibold tracking-tight text-slate-900">How CodeForge works</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { num: '01', title: 'Pick a track', desc: 'Choose between targeted topic sets or company-specific preparation.' },
                { num: '02', title: 'Write & test', desc: 'Develop solutions in our online editor with instant feedback loops.' },
                { num: '03', title: 'Optimize', desc: 'Compare your runtime and memory footprints against benchmark thresholds.' },
                { num: '04', title: 'Track growth', desc: 'Watch your algorithmic efficiency ratings increase over time.' },
              ].map((step) => (
                <div key={step.num}>
                  <div className="mb-3 font-mono text-xs font-medium text-slate-400">{step.num}</div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal CTA */}
        {/* <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="rounded-2xl bg-slate-900 p-8 text-white sm:p-12">
            <div className="max-w-xl">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to level up your engineering skills?
              </h2>
              <p className="mb-6 text-sm text-slate-400">
                Join thousands of engineers practicing daily to sharpen their problem-solving edge.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section> */}
      </main>

    </div>
  );
}