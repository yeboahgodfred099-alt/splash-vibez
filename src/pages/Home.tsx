import React from 'react';
import EventHero from '../components/landing/EventHero';
import EventDetails from '../components/landing/EventDetails';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <EventHero />
      <EventDetails />
    </div>
  );
};

export default Home;
