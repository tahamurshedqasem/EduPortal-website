"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // ✅ import i18n
import {  useEffect } from "react";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    country: "",
    school: "",
    grade: "",
    preferred_exams: [],
  });
  const router = useRouter();
  const [message, setMessage] = useState("");
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          router.push("/dashboard"); // redirect if logged in
        }
      }, [router]);

  // 📌 Update input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 📌 Handle checkbox for preferred exams
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let newExams = [...form.preferred_exams];
    if (checked) {
      newExams.push(value);
    } else {
      newExams = newExams.filter((exam) => exam !== value);
    }
    setForm({ ...form, preferred_exams: newExams });
  };

  // 📌 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage(t("signupForm.errors.passwordMismatch"));
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword,
          age: form.age,
          gender: form.gender,
          country: form.country,
          school: form.school,
          grade: form.grade,
          preferred_exams: form.preferred_exams,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage(t("signupForm.success"));
        window.location.href = "/dashboard";
      } else {
        setMessage(
          t("signupForm.errors.serverError", { msg: data.message || "..." })
        );
      }
    } catch (error) {
      setMessage(t("signupForm.errors.connection"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* ✅ Page Content */}
      <main className="flex-grow flex items-center justify-center py-20">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
            {t("signupForm.title")}
          </h1>

          {message && (
            <p className="mb-4 text-center font-medium text-sm text-red-600">
              {message}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Full Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.fullName")}
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.fullName")}
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.email")}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.email")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.password")}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.password")}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.confirmPassword")}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.age")}
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.age")}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.gender")}
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("signupForm.placeholders.gender")}</option>
                <option value="male">{t("signupForm.genders.male")}</option>
                <option value="female">{t("signupForm.genders.female")}</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.country")}
              </label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.country")}
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.school")}
              </label>
              <input
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.school")}
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.grade")}
              </label>
              <input
                type="text"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t("signupForm.placeholders.grade")}
              />
            </div>

            {/* Preferred Exams */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("signupForm.preferredExams")}
              </label>
              <div className="flex gap-4 mt-2">
                <label>
                  <input
                    type="checkbox"
                    value="Math"
                    onChange={handleCheckbox}
                  />{" "}
                  {t("signupForm.exams.math")}
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Science"
                    onChange={handleCheckbox}
                  />{" "}
                  {t("signupForm.exams.science")}
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="English"
                    onChange={handleCheckbox}
                  />{" "}
                  {t("signupForm.exams.english")}
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {t("signupForm.submit")}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {t("signupForm.alreadyAccount")}{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              {t("signupForm.login")}
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
