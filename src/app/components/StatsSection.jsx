"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Users, FileBarChart, TrendingUp, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"; // ✅ make sure this is imported

const API_BASE = "http://127.0.0.1:8000/api";
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function StatsSection() {
  const { t, i18n } = useTranslation();
  const [langReady, setLangReady] = useState(false);

  // ✅ load saved lang
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.dir = savedLang === "ar" ? "rtl" : "ltr";
    setLangReady(true);
  }, [i18n]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [overview, setOverview] = useState(null);
  const [byType, setByType] = useState([]);
  const [byGrade, setByGrade] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [oRes, tRes, gRes] = await Promise.all([
          fetch(`${API_BASE}/stats/overview`, { headers }),
          fetch(`${API_BASE}/stats/exams-by-type`, { headers }),
          fetch(`${API_BASE}/stats/scores-by-grade`, { headers }),
        ]);

        if (!oRes.ok || !tRes.ok || !gRes.ok) {
          throw new Error("Failed to fetch one or more endpoints.");
        }

        const [oJson, tJson, gJson] = await Promise.all([
          oRes.json(),
          tRes.json(),
          gRes.json(),
        ]);

        if (!isMounted) return;
        setOverview(oJson);
        setByType(tJson);
        setByGrade(gJson);
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const pieData = useMemo(
    () =>
      byType.map((r, idx) => ({
        name: r.exam_type,
        value: r.exams,
        color: COLORS[idx % COLORS.length],
      })),
    [byType]
  );

  const barData = useMemo(
    () => byGrade.map((r) => ({ grade: r.grade, avg: r.avg_score })),
    [byGrade]
  );

  if (!langReady) return null; // ⏳ wait for lang to load

  return (
    <section className="w-full rounded-2xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-md">
      <header className="mb-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-700"
        >
          {t("stats.heading")}
        </motion.h2>
        <p className="mt-1 text-sm text-gray-600">{t("stats.subheading")}</p>
      </header>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && overview && (
        <>
          {/* Stat Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                label={t("stats.totalUsers.label")}
                value={overview.total_users}
                hint={t("stats.totalUsers.hint")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatCard
                icon={<FileBarChart className="h-6 w-6 text-green-600" />}
                label={t("stats.totalExams.label")}
                value={overview.total_exams}
                hint={t("stats.totalExams.hint")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatCard
                icon={<TrendingUp className="h-6 w-6 text-yellow-600" />}
                label={t("stats.avgScore.label")}
                value={`${overview.avg_score.toFixed(2)}%`}
                hint={t("stats.avgScore.hint")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatCard
                icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
                label={t("stats.passRate.label")}
                value={`${overview.pass_rate_pct.toFixed(2)}%`}
                hint={t("stats.passRate.hint")}
              />
            </motion.div>
          </motion.div>

          {/* Charts */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-8 grid gap-6 lg:grid-cols-2"
          >
            {/* Pie Chart */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  {t("stats.charts.byType")}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  {t("stats.charts.byGrade")}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="avg"
                        name={t("stats.avgScore.label")}
                        fill="#2563eb"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </section>
  );
}

// ✅ Stat Card
function StatCard({ icon, label, value, hint }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { duration: 2, stiffness: 100, damping: 15 });
  const rounded = useTransform(spring, (latest) =>
    typeof value === "number"
      ? Math.floor(latest).toLocaleString()
      : value.endsWith("%")
      ? latest.toFixed(2)
      : value
  );

  useEffect(() => {
    if (typeof value === "number") {
      count.set(value);
    } else if (typeof value === "string" && value.endsWith("%")) {
      const num = parseFloat(value);
      count.set(num);
    }
  }, [value, count]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-start rounded-xl border border-gray-100 bg-white p-5 shadow"
    >
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>

      <motion.p className="mt-1 text-3xl font-bold text-gray-800">
        {typeof value === "number" ? (
          <motion.span>{rounded}</motion.span>
        ) : (
          value
        )}
      </motion.p>

      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </motion.div>
  );
}
