"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"; // ✅ adjust path if needed

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [langReady, setLangReady] = useState(false);

  // ✅ Restore language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr";
    setLangReady(true);
  }, [i18n]);

  const slides = [
    {
      id: 1,
      img: "images/hero1.png",
      title: t("hero.slide1.title"),
      desc: t("hero.slide1.desc"),
    },
    {
      id: 2,
      img: "images/hero2.png",
      title: t("hero.slide2.title"),
      desc: t("hero.slide2.desc"),
    },
    {
      id: 3,
      img: "images/hero3.png",
      title: t("hero.slide3.title"),
      desc: t("hero.slide3.desc"),
    },
  ];

  // Auto slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!langReady) return null; // ⏳ prevent flash until lang is applied

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6">
              {slide.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex space-x-4">
              <Link
                href="/exams"
                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md"
              >
                {t("hero.cta.start")}
              </Link>
              <Link
                href="#about"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition shadow-md"
              >
                {t("hero.cta.learn")}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-yellow-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
