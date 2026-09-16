// src/components/FeatureCard.jsx
// Reusable card for accessibility feature blocks, used across the landing page
// and potentially in course/dashboard pages in later phases.

/**
 * @param {object}        props
 * @param {React.ReactNode} props.icon       - Icon element (Lucide or any SVG)
 * @param {string}        props.title        - Card heading
 * @param {string[]}      props.items        - Bullet list of features
 * @param {string}        [props.iconBg]     - Tailwind bg class for icon container
 * @param {string}        [props.accentColor]- Tailwind text class for bullet dots
 * @param {string}        [props.className]  - Extra classes on the card wrapper
 */
export default function FeatureCard({
  icon,
  title,
  items = [],
  iconBg = "bg-indigo-100",
  accentColor = "text-indigo-500",
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 ${className}`}
    >
      {/* Icon badge */}
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      {/* Feature list */}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${accentColor.replace("text-", "bg-")}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
