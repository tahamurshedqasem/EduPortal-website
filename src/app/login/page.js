"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // ✅ i18n
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard"); // redirect if logged in
      }
    }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage(t("loginForm.success"));
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setMessage(data.message || t("loginForm.errors.invalid"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(t("loginForm.errors.connection"));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {t("loginForm.title")}
        </h1>

        {message && (
          <p
            className={`mb-4 text-center font-medium text-sm ${
              message.startsWith("✅") || message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("loginForm.email")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={t("loginForm.placeholders.email")}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("loginForm.password")}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={t("loginForm.placeholders.password")}
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              {t("loginForm.remember")}
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              {t("loginForm.forgot")}
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("loginForm.loading") : t("loginForm.submit")}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {t("loginForm.noAccount")}{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            {t("loginForm.signup")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
