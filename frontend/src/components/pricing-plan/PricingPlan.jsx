 
  // components/PricingPlan.jsx
  export default function PricingPlan({ title, audience, price, features, featured = false }) {
    return (
      <div className={`${featured ? 'border-2 border-white' : 'border border-gray-800 hover:border-gray-700'} p-8 relative transition duration-300`}>
        {featured && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 text-sm">
            Most Popular
          </div>
        )}
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <div className={`${featured ? 'text-gray-400' : 'text-gray-500'} mb-6`}>{audience}</div>
        <div className="text-3xl font-bold mb-6">{price.cost}<span className={`text-lg font-normal ${featured ? 'text-gray-400' : 'text-gray-500'}`}>{price.period}</span></div>
  
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className={`flex items-center ${featured ? 'text-gray-300' : 'text-gray-400'}`}>
              <div className="w-1.5 h-1.5 bg-white mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
  
        <button className={`w-full py-3 ${featured 
          ? 'bg-white text-black hover:bg-gray-100' 
          : 'border border-white border-opacity-30 hover:bg-white hover:bg-opacity-5'} transition text-center`}>
          {price.cost === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </button>
      </div>
    );
  }
  