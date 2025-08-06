'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

const Premium = () => {
  return (
    <Button 
      variant="outline" 
      className="w-full py-2.5 rounded-sm border-blue-200/20 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/60 hover:to-indigo-100/60 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 hover:shadow-sm hover:border-blue-300/30 group"
    >
      <Sparkles className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-600 transition-colors" />
      Upgrade to Premium
    </Button>
  );
};

export default Premium;
