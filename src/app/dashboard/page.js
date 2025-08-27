// "use client";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useTranslation } from "react-i18next";

// export default function DashboardPage() {
//   const { t } = useTranslation();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://127.0.0.1:8000/api/profile", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         setStudent({
//           name: data.user.full_name,
//           stats: {
//             totalExams: data.stats.total_exams,
//             passed: data.stats.passed,
//             averageScore: data.stats.average_score,
//           },
//           recentExams: data.recent_exams.map((exam, index) => ({
//             id: index,
//             name: `${exam.exam_type} (Grade ${exam.grade})`,
//             score: exam.score,
//             status: exam.score >= 60 ? "passed" : "failed",
//           })),
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error("❌ Failed to fetch profile:", err);
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return <p className="p-8">{t("dashboardSection.loading")}</p>;
//   }

//   if (!student) {
//     return <p className="p-8 text-red-500">{t("dashboardSection.error")}</p>;
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <motion.h1
//         className="text-3xl font-bold text-gray-800 mb-6"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {t("dashboardSection.welcome", { name: student.name })}
//       </motion.h1>

//       {/* Stats Section */}
//       <div className="grid md:grid-cols-3 gap-6 mb-10">
//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg text-center"
//           whileHover={{ scale: 1.05 }}
//         >
//           <h2 className="text-lg font-semibold text-gray-600">
//             {t("dashboardSection.stats.totalExams")}
//           </h2>
//           <p className="text-3xl font-bold text-blue-600">
//             {student.stats.totalExams}
//           </p>
//         </motion.div>

//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg text-center"
//           whileHover={{ scale: 1.05 }}
//         >
//           <h2 className="text-lg font-semibold text-gray-600">
//             {t("dashboardSection.stats.passed")}
//           </h2>
//           <p className="text-3xl font-bold text-green-600">
//             {student.stats.passed}
//           </p>
//         </motion.div>

//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg text-center"
//           whileHover={{ scale: 1.05 }}
//         >
//           <h2 className="text-lg font-semibold text-gray-600">
//             {t("dashboardSection.stats.averageScore")}
//           </h2>
//           <p className="text-3xl font-bold text-purple-600">
//             {student.stats.averageScore}%
//           </p>
//         </motion.div>
//       </div>

//       {/* Recent Exams */}
//       <motion.h2
//         className="text-2xl font-semibold text-gray-800 mb-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         {t("dashboardSection.recentExams")}
//       </motion.h2>
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="p-4">{t("dashboardSection.exam")}</th>
//               <th className="p-4">{t("dashboardSection.score")}</th>
//               <th className="p-4">{t("dashboardSection.status")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {student.recentExams.map((exam) => (
//               <tr
//                 key={exam.id}
//                 className="border-t hover:bg-gray-50 transition"
//               >
//                 <td className="p-4 font-medium">{exam.name}</td>
//                 <td className="p-4">{exam.score}%</td>
//                 <td
//                   className={`p-4 font-semibold ${
//                     exam.status === "passed" ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {t(`dashboardSection.${exam.status}`)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Start Exam Button */}
//       <div className="mt-8 text-center">
//         <Link href="/exams">
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
//             {t("dashboardSection.startExam")}
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ for redirects
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 Redirect if not logged in
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ fixed template
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unauthorized");
        }

        setStudent({
          name: data.user.full_name,
          stats: {
            totalExams: data.stats.total_exams,
            passed: data.stats.passed,
            averageScore: data.stats.average_score,
          },
          recentExams: data.recent_exams.map((exam, index) => ({
            id: index,
            name: `${exam.exam_type} (Grade ${exam.grade})`,
            score: exam.score,
            status: exam.score >= 60 ? "passed" : "failed",
          })),
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        localStorage.removeItem("token"); // clear invalid token
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  // ⏳ Animated Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  if (!student) {
    return <p className="p-8 text-red-500">{t("dashboardSection.error")}</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t("dashboardSection.welcome", { name: student.name })}
      </motion.h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label={t("dashboardSection.stats.totalExams")}
          value={student.stats.totalExams}
          color="text-blue-600"
        />
        <StatCard
          label={t("dashboardSection.stats.passed")}
          value={student.stats.passed}
          color="text-green-600"
        />
        <StatCard
          label={t("dashboardSection.stats.averageScore")}
          value={`${student.stats.averageScore}%`}
          color="text-purple-600"
        />
      </div>

      {/* Recent Exams */}
      <motion.h2
        className="text-2xl font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("dashboardSection.recentExams")}
      </motion.h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">{t("dashboardSection.exam")}</th>
              <th className="p-4">{t("dashboardSection.score")}</th>
              <th className="p-4">{t("dashboardSection.status")}</th>
            </tr>
          </thead>
          <tbody>
            {student.recentExams.map((exam) => (
              <tr
                key={exam.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{exam.name}</td>
                <td className="p-4">{exam.score}%</td>
                <td
                  className={`p-4 font-semibold ${
                    exam.status === "passed" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t(`dashboardSection.${exam.status}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Exam Button */}
      <div className="mt-8 text-center">
        <Link href="/exams">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
            {t("dashboardSection.startExam")}
          </button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
    >
      <h2 className="text-lg font-semibold text-gray-600">{label}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}
