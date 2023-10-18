import clsx from 'clsx';
import Link from 'next/link';
import React from 'react'

interface MobileItemProps {
    href: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
  }
const MobileItem:React.FC<MobileItemProps> = ({
    href, 
    icon: Icon, 
    active,
    onClick
   }) => {
    const handleClick = () => {
        if (onClick) {
          return onClick();
        }
      };
    
  return (
    <Link 
    onClick={handleClick} 
    href={href} 
    className={clsx(`
      group 
      flex 
      gap-x-3 
      text-sm 
      leading-6 
      font-semibold 
      w-full 
      justify-center 
      p-4 
      text-black-400 
      hover:text-black-400
      hover:bg-gray-400
    `,
      active && 'bg-gray-300 text-black-300',
    )}>
    <Icon className="h-6 w-6" />
  </Link>  )
}

export default MobileItem