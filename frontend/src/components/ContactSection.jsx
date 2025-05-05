import { ArrowRight } from 'lucide-react';
  
export default function ContactSection({ contactRef }) {
  return (
    <section
      ref={contactRef}
      className="py-24 relative overflow-hidden"
      // style={{
      //   background: 'linear-gradient(to bottom, #000000, #050505)'
      // }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions or ready to experience TVARA? We're here to help.
          </p>
        </div>

        {/* Contact form and info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="border border-gray-800 p-8">
            <h3 className="text-xl font-medium mb-6">Send us a message</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 px-4 py-3 focus:border-white focus:outline-none transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-black border border-gray-800 px-4 py-3 focus:border-white focus:outline-none transition"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Message</label>
                <textarea
                  className="w-full bg-black border border-gray-800 px-4 py-3 focus:border-white focus:outline-none h-32 transition"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-white text-black hover:bg-gray-100 transition text-center flex items-center justify-center group">
                Send Message
                <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Contact information */}
          <div className="lg:pl-8 text-center">
            <h3 className="text-xl font-medium mb-6">Contact Information</h3>

            <div className="space-y-8">
              <div>
                <p className="text-gray-500 uppercase text-sm tracking-wider mb-2">Email</p>
                <p className="text-gray-200">contact@tvara-voice.com</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase text-sm tracking-wider mb-2">Phone</p>
                <p className="text-gray-200">+1 (555) 123-4567</p>
              </div>

              <div>
                <p className="text-gray-500 uppercase text-sm tracking-wider mb-2">Address</p>
                <p className="text-gray-200">
                  TVARA Headquarters<br />
                  123 AI Boulevard<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
              </div>

              <div>
                <p className="text-gray-500 uppercase text-sm tracking-wider mb-2">Office Hours</p>
                <p className="text-gray-200">
                  Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
