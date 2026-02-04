import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10 rounded-xl" }) => {
    return (
        <img
            src="/logo.png"
            alt="Logo"
            className={`object-contain ${className}`}
        />
    );
};

export default Logo;
