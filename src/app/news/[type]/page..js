// "use client";
// import { useState, useEffect } from "react";
// import CryptoJS from "crypto-js";
// import { useRouter } from "next/navigation";
// import { useTranslation } from "react-i18next"; // ✅ import

// export default function ExamPage() {
//   const { t } = useTranslation(); // ✅ hook
//   const [currentExam, setCurrentExam] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(null);
//   const [recommendation, setRecommendation] = useState("");

//   const router = useRouter();
//   const SECRET_KEY = "exam-secret-key-123";

//   // Encrypt/Decrypt helpers
//   const encryptData = (data) =>
//     CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
//   const decryptData = (ciphertext) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
//       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     } catch {
//       return null;
//     }
//   };

//   // Load exam from localStorage
//   useEffect(() => {
//     const examData = localStorage.getItem("currentExam");
//     const savedAnswers = localStorage.getItem("studentAnswers");

//     if (examData) {
//       const parsed = decryptData(examData);
//       if (parsed) {
//         setCurrentExam(parsed);
//         const minutes = parseInt(parsed.timeLimit) || 10;
//         setTimeLeft(minutes * 60);
//       }
//     }
//     if (savedAnswers) {
//       const parsedAnswers = decryptData(savedAnswers);
//       if (parsedAnswers) setAnswers(parsedAnswers);
//     }
//   }, []);

//   // Timer
//   useEffect(() => {
//     if (!timeLeft || submitted) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   // Save answer
//   const handleAnswer = (questionIndex, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   // Submit
//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://127.0.0.1:8000/api/exams/evaluate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           examType: currentExam.examType,
//           grade: currentExam.grade,
//           subject: currentExam.subject,
//           answers: currentExam.questions.map((q, i) => ({
//             question: q.question,
//             options: q.options,
//             student_answer: answers[i] || null,
//             correct_answer: q.correct_answer,
//           })),
//         }),
//       });

//       const result = await response.json();
//       setScore(result.score);

//       if (result.score >= 90) {
//         setRecommendation(t("exam.recommendation.excellent"));
//       } else if (result.score >= 70) {
//         setRecommendation(t("exam.recommendation.good"));
//       } else {
//         setRecommendation(t("exam.recommendation.practice"));
//       }

//       setSubmitted(true);
//     } catch (err) {
//       console.error("❌ Failed to save exam:", err);
//     }
//   };

//   // Retry
//   const handleRetry = () => {
//     localStorage.removeItem("studentAnswers");
//     setAnswers({});
//     setCurrentIndex(0);
//     setScore(null);
//     setSubmitted(false);
//     const minutes = parseInt(currentExam.timeLimit) || 10;
//     setTimeLeft(minutes * 60);
//   };

//   if (!currentExam) return <p>{t("exam.loading")}</p>;

//   const currentQuestion = currentExam.questions[currentIndex];
//   const options = Array.isArray(currentQuestion.options)
//     ? currentQuestion.options
//     : Object.values(currentQuestion.options);

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-bold mb-2">
//         {currentExam.examType} - Grade {currentExam.grade} (
//         {currentExam.subject})
//       </h2>

//       {!submitted && (
//         <p className="text-red-600 font-bold mb-4">
//           {t("exam.timeLeft")}: {Math.floor(timeLeft / 60)}:
//           {("0" + (timeLeft % 60)).slice(-2)}
//         </p>
//       )}

//       {!submitted ? (
//         <>
//           <h3 className="text-lg font-semibold mb-3">
//             {t("exam.question", {
//               index: currentIndex + 1,
//               question: currentQuestion.question,
//             })}
//           </h3>

//           <div className="space-y-2">
//             {options.map((option, i) => (
//               <button
//                 key={i}
//                 onClick={() => handleAnswer(currentIndex, option)}
//                 className={`w-full text-left px-4 py-2 rounded border ${
//                   answers[currentIndex] === option
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {i + 1}) {option}
//               </button>
//             ))}
//           </div>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
//               disabled={currentIndex === 0}
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               {t("exam.previous")}
//             </button>
//             {currentIndex < currentExam.questions.length - 1 ? (
//               <button
//                 onClick={() => setCurrentIndex((i) => i + 1)}
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//               >
//                 {t("exam.next")}
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//               >
//                 {t("exam.submit")}
//               </button>
//             )}
//           </div>
//         </>
//       ) : (
//         <div className="text-center">
//           <h3 className="text-2xl font-bold mb-2">{t("exam.finished")}</h3>
//           <p className="text-lg">{t("exam.score", { score })}</p>
//           <p className="text-md mt-2">{recommendation}</p>

