import PricingPlan from './PricingPlan';
  
export default function PricingSection({ pricingRef, scrollY }) {
  const pricingPlans = [
    {
      title: "Standard",
      audience: "For individuals",
      price: {
        cost: "$29",
        period: "/month"
      },
      features: [
        "Basic voice commands",
        "2 voice personas",
        "Standard response time",
        "Email support"
      ]
    },
    {
      title: "Professional",
      audience: "For teams",
      price: {
        cost: "$79",
        period: "/month"
      },
      features: [
        "Advanced voice commands",
        "5 custom voice personas",
        "Priority response time",
        "24/7 priority support",
        "API access"
      ],
      featured: true
    },
    {
      title: "Enterprise",
      audience: "For organizations",
      price: {
        cost: "Custom",
        period: " pricing"
      },
      features: [
        "Full feature access",
        "Unlimited voice personas",
        "Dedicated infrastructure",
        "Custom integration",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <section
      ref={pricingRef}
      className="pt-24 relative overflow-hidden"
      // style={{ background: 'linear-gradient(to bottom, #050505, #000000)' }}
    >
      {/* Parallax decorative elements */}
      <div
        className="absolute left-1/4 top-1/3 w-96 h-96 border border-white opacity-5 rounded-full"
        style={{ transform: `translateY(${(scrollY - 2000) * 0.1}px) rotate(${scrollY * 0.01}deg)` }}
      ></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the plan that best suits your needs, from individual use to enterprise solutions
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingPlan
              key={index}
              title={plan.title}
              audience={plan.audience}
              price={plan.price}
              features={plan.features}
              featured={plan.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

