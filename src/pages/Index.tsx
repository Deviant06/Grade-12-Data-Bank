
import React from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
