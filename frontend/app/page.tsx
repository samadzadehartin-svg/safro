'use client';

import { motion } from 'framer-motion';

const destinations = [
  'Turkey',
  'France',
  'Italy',
  'Dubai',
  'Japan',
  'Thailand'
];

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">مقصدهای محبوب</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((country) => (
            <motion.div
              key={country}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="card bg-base-100 shadow-md p-4 text-center"
            >
              <h3 className="font-semibold">{country}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
