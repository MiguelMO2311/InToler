import React from 'react';
import Menu from './Menu';

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[97px] right-0 mt-2 mr-2 bg-green-800 p-2  shadow-md w-[160px] border-white border-2 rounded z-50">
      <Menu className="flex flex-col items-end" isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default SideBar;
