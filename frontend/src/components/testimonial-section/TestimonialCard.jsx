
// components/TestimonialCard.jsx
export default function TestimonialCard({ quote, name, title }) {
  return (
    <div className="border border-gray-800 p-8 relative">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-8 h-8 bg-white"></div>
      <div className="mb-6 text-gray-400">
        "{quote}"
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

