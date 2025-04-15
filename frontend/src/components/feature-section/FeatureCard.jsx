// components/FeatureCard.jsx
export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="border border-gray-800 p-8 transition duration-300 hover:border-gray-700 hover:bg-black hover:bg-opacity-40 group">
      <div className="mb-4 p-3 inline-block bg-gray-900 rounded-none group-hover:bg-gray-800 transition-all">
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
