"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Hero from "./components/Hero";
import News from "./components/News";
import About from "./components/About";
import ExploreExams from "./components/ExploreExams";
import StatsSection from "./components/StatsSection";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // ✅ Restore lang from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr"; // flip layout
    setHydrated(true);
  }, [i18n]);

  if (!hydrated) {
    // ✅ Loader until language is ready
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="max-w-5xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">
          {t("homePage.welcome")}
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          {t("homePage.description")}
        </p>
      </div>
      <News />
      <About />
      <StatsSection />
      <ExploreExams />
    </div>
  );
}