//           <div className="flex justify-center gap-4 mt-4">
//             <button
//               onClick={handleRetry}
//               className="px-4 py-2 bg-yellow-500 text-white rounded"
//             >
//               {t("exam.retry")}
//             </button>
//             <button
//               onClick={() => router.push("/exams")}
//               className="px-4 py-2 bg-gray-700 text-white rounded"
//             >
//               {t("exam.back")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ExamPage() {
  const { t, i18n } = useTranslation();
  const [currentExam, setCurrentExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [lang, setLang] = useState("en");

  const router = useRouter();
  const SECRET_KEY = "exam-secret-key-123";

  // Encrypt/Decrypt
  const encryptData = (data) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  const decryptData = (ciphertext) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return null;
    }
  };

  // Load exam + language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr";

    const examData = localStorage.getItem("currentExam");
    const savedAnswers = localStorage.getItem("studentAnswers");

    if (examData) {
      const parsed = decryptData(examData);
      if (parsed) {
        setCurrentExam(parsed);
        const minutes = parseInt(parsed.timeLimit) || 10;
        setTimeLeft(minutes * 60);
      }
    }
    if (savedAnswers) {
      const parsedAnswers = decryptData(savedAnswers);
      if (parsedAnswers) setAnswers(parsedAnswers);
    }
  }, [i18n]);

  // Timer
  useEffect(() => {
    if (!timeLeft || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // Save answer
  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Submit exam
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/exams/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examType: currentExam.examType,
          grade: currentExam.grade,
          subject: currentExam.subject,
          lang, // ✅ send current lang
          answers: currentExam.questions.map((q, i) => ({
            question: q.question,
            options: q.options,
            student_answer: answers[i] || null,
            correct_answer: q.correct_answer,
          })),
        }),
      });

      const result = await response.json();
      setScore(result.score);

      if (result.score >= 90) {
        setRecommendation(t("exam.recommendation.excellent"));
      } else if (result.score >= 70) {
        setRecommendation(t("exam.recommendation.good"));
      } else {
        setRecommendation(t("exam.recommendation.practice"));
      }

      setSubmitted(true);
    } catch (err) {
      console.error("❌ Failed to save exam:", err);
    }
  };

  if (!currentExam) return <p>{t("exam.loading")}</p>;

  const currentQuestion = currentExam.questions[currentIndex];
  const options = Array.isArray(currentQuestion.options)
    ? currentQuestion.options
    : Object.values(currentQuestion.options);

  return (
    <div
      className={`p-6 max-w-md mx-auto bg-white shadow-md rounded-lg ${
        lang === "ar" ? "text-right font-[Cairo]" : "text-left font-sans"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">
        {currentExam.examType} - {t("exam.grade")} {currentExam.grade} (
        {currentExam.subject})
      </h2>

      {!submitted && (
        <p className="text-red-600 font-bold mb-4">
          ⏳ {t("exam.timeLeft")}: {Math.floor(timeLeft / 60)}:
          {("0" + (timeLeft % 60)).slice(-2)}
        </p>
      )}

      {!submitted ? (
        <>
          <h3 className="text-lg font-semibold mb-3">
            {t("exam.question", {
              index: currentIndex + 1,
              question: currentQuestion.question,
            })}
          </h3>

          <div className="space-y-2">
            {options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(currentIndex, option)}
                className={`w-full text-${
                  lang === "ar" ? "right" : "left"
                } px-4 py-2 rounded border ${
                  answers[currentIndex] === option
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}) {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              {t("exam.previous")}
            </button>
            {currentIndex < currentExam.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {t("exam.next")}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {t("exam.submit")}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{t("exam.finished")}</h3>
          <p className="text-lg">{t("exam.score", { score })}</p>
          <p className="text-md mt-2">{recommendation}</p>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              {t("exam.retry")}
            </button>
            <button
              onClick={() => router.push("/exams")}
              className="px-4 py-2 bg-gray-700 text-white rounded"
            >
              {t("exam.back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
