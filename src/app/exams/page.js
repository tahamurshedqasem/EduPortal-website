"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ExamPage() {
  const { t } = useTranslation();
  const [examType, setExamType] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const router = useRouter();

  const SECRET_KEY = "exam-secret-key-123"; // ⚠️ change in production

  // Encrypt
  const encryptData = (data) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const startExam = async () => {
    try {
      setLoading(true); // ✅ start loader
      const lang = localStorage.getItem("lang") || "en";

      const response = await fetch("http://127.0.0.1:8000/api/exams/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examType,
          grade,
          subject,
          count: 4,
          lang, // ✅ send language
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(
          t("examSettings.failed", { msg: data.message || "Unknown error" })
        );
        setLoading(false);
        return;
      }

      // Prepare exam object
      const examData = {
        examType,
        grade,
        subject,
        timeLimit: data.timeLimit || "10 minutes",
        questions: data.questions.map((q) => ({
          ...q,
          studentAnswer: null,
        })),
      };

      // Encrypt before storing
      const encryptedExam = encryptData(examData);
      localStorage.setItem("currentExam", encryptedExam);

      router.push(`/exams/${examType.toLowerCase()}`);
    } catch (err) {
      console.error("startExam failed:", err);
      alert(t("examSettings.error"));
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          {t("examSettings.title")}
        </h2>

        <input
          type="text"
          placeholder={t("examSettings.examType")}
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="text"
          placeholder={t("examSettings.grade")}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="text"
          placeholder={t("examSettings.subject")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <button
          onClick={startExam}
          disabled={loading}
          className={`w-full mt-3 py-3 rounded font-semibold transition 
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {loading ? (
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t("examSettings.loading")}
            </motion.div>
          ) : (
            t("examSettings.start")
          )}
        </button>
      </div>
    </div>
  );
}
