"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Footer() {
  const { t, i18n } = useTranslation();

  // ✅ Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr"; // Flip page direction
  }, [i18n]);

  return (
    <footer className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Edu<span className="text-yellow-300">Portal</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t("footer.desc")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t("footer.quickLinks")}
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/" className="hover:text-yellow-300">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/exams" className="hover:text-yellow-300">
                {t("exams")}
              </Link>
            </li>
            <li>
              <Link href="/#news" className="hover:text-yellow-300">
                {t("news")}
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-yellow-300">
                {t("about")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Exams */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("footer.exams")}</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/" className="hover:text-yellow-300">
                TIMSS
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-yellow-300">
                PISA
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-yellow-300">
                PIRLS
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-yellow-300">
                TOEFL
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
          <p className="text-gray-300 text-sm mb-4 flex items-center gap-2">
            <Mail size={16} /> eduportal.initiative@gmail.com
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-yellow-300">
              <Facebook />
            </Link>
            <Link href="#" className="hover:text-yellow-300">
              <Twitter />
            </Link>
            <Link href="#" className="hover:text-yellow-300">
              <Instagram />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-900 text-center py-4 text-gray-300 text-sm">
        © {new Date().getFullYear()} EduPortal. {t("footer.copyright")}
      </div>
    </footer>
  );
}
