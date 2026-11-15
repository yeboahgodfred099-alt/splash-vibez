import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-brand-coral mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-brand-muted text-sm max-w-md mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-brand-cyan text-brand-dark font-semibold text-sm hover:bg-brand-cyan-hover transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

