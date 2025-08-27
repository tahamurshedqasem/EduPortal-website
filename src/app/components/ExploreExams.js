"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ExploreExams() {
  const { t, i18n } = useTranslation();

  // ✅ Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr"; // flip direction if Arabic
  }, [i18n]);

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-center text-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        {t("exploreExams.heading")}
      </h2>
      <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
        {t("exploreExams.desc")}
      </p>
      <Link
        href="/exams"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md"
      >
        {t("exploreExams.cta")}
      </Link>
    </motion.div>
  );
}
