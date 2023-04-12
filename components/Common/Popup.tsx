'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
interface PopupProps {
  children?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({ children, open, setOpen }) => {
  const ref = useRef(null);

  const handleOnClose = () => {
    setOpen(false);
  };

  useOnClickOutside(ref, handleOnClose);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleOnClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full inset-0 z-[9999]">
          <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-60">
            <div className="relative bg-white p-8 min-w-[650px]" ref={ref}>
              <div>{children}</div>

              <div className="absolute top-0 right-0 text-3xl mr-2 cursor-pointer hover:opacity-70">
                <p onClick={handleOnClose}>&times;</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
