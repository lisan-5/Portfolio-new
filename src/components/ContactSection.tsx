import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Linkedin, Github, Phone } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/lisanegebriel-abay" },
  { icon: Github, label: "GitHub", href: "https://github.com/lisan-5" },
  { label: "Telegram", href: "https://t.me/ligator" },
  { label: "LeetCode", href: "https://leetcode.com/u/lisanx/" },
  { label: "X", href: "https://x.com/lisanabay" },
  { icon: Phone, label: "+251964011087", href: "tel:+251964011087" },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/mnnqjkkb", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Form submission failed");

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // ESTABLISH CONNECTION
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Let's build something<br />
          <span className="text-gradient-cyber">extraordinary</span><span className="text-cyber">.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-12 max-w-lg text-sm leading-relaxed text-slate-mid">
          Have a project in mind or want to discuss AI-driven solutions? Drop me a message.
        </motion.p>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            action="https://formspree.io/f/mnnqjkkb"
            method="POST"
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-border bg-transparent px-4 py-3 font-mono-tech text-sm text-foreground outline-none transition-colors focus:border-cyber"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">EMAIL</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-border bg-transparent px-4 py-3 font-mono-tech text-sm text-foreground outline-none transition-colors focus:border-cyber"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">MESSAGE</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none border border-border bg-transparent px-4 py-3 font-mono-tech text-sm text-foreground outline-none transition-colors focus:border-cyber"
                placeholder="Tell me about your project..."
              />
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              className="group flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono-tech text-xs tracking-[0.15em] text-primary-foreground transition-all duration-200 hover:bg-transparent hover:text-foreground"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                <>SENDING...</>
              ) : submitted ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  SENT
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  SEND MESSAGE
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Social Links */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">// CONNECT</div>
            <div className="space-y-2">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-border px-4 py-3 font-mono-tech text-[11px] tracking-wider text-slate-mid transition-all duration-200 hover:border-cyber hover:text-cyber"
                  whileHover={{ x: 4 }}
                >
                  {s.icon && <s.icon className="h-4 w-4" />}
                  {!s.icon && <span className="h-4 w-4 text-center text-[10px] font-bold">{s.label.slice(0, 2).toUpperCase()}</span>}
                  <span>{s.label}</span>
                  <span className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-4">
              <span className="font-mono-tech text-sm text-cyber">
                lisan5abay@gmail.com
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
