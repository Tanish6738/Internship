import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-orange-50 to-white pt-[4em] pb-20 px-6 md:px-12 lg:px-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-orange-600 text-center relative inline-block mx-auto mb-8">
          <span className="relative z-10">About Our Company</span>
          <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-200 -z-10 transform -rotate-1"></span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-10 items-center mt-10">
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0" 
              alt="Our team" 
              className="rounded-lg shadow-xl w-full object-cover h-[400px] border-2 border-orange-100"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-4">
              Our Story
            </h2>
            <p className="text-orange-900 text-lg">
              Founded in 2020, we are a passionate team of technology enthusiasts committed to bringing the latest and most innovative gadgets directly to your doorstep. Our journey began with a simple idea: make high-quality tech accessible to everyone.
            </p>
            <p className="text-orange-900 text-lg">
              What started as a small online shop has grown into a trusted e-commerce platform serving thousands of customers nationwide. We take pride in our carefully curated selection of products, exceptional customer service, and lightning-fast delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality First",
              icon: "📱",
              description: "We never compromise on quality. Every product in our store undergoes rigorous testing and verification."
            },
            {
              title: "Customer Satisfaction",
              icon: "🛍️",
              description: "Your satisfaction is our top priority. Our support team is available 24/7 to assist with any questions or concerns."
            },
            {
              title: "Innovation",
              icon: "💡",
              description: "We're constantly on the lookout for the latest tech innovations to bring them directly to our customers."
            }
          ].map((value, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg p-8 border border-orange-100 hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-orange-600 mb-2">{value.title}</h3>
              <p className="text-orange-800">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              position: "CEO & Founder",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
              description: "With over 15 years in the tech industry, Alex leads our company vision and strategy."
            },
            {
              name: "Sarah Chen",
              position: "Chief Product Officer",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
              description: "Sarah oversees our product selection and ensures we offer only the best technology."
            },
            {
              name: "Michael Rivera",
              position: "Customer Experience Lead",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
              description: "Michael and his team work tirelessly to ensure every customer has an exceptional experience."
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white to-[#fff7ed] rounded-md shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 border border-orange-100"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-600 mb-1">{member.name}</h3>
                <p className="text-orange-500 mb-3 font-medium">{member.position}</p>
                <p className="text-orange-800">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="max-w-5xl mx-auto my-20 text-center bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-xl p-10">
        <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          We're more than just an online store - we're your technology partner. Get in touch with us today to learn more about our products or services.
        </p>
        <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-100 transition-colors duration-300 shadow-md">
          Contact Us
        </button>
      </div>
    </div>
  )
}

export default About