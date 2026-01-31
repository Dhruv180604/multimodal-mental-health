"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";

import ScrollReveal from "@/components/ScrollReveal";

/* ================= ANIMATION WRAPPER ================= */
function AnimateSection({
  children,
  direction = "up",
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "zoom";
}) {
  const variants = {
    up: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      variants={variants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ================= FAQ ITEM ================= */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-2 border-[#00bfff]
 p-6 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{question}</h3>

        <span className="text-xl font-bold">{open ? "−" : "+"}</span>
      </div>

      {open && (
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

/* ================= FAQ SECTION ================= */
function FAQSection() {
  const faqs = [
    {
      question: "How is my data protected?",
      answer:
        "All entries are encrypted with 256-bit encryption, the same standard used by banks. Your data never leaves your account.",
    },
    {
      question: "Can I share entries with my doctor?",
      answer:
        "Yes. You control exactly what your doctor sees and can revoke access anytime.",
    },
    {
      question: "What if I want to delete everything?",
      answer:
        "Your account and all entries can be permanently deleted whenever you choose.",
    },
    {
      question: "Is the dashboard really private?",
      answer:
        "Completely. No one can access it unless you explicitly grant permission.",
    },
    {
      question: "How do I get started?",
      answer:
        "Sign up with your email and start journaling immediately. No credit card required.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-4xl text-[#00bfff] font-bold mb-3">Questions</h2>

        <p className="text-gray-600">
          Everything you need to know about Mental Health Journal Platform
        </p>
      </div>

      {/* FAQ List */}
      <div className="flex flex-col gap-6 mb-20">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      {/* Support */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Still have questions</h3>

        <p className="text-gray-600 mb-4">
          Reach out to our support team anytime
        </p>

        <button
          className="border border-[#00bfff]
 px-6 py-3 rounded text-sm hover:bg-gray-100"
        >
          Contact
        </button>
      </div>
    </section>
  );
}
/* ================= TYPEWRITER TEXT ================= */

function TypeWriter({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [forwards, setForwards] = useState(true);
  const [skipCount, setSkipCount] = useState(0);

  const skipDelay = 15;
  const speed = 70;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentWord = words[wordIndex];

      if (forwards) {
        if (offset >= currentWord.length) {
          setSkipCount((c) => c + 1);

          if (skipCount === skipDelay) {
            setForwards(false);
            setSkipCount(0);
          }
        }
      } else {
        if (offset === 0) {
          setForwards(true);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }

      if (skipCount === 0) {
        setOffset((o) => (forwards ? o + 1 : o - 1));
      }

      setText(currentWord.substr(0, offset));
    }, speed);

    return () => clearInterval(interval);
  }, [offset, forwards, skipCount, wordIndex, words]);

  return <span>{text}</span>;
}

export default function Home() {
  /* ================= ML ANALYZER STATE ================= */

  const [journalText, setJournalText] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  /* ================= CALL BACKEND ================= */

  async function analyzeJournal(text: string) {
    try {
      const res = await fetch("http://localhost:8000/predict-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      return data.predicted_label;
    } catch (err) {
      console.error("AI API Error:", err);
      return null;
    }
  }

  /* ================= SUBMIT HANDLER ================= */

  async function handleAnalyzeJournal() {
    if (!journalText.trim()) return;

    setLoadingAI(true);

    const result = await analyzeJournal(journalText);

    setPrediction(result);

    setLoadingAI(false);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ================= NAVBAR ================= */}
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-[#00bfff] shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <h1 className="text-2xl font-bold text-white tracking-wide cursor-pointer hover:scale-105 transition">
            MindTrack
          </h1>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-white">
            {["Features", "Dashboard", "Blog"].map((item) => (
              <a key={item} href="#" className="relative group">
                {item}

                {/* Underline animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            {/* DROPDOWN */}
            <select className="bg-transparent text-white outline-none cursor-pointer font-semibold">
              <option className="text-black">Resources</option>
              <option className="text-black">Docs</option>
              <option className="text-black">Help</option>
            </select>
          </div>

          {/* CTA BUTTON */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#00bfff] px-6 py-2.5 text-sm font-bold rounded-full shadow-md hover:shadow-xl transition"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* ================= HERO SECTION ================= */}
      {/* ================= HERO SECTION ================= */}
      <AnimateSection direction="zoom">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="border-2 border-[#00bfff] grid grid-cols-1 md:grid-cols-2 min-h-[450px]">
            {/* ================= LEFT TEXT ================= */}
            <motion.div
              className="p-10 flex flex-col justify-center"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Heading Animation */}
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-[#00bfff] leading-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <TypeWriter
                  words={[
                    "Track your mind",
                    "Understand yourself",
                    "Improve mental health",
                    "Discover emotional patterns",
                  ]}
                />
              </motion.h2>

              {/* Paragraph Animation */}
              <motion.p
                className="text-gray-600 mb-8 max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                A private space to journal your thoughts and monitor your
                emotional patterns. See your progress unfold with a dashboard
                built for clarity and insight.
              </motion.p>

              {/* Buttons Animation */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <button className="bg-[#00bfff] text-white hover:bg-[#009acd] px-6 py-3 rounded text-sm">
                  Start
                </button>

                <button className="border border-[#00bfff] px-6 py-3 rounded text-sm hover:bg-gray-100">
                  Learn
                </button>
              </motion.div>
            </motion.div>

            {/* ================= RIGHT IMAGE ================= */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Floating Effect */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/jigsaw.jpg"
                  alt="Mental health illustration"
                  width={500}
                  height={500}
                  className="rounded-lg object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimateSection>

      {/* ================= JOURNALING SECTION ================= */}
      <AnimateSection direction="up">
        <section className="max-w-7xl mx-auto px-6 py-24">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-sm text-gray-500 mb-2">Journaling</p>

            <h2 className="text-4xl font-bold text-[#00bfff] mb-4">
              Write without limits
            </h2>

            <p className="text-gray-600 max-w-xl mx-auto">
              Capture your thoughts in a secure space that’s entirely yours.
            </p>
          </div>

          {/* Cards */}
          {/* ================= CARDS ================= */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
          >
            {[
              {
                img: "/images/emo_track.jpg",
                tag: "Track",
                title: "Emotion tracking that makes sense",
                desc: "Tag your feelings and watch patterns emerge over time.",
                color: "#ec4899",
              },
              {
                img: "/images/Emoji Satisfaction Meter.jpg",
                tag: "Progress",
                title: "Dashboard shows what matters",
                desc: "Visual insights into your emotional journey, updated as you write.",
                color: "#ec4899",
              },
              {
                img: "/images/privacy.jpg",
                tag: "Privacy",
                title: "Your data stays yours alone",
                desc: "Encrypted storage means your entries remain private and secure.",
                color: "#00bfff",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="relative rounded-xl overflow-hidden min-h-[350px] p-6 flex flex-col justify-end group cursor-pointer transition-all duration-300"
              >
                {/* Background Image */}
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />

                {/* Soft Gradient (NOT Grey Background) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10">
                  <p className="text-sm mb-2 opacity-90 text-pink-400">
                    {card.tag}
                  </p>

                  <h3
                    className="text-xl font-bold mb-3 text-white drop-shadow-md"
                    style={{ WebkitTextStroke: `1px ${card.color}` }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className="text-sm mb-4 text-white drop-shadow-md"
                    style={{ WebkitTextStroke: `0.6px ${card.color}` }}
                  >
                    {card.desc}
                  </p>

                  <motion.a
                    href="#"
                    whileHover={{ x: 6 }}
                    className="text-sm underline text-white hover:text-pink-400 inline-block"
                  >
                    Explore →
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimateSection>
      {/* ================= AI JOURNAL ANALYZER ================= */}
      <AnimateSection direction="zoom">
        <section className="max-w-3xl mx-auto px-6 py-24">
          <div className="border-2 border-[#00bfff] rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-[#00bfff] mb-6 text-center">
              AI Mental Health Analyzer
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Write your thoughts and let AI analyze your emotional state
            </p>

            {/* Text Input */}
            <textarea
              className="w-full border border-[#00bfff] rounded-lg p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
              rows={6}
              placeholder="Write your journal entry here..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
            />

            {/* Button */}
            <button
              onClick={handleAnalyzeJournal}
              disabled={loadingAI}
              className="w-full bg-[#00bfff] text-white py-3 rounded-lg font-semibold hover:bg-[#009acd] transition"
            >
              {loadingAI ? "Analyzing..." : "Analyze with AI"}
            </button>

            {/* Result */}
            {prediction !== null && (
              <div className="mt-6 bg-blue-50 border border-[#00bfff] rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-[#00bfff]">
                  Predicted Emotional Label
                </p>

                <p className="text-3xl font-bold mt-2">{prediction}</p>
              </div>
            )}
          </div>
        </section>
      </AnimateSection>

      {/* ================= SECURITY SECTION ================= */}
      <AnimateSection direction="left">
        <section className="max-w-7xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <p className="text-sm text-gray-500 mb-3">Security</p>

              <h2 className="text-4xl text-[#00bfff] font-bold mb-6 leading-tight">
                Built on trust and <br />
                encryption
              </h2>

              <p className="text-gray-600 max-w-md mb-10">
                Your login is protected with industry-standard security. Every
                entry you write stays encrypted, accessible only to you.
              </p>

              {/* STATS */}
              <div className="flex gap-16 mb-10">
                {/* Stat 1 */}
                <div className="flex flex-col items-start">
                  <div className="border border-[#00bfff] rounded-md px-4 py-2 mb-2">
                    <h3 className="text-3xl font-bold text-[#00bfff]">256</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Bit encryption standard for all data
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-start">
                  <div className="border border-[#00bfff] rounded-md px-4 py-2 mb-2">
                    <h3 className="text-3xl font-bold text-[#00bfff]">100</h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    Percent private, zero third-party access
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  className="border border-[#00bfff]
 px-6 py-3 rounded text-sm hover:bg-gray-100"
                >
                  Details
                </button>

                <button className="text-sm underline hover:text-gray-600">
                  Learn →
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[400px]">
              <Image
                src="/images/encrypt.jpg"
                alt="Data security illustration"
                width={800}
                height={800}
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </AnimateSection>
      {/* ================= SUPPORT / DOCTOR SECTION ================= */}
      <AnimateSection direction="right">
        <section className="max-w-7xl mx-auto px-6 py-28">
          {/* Top Heading */}
          <div className="text-center mb-16">
            <p className="text-sm text-gray-500 mb-2">Support</p>

            <h2 className="text-4xl font-bold text-[#00bfff] mb-4">
              Connect with your doctor
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your journal entries with a healthcare provider when you’re
              ready. They see what you choose to show them, nothing more.
            </p>
          </div>

          {/* Main Box */}
          <div
            className="border-2 border-[#00bfff]
 grid grid-cols-1 md:grid-cols-2 min-h-[450px]"
          >
            {/* LEFT IMAGE */}
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/images/doctor.jpg"
                alt="Doctor"
                className="w-100 h-100 object-contain rounded-lg"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="p-12 flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-2">Collaboration</p>

              <h3 className="text-3xl font-bold mb-6 leading-tight">
                Your doctor can offer <br />
                guidance
              </h3>

              <p className="text-gray-600 mb-8 max-w-md">
                Professional insight paired with your own observations creates
                real progress. You remain in control of every conversation.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  className="border border-[#00bfff]
 px-6 py-3 rounded text-sm hover:bg-gray-100"
                >
                  Explore
                </button>

                <button className="text-sm underline hover:text-gray-600">
                  Learn →
                </button>
              </div>
            </div>
          </div>
        </section>
      </AnimateSection>
      {/* ================= RESULTS SECTION ================= */}
      <AnimateSection direction="zoom">
        <section className="max-w-7xl mx-auto px-6 py-28">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-sm text-gray-500 mb-2">Results</p>

            <h2 className="text-4xl font-bold text-[#00bfff] mb-4">
              Numbers that speak for themselves
            </h2>

            <p className="text-gray-600 max-w-xl mx-auto">
              Users report measurable improvements in emotional awareness
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* LEFT STATS */}
            <div className="flex flex-col gap-8">
              {/* Stat Card 1 */}
              <div
                className="border-2 border-[#00bfff]
 p-6"
              >
                <p className="font-medium mb-4">Improved emotional clarity</p>

                <h3 className="text-4xl font-bold mb-3">87%</h3>

                <p className="text-sm text-gray-600">
                  Of users notice patterns in their feelings within weeks
                </p>
              </div>

              {/* Stat Card 2 */}
              <div
                className="border-2 border-[#00bfff]
 p-6"
              >
                <p className="font-medium mb-4">Consistent journaling rates</p>

                <h3 className="text-4xl font-bold mb-3">72%</h3>

                <p className="text-sm text-gray-600">
                  Return to journal at least three times per week
                </p>
              </div>

              {/* Stat Card 3 */}
              <div
                className="border-2 border-[#00bfff]
 p-6"
              >
                <p className="font-medium mb-4">Doctor satisfaction</p>

                <h3 className="text-4xl font-bold mb-3">94%</h3>

                <p className="text-sm text-gray-600">
                  Of healthcare providers recommend the platform to patients
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="md:col-span-2 bg-gray-200 rounded-lg flex items-center justify-center min-h-[400px]">
              <img
                src="/images/stats.jpg"
                alt="Statistics"
                className="w-170 h-154 object-contain text-gray-400"
              />
            </div>
          </div>
        </section>
      </AnimateSection>
      {/* ================= TESTIMONIALS SECTION ================= */}
      <AnimateSection direction="up">
        <section className="max-w-7xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* LEFT TEXT */}
            <div>
              <h2 className="text-4xl font-bold text-[#00bfff] mb-4">
                Real stories
              </h2>

              <p className="text-gray-600 max-w-md">
                Hear from those who’ve found clarity
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="flex flex-col items-end">
              <div
                className="border-2 border-[#00bfff]
 p-8 max-w-md w-full"
              >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                    W
                  </div>

                  <span className="font-medium text-sm">Webflow</span>
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  “I finally understood why certain days felt harder than
                  others. The patterns were always there, but I couldn’t see
                  them until I started tracking.”
                </p>

                {/* User */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                    S
                  </div>

                  <div>
                    <p className="font-medium text-sm">Sarah Mitchell</p>

                    <p className="text-xs text-gray-500">User, therapist</p>
                  </div>
                </div>

                {/* Link */}
                <a href="#" className="text-sm underline hover:text-gray-600">
                  Read story →
                </a>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-4 mt-8">
                {/* Dots */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={`w-2 h-2 rounded-full ${
                        dot === 2 ? "bg-black" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-2">
                  <button className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-gray-100">
                    ←
                  </button>

                  <button className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-gray-100">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateSection>
      {/* ================= CTA SECTION ================= */}
      <AnimateSection direction="zoom">
        <section className="max-w-7xl mx-auto px-6 py-28">
          <div className="bg-gray-600 text-white rounded-lg py-20 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#00bfff] mb-4">
              Ready to understand yourself
            </h2>

            <p className="text-gray-200 mb-8 max-w-xl mx-auto">
              Start journaling today and watch your patterns emerge over time
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button className="bg-white text-black px-6 py-3 rounded text-sm font-medium hover:bg-gray-100">
                Start
              </button>

              <button className="border border-white px-6 py-3 rounded text-sm hover:bg-white hover:text-black transition">
                Schedule demo
              </button>
            </div>
          </div>
        </section>
      </AnimateSection>
      <AnimateSection direction="up">
        <FAQSection />
      </AnimateSection>
      {/* ================= CONTACT SECTION ================= */}
      <AnimateSection direction="left">
        <section className="max-w-7xl mx-auto px-6 py-28">
          {/* Top Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Support</p>

              <h2 className="text-4xl font-bold text-[#00bfff] mb-4">
                Get in touch
              </h2>

              <p className="text-gray-600 max-w-md">
                Questions about the platform or need help getting started? We’re
                here to help.
              </p>
            </div>

            {/* RIGHT CONTACT INFO */}
            <div className="space-y-4 text-sm">
              {/* Email */}
              <div className="flex items-start gap-3">
                <span>📧</span>

                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">
                    support@mentalhealthjournal.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <span>📞</span>

                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+1 (844) 555-0123</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-3">
                <span>📍</span>

                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-gray-600">
                    456 Market Street, San Francisco, CA 94102, US
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAP PLACEHOLDER */}
          <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[350px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m0 18V2"
              />
            </svg>
          </div>
        </section>
      </AnimateSection>
      {/* ================= FOOTER SECTION ================= */}
      <AnimateSection direction="up">
        <footer className="max-w-7xl mx-auto px-6 py-24">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            {/* LEFT CTA */}
            <div>
              <h2 className="text-4xl font-bold text-[#00bfff] mb-4 leading-tight">
                Take control of your <br />
                mental health
              </h2>

              <p className="text-gray-600 max-w-md mb-6">
                Track your emotions, understand your patterns, share with your
                doctor securely.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  className="bg-[#00bfff] text-white hover:bg-[#009acd]
 px-6 py-3 rounded text-sm hover:bg-gray-800"
                >
                  Features
                </button>

                <button
                  className="border border-[#00bfff]
 px-6 py-3 rounded text-sm hover:bg-gray-100"
                >
                  Blog
                </button>
              </div>
            </div>

            {/* MIDDLE LINKS */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <p className="font-medium mb-2">Platform</p>

                <p className="hover:underline cursor-pointer">Home</p>
                <p className="hover:underline cursor-pointer">Features</p>
                <p className="hover:underline cursor-pointer">Dashboard</p>
                <p className="hover:underline cursor-pointer">Blog</p>
                <p className="hover:underline cursor-pointer">Contact</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium mb-2">Legal</p>

                <p className="hover:underline cursor-pointer">Privacy</p>
                <p className="hover:underline cursor-pointer">Terms</p>
                <p className="hover:underline cursor-pointer">Support</p>
                <p className="hover:underline cursor-pointer">Status</p>
                <p className="hover:underline cursor-pointer">Security</p>
              </div>
            </div>

            {/* RIGHT SOCIAL */}
            <div className="flex flex-col items-start md:items-end">
              <h3 className="font-medium mb-4">Logo</h3>

              {/* Social Icons */}
              <div className="flex gap-4 text-xl text-gray-600">
                <a href="#" className="hover:text-black">
                  📘
                </a>
                <a href="#" className="hover:text-black">
                  📷
                </a>
                <a href="#" className="hover:text-black">
                  ❌
                </a>
                <a href="#" className="hover:text-black">
                  💼
                </a>
                <a href="#" className="hover:text-black">
                  ▶️
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 MentalHealth Journal Platform. All rights reserved.</p>

            <p className="mt-2 md:mt-0">Built with ❤️ for mental wellness</p>
          </div>
        </footer>
      </AnimateSection>
    </main>
  );
}
