"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"; // ✅ initialize translations

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en"); // default

 useEffect(() => {
   // ✅ restore login
   const token = localStorage.getItem("token");
   setIsLoggedIn(!!token);

   // ✅ restore language
   const savedLang = localStorage.getItem("lang") || "en";
   i18n.changeLanguage(savedLang);
   setLang(savedLang);

   // ✅ update direction + html lang attribute
   document.documentElement.lang = savedLang;
   document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

   setHydrated(true);
 }, [i18n]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

const switchLang = () => {
  const newLang = lang === "en" ? "ar" : "en";
  i18n.changeLanguage(newLang);
  setLang(newLang);
  localStorage.setItem("lang", newLang); // ✅ persist language
  document.documentElement.lang = newLang; // ✅ set <html lang="">
  document.dir = newLang === "ar" ? "rtl" : "ltr"; // ✅ direction
};

  if (!hydrated) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-wide">
            Edu<span className="text-yellow-300">Portal</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide">
          Edu<span className="text-yellow-300">Portal</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link href="/" className="hover:text-yellow-300 transition">
            {t("home")}
          </Link>
          <Link href="/exams" className="hover:text-yellow-300 transition">
            {t("exams")}
          </Link>
          <Link href="/#news" className="hover:text-yellow-300 transition">
            {t("news")}
          </Link>
          <Link href="/#about" className="hover:text-yellow-300 transition">
            {t("about")}
          </Link>
        </div>

        {/* Auth buttons + Lang switch */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {t("dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
              >
                {t("signup")}
              </Link>
            </>
          )}
          {/* Language Switcher */}
          <button
            onClick={switchLang}
            className="px-3 py-1 bg-yellow-400 text-black rounded"
          >
            {lang === "en" ? "AR" : "EN"}
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-3">
          <Link href="/" className="block hover:text-yellow-300">
            {t("home")}
          </Link>
          <Link href="/exams" className="block hover:text-yellow-300">
            {t("exams")}
          </Link>
          <Link href="/#news" className="block hover:text-yellow-300">
            {t("news")}
          </Link>
          <Link href="/#about" className="block hover:text-yellow-300">
            {t("about")}
          </Link>
          <hr className="border-blue-500" />
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg"
              >
                {t("dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="block bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg"
              >
                {t("signup")}
              </Link>
            </>
          )}

          {/* Mobile Language Switcher */}
          <button
            onClick={switchLang}
            className="w-full px-3 py-2 bg-yellow-400 text-black rounded mt-2"
          >
            {lang === "en" ? "AR" : "EN"}
          </button>
        </div>
      )}
    </nav>
  );
}
