"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"; // ✅ adjust relative path if needed

export default function News() {
  const { t, i18n } = useTranslation();
  const [langReady, setLangReady] = useState(false);

  // ✅ Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr";
    setLangReady(true);
  }, [i18n]);

  if (!langReady) return null; // prevent flash

  const newsData = [
    {
      id: 1,
      title: t("newsSection.item1.title"),
      date: t("newsSection.item1.date"),
      excerpt: t("newsSection.item1.excerpt"),
      link: "/news/timss-2023-saudi",
      image: "images/news1.png",
    },
    {
      id: 2,
      title: t("newsSection.item2.title"),
      date: t("newsSection.item2.date"),
      excerpt: t("newsSection.item2.excerpt"),
      link: "/news/toefl-strategies",
      image: "images/news2.png",
    },
    {
      id: 3,
      title: t("newsSection.item3.title"),
      date: t("newsSection.item3.date"),
      excerpt: t("newsSection.item3.excerpt"),
      link: "/news/pisa-2025",
      image: "images/news3.png",
    },
  ];

  return (
    <div className="bg-gray-50 py-16" id="news">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-12 text-center">
          {t("newsSection.heading")}
        </h2>

        <div className="space-y-12">
          {newsData.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Image with animation */}
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow-lg"
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              />

              {/* Text with animation */}
              <motion.div
                className="md:w-1/2"
                initial={{ x: index % 2 === 0 ? 100 : -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <Link
                  href={item.link}
                  className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  {t("newsSection.readMore")}
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
