import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-farm-sand flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-farm-sage flex items-center justify-center text-farm-green mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
        The requested screen or resource could not be found within the FarmGrid portal.
      </p>
      <Link to="/">
        <Button className="bg-farm-green hover:bg-farm-green-dark text-white">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
