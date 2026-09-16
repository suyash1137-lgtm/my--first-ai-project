// src/components/landing/ForTeachersSection.jsx
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Users,
  ClipboardList,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: <BarChart3 className="w-5 h-5 text-green-600" aria-hidden="true" />,
    title: "Progress Tracking",
    description:
      "See every student's course progress and quiz scores at a glance — broken down by lesson.",
  },
  {
    icon: <Bell className="w-5 h-5 text-red-500" aria-hidden="true" />,
    title: "Intervention Alerts",
    description:
      "Get flagged when a student falls below a threshold or hasn't engaged in a while — act before they fall behind.",
  },
  {
    icon: <Users className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
    title: "Student Profiles",
    description:
      "Know each student's accessibility needs upfront — no guessing, no assumptions, personalisation by design.",
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-yellow-600" aria-hidden="true" />,
    title: "Course Management",
    description:
      "Build structured courses with lessons and quizzes. Content is automatically formatted for accessibility.",
  },
  {
    icon: <PlusCircle className="w-5 h-5 text-blue-500" aria-hidden="true" />,
    title: "Easy Course Creation",
    description:
      "No technical skills needed. Create and publish a course in minutes using a guided, step-by-step builder.",
  },
];

export default function ForTeachersSection() {
  return (
    <section
      className="bg-white py-20 px-4"
      aria-labelledby="for-teachers-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Benefits side */}
          <div className="space-y-4 order-2 lg:order-1">
            {benefits.map(({ icon, title, description }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-gray-50 rounded-xl border border-gray-100 p-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                For Teachers
              </span>
            </div>
            <h2
              id="for-teachers-heading"
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight"
            >
              Teach smarter.{" "}
              <span className="text-emerald-600">Reach every student.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
              Saral Shiksha gives teachers real-time visibility into how every
              student is learning — and the tools to act on it. No more flying
              blind.
            </p>

            {/* Highlight stat */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 mb-8">
              <p className="text-emerald-800 text-sm leading-relaxed">
                <span className="font-bold text-emerald-900">Intervention alerts</span> notify
                you the moment a student's score drops below 40% or engagement stops — before
                it becomes a crisis.
              </p>
            </div>

            <Link
              to="/teacher/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Teacher Dashboard
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
