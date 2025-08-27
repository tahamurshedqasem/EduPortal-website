"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"; // ✅ adjust path if needed

export default function About() {
  const { t, i18n } = useTranslation();
  const [langReady, setLangReady] = useState(false);

  // ✅ Load language from localStorage and set dir
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr";
    setLangReady(true);
  }, [i18n]);

  if (!langReady) return null; // ⏳ prevent flash until lang is loaded

  return (
    <div className="bg-white py-16" id="about">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-blue-700 mb-12 text-center">
          {t("aboutSection.heading")}
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.img
            src="images/about.png"
            alt="About EduPortal"
            className="w-full h-full object-cover rounded-xl shadow-lg"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          {/* Text */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t("aboutSection.description")}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="font-bold text-blue-700 mb-2">
                  {t("aboutSection.highlights.ai.title")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("aboutSection.highlights.ai.desc")}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="font-bold text-blue-700 mb-2">
                  {t("aboutSection.highlights.library.title")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("aboutSection.highlights.library.desc")}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="font-bold text-blue-700 mb-2">
                  {t("aboutSection.highlights.progress.title")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("aboutSection.highlights.progress.desc")}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="font-bold text-blue-700 mb-2">
                  {t("aboutSection.highlights.anywhere.title")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("aboutSection.highlights.anywhere.desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
