import React from "react";

const OurStory = () => {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-white to-purple-50 px-6 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">Our Story</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A mission to bring every local shop into the digital world — with dignity, purpose, and power.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img
              src="https://res.cloudinary.com/djd50rrlr/image/upload/v1754217125/zlggyfacvej3wmoy5qxj.jpg"
              alt="Local Shop Digital Transformation"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story */}
          <div className="space-y-6 text-lg">
            <p>
              We started with a simple observation — countless local shops are rich in value, trust, and tradition,
              but left behind in a digital-first world. These businesses form the heartbeat of our communities,
              yet they struggle to stay visible and competitive.
            </p>
            <p>
              Our journey began with one goal: <strong className="text-purple-700">empower offline businesses to thrive online</strong>.
              We’re not just building a platform — we’re opening doors. Doors that connect customers to their trusted shops,
              and shopkeepers to new growth they never imagined.
            </p>
            <p>
              Every feature we build, every shop we onboard, and every product we deliver is a step towards a more
              inclusive and connected marketplace — where small shops stand tall alongside giants.
            </p>
            <p className="text-purple-700 font-semibold italic">
              This isn’t just our story. It’s the story of every shop we serve, and every life we touch.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <p className="text-xl text-gray-700 font-medium mb-4">
            Whether you're a shopkeeper or a customer — you're part of our story.
          </p>
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
          >
            Join the Movement
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
