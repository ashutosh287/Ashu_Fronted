import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6 md:px-12 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-purple-700">About Us</h1>
          <p className="text-lg text-gray-600 mt-4">
            We help local shopkeepers build their digital presence — so they can grow with the times, not get left behind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://res.cloudinary.com/djd50rrlr/image/upload/v1754217124/h0ge37xrsm3kaggm2iek.jpg"
              alt="Online local shop"
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We’re on a mission to take offline shops online — without complicating their life.
              With our platform, local vendors get listed online, attract nearby customers, and run their store digitally, just like the big players.
            </p>
            <p className="text-gray-700">
              From kirana stores to food stalls, from vegetables to household needs — we’re bringing every trusted neighborhood shop into the digital world.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-purple-600 mb-3">Why It Matters</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Local businesses are the heart of every community. But many don’t have access to the digital tools needed to survive in today’s world. We’re changing that — with simplicity, trust, and technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
