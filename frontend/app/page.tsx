'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="card bg-base-100 shadow-xl w-full max-w-xl mx-auto"
      >
        <div className="card-body">
          <h1 className="card-title text-xl sm:text-3xl">
            Safro Mobile Ready
          </h1>
          <p className="text-sm sm:text-base">
            Responsive layout with smoother animations.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
