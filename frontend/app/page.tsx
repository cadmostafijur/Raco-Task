"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Users,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  FileArchive,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Layout/Navbar";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <Navbar />

      {/* Hero — Premium SaaS style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(139,92,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(34,197,94,0.06),transparent)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 pt-20 pb-32 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: { staggerChildren: 0.08, delayChildren: 0.15 },
              },
            }}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <Sparkles className="h-4 w-4" />
                The modern way to manage project workflows
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-[#0a0a0a] dark:text-white"
            >
              Where buyers meet{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary-500 to-violet-500 bg-clip-text text-transparent">
                  problem solvers
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/20 -z-10 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-[#71717a] dark:text-zinc-400 leading-relaxed"
            >
              A streamlined marketplace for project collaboration. Buyers post projects,
              solvers request to work, and everyone stays in sync with full lifecycle tracking.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base h-12 rounded-xl border-2"
                >
                  Sign in
                </Button>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-[#71717a] dark:text-zinc-500"
            >
              No credit card required • Free forever
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Social proof / Stats bar */}
      <section className="border-y bg-white dark:bg-white/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 lg:gap-24"
          >
            {[
              { value: "500+", label: "Projects completed" },
              { value: "98%", label: "Completion rate" },
              { value: "3", label: "Simple steps" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-[#71717a] dark:text-zinc-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#0a0a0a] dark:text-white">
              How it works
            </h2>
            <p className="mt-6 text-lg text-[#71717a] dark:text-zinc-400 max-w-2xl mx-auto">
              Three simple steps from idea to delivery
            </p>
          </motion.div>

          <div className="grid gap-8 lg:gap-12 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: FolderKanban,
                title: "Create & Request",
                desc: "Buyers create projects with clear scope. Solvers browse open projects and submit requests to work.",
                color: "from-primary to-primary-600",
              },
              {
                step: "02",
                icon: Users,
                title: "Assign & Build",
                desc: "Buyers assign one solver per project. Solvers break work into tasks and upload ZIP deliverables.",
                color: "from-violet-500 to-violet-600",
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Review & Complete",
                desc: "Buyers review submissions, accept or reject with feedback. Full transparency for everyone.",
                color: "from-emerald-500 to-emerald-600",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="rounded-2xl border border-[#e4e4e7] dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 h-full">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 shadow-lg`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <span className="text-4xl font-bold text-[#e4e4e7] dark:text-zinc-800 absolute top-8 right-8">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-[#0a0a0a] dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#71717a] dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                  <ChevronRight className="h-5 w-5 text-primary mt-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle visual */}
      <section className="py-24 lg:py-32 bg-[#f4f4f5] dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#0a0a0a] dark:text-white">
              Full lifecycle visibility
            </h2>
            <p className="mt-6 text-lg text-[#71717a] dark:text-zinc-400 max-w-2xl mx-auto">
              Every project moves through clear states. No guesswork.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-3xl border border-[#e4e4e7] dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-10 lg:p-14 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { label: "Open", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                { label: "Requested", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                { label: "Assigned", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
                { label: "In Progress", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
                { label: "Submitted", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20" },
                { label: "Completed", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
              ].map((s, i) => (
                <motion.span
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium ${s.color}`}
                >
                  {s.label}
                </motion.span>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-[#71717a] dark:text-zinc-500">
              Animated transitions • Role-based access • ZIP upload validation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#0a0a0a] dark:text-white">
              Built for collaboration
            </h2>
            <p className="mt-6 text-lg text-[#71717a] dark:text-zinc-400 max-w-2xl mx-auto">
              Everything you need to run projects smoothly
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Secure", desc: "JWT auth, role-based access control" },
              { icon: Clock, title: "Real-time", desc: "Instant status updates" },
              { icon: FileArchive, title: "ZIP uploads", desc: "Validated file submissions" },
              { icon: Users, title: "Collaborative", desc: "Clear buyer-solver workflow" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#e4e4e7] dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-[#0a0a0a] dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-[#71717a] dark:text-zinc-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary to-primary-700 p-12 lg:p-16 text-center shadow-2xl shadow-primary/30">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to streamline your workflow?
            </h2>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              Join buyers and problem solvers already using the platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-xl bg-white text-primary hover:bg-white/90 gap-2"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-xl border-2 border-white text-primary hover:bg-white/20 hover:border-white"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e4e4e7] dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#0a0a0a] dark:text-white">
                  Workflow
                </span>
              </Link>
              <p className="text-[#71717a] dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                The modern marketplace connecting buyers with problem solvers for streamlined project delivery.
              </p>
              <div className="flex gap-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e4e7] dark:border-zinc-800 hover:border-primary hover:bg-primary/5 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e4e7] dark:border-zinc-800 hover:border-primary hover:bg-primary/5 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e4e7] dark:border-zinc-800 hover:border-primary hover:bg-primary/5 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-[#0a0a0a] dark:text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/dashboard" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-[#0a0a0a] dark:text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <Link href="/#guides" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/#support" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/#api" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-[#0a0a0a] dark:text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/#about" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Get started
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-[#71717a] dark:text-zinc-400 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-[#e4e4e7] dark:border-zinc-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#71717a] dark:text-zinc-500">
                © {new Date().getFullYear()} Marketplace Project Workflow. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-[#71717a] dark:text-zinc-400">
                <Link href="/#privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/#terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/#cookies" className="hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
