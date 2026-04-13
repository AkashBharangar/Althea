import { useCallback } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/Header.jsx";
import { Landing } from "./components/Landing.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { softEase, duration } from "./lib/motion.js";

export default function App() {
  const scrollToReflect = useCallback(() => {
    document
      .getElementById("althea-reflect")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen pb-28">
      <Header />
      <Landing onReflect={scrollToReflect} />
      <motion.main
        id="althea-reflect"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.relaxed, delay: 0.05, ease: softEase }}
      >
        <Dashboard />
      </motion.main>
    </div>
  );
}
