import { motion } from "framer-motion";

export default function InnovateSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#DEE7F1", minHeight: "100vh" }}
    >
      {/* Soft cinematic glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,170,140,0.55) 0%, rgba(255,140,180,0.25) 30%, rgba(200,200,255,0.15) 55%, rgba(222,231,241,0) 75%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-between px-6 py-12 md:px-12 md:py-16">
        {/* Top label */}
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-light tracking-tight text-black"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          TEAM A.
        </motion.h3>

        {/* Bottom row: headline + paragraph */}
        <div className="mt-24 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-light tracking-tight text-black"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 7rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            INNOVATE —<br />
            WITH A<br />
            HUMAN TOUCH.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="max-w-xs text-sm leading-relaxed md:max-w-sm md:text-base"
            style={{ color: "#2D2D2D" }}
          >
            Our design expertise and craftsmanship means we convert big,
            innovative ideas into powerful, accessible human experiences, which
            ignite emotions and provoke action.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
