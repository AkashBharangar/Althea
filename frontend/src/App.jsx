import { useCallback } from "react";
import { Header } from "./components/Header.jsx";
import { Landing } from "./components/Landing.jsx";
import { Dashboard } from "./components/Dashboard.jsx";

export default function App() {
  const scrollToReflect = useCallback(() => {
    document
      .getElementById("althea-reflect")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <Landing onReflect={scrollToReflect} />
      <main
        id="althea-reflect"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-12 sm:px-6 lg:px-8"
      >
        <Dashboard />
      </main>
    </div>
  );
}
