import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'primary',
  showText = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/logo/logo.png"
        alt="PADEC Connect Logo"
        className={`${sizeMap[size]} object-contain rounded-lg`}
      />
      {showText && (
        <span className="font-bold text-lg text-white hidden sm:block">
          PADEC <span className="text-blue-500">Connect</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
