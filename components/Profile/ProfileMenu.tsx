'use client';
import { useState, useRef } from 'react';
import { ProfileIcon } from '@/components/Profile/ProfileIcon';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { Icon } from '@tremor/react';
import { useOnClickOutside } from 'usehooks-ts';
import { useAuth } from '@/hooks/useAuth';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const { user, logout } = useAuth({ middleware: 'auth' });

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      {user && (
        <div data-testid="profile-menu" className="relative" ref={ref}>
          <div
            data-testid="profile-menu__icon"
            className="cursor-pointer"
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          >
            <ProfileIcon />
          </div>
          {isOpen && (
            <div className="absolute bg-white top-[47px] left-[-110px] shadow-md rounded-sm">
              <div className="py-1 px-2 min-w-[150px]">
                <ul>
                  <li
                    data-testid="profile-menu__logout"
                    onClick={logout}
                    className="flex justify-center p-2 cursor-pointer hover:opacity-70"
                  >
                    <Icon
                      icon={ArrowRightOnRectangleIcon}
                      size="md"
                      className="text-blue-500 p-0"
                    />
                    <span className="inline-block ml-3">Sign Out</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileMenu;
