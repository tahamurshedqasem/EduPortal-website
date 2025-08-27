"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const exams = [
  {
    id: 1,
    name: "TIMSS",
    desc: "International Math & Science study for Grade 4 & 8.",
    img: "/images/timss.png",
    link: "/exams/timss",
    instructions: [
      "Duration: 30 minutes",
      "Questions: 10 multiple-choice + 2 open-ended",
      "You cannot go back once you submit",
      "Stay focused and manage your time wisely",
    ],
  },
  {
    id: 2,
    name: "PISA",
    desc: "Programme for International Student Assessment.",
    img: "/images/pisa.png",
    link: "/exams/pisa",
    instructions: [
      "Duration: 40 minutes",
      "Focus on problem-solving and critical thinking",
      "All answers are final after submission",
    ],
  },
  {
    id: 3,
    name: "PIRLS",
    desc: "Reading Literacy study for Grade 4 students.",
    img: "/images/pirls.png",
    link: "/exams/pirls",
    instructions: [
      "Duration: 25 minutes",
      "Read the passages carefully before answering",
      "Choose the best option for each question",
    ],
  },
  {
    id: 4,
    name: "TOEFL",
    desc: "English proficiency exam for university admission.",
    img: "/images/toefl.png",
    link: "/exams/toefl",
    instructions: [
      "Duration: 60 minutes",
      "Covers Reading, Listening, and Writing tasks",
      "Ensure a quiet environment before starting",
    ],
  },
];

export default function ExamsSection() {
  const [selectedExam, setSelectedExam] = useState(null);

  return (
    <div>
      {/* Exam Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src={exam.img}
              alt={exam.name}
              className="w-full h-40 object-contain p-4 bg-gray-50"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {exam.name}
              </h3>
              <p className="text-gray-600 mb-4">{exam.desc}</p>
              <button
                onClick={() => setSelectedExam(exam)}
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Start Exam →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Exam Logo */}
            <div className="flex justify-center mb-4">
              <img
                src={selectedExam.img}
                alt={`${selectedExam.name} logo`}
                className="w-20 h-20 object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              {selectedExam.name} Instructions
            </h2>

            {/* Warning */}
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4">
              <AlertTriangle className="mr-2" size={20} />
              <p className="text-sm font-semibold">
                Once you start the exam, the timer will begin. Do not refresh or
                leave the page.
              </p>
            </div>

            {/* Instructions */}
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              {selectedExam.instructions.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <Link
                href={selectedExam.link}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Exam
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
