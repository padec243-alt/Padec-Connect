import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full mb-4">
      {label && (
        <label className="block text-slate-400 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 z-10">
          <Lock size={20} />
        </div>
        <input 
          {...props}
          type={showPassword ? 'text' : 'password'}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-cyan-500 focus:bg-slate-900 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all placeholder:text-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors z-10"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
};
