import { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Icon } from '@tremor/react';
import Link from 'next/link';

const Bookmarks = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col mb-5">
      <div className="">
        <div
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          className="cursor-pointer inline"
        >
          <span className="text-xl">Bookmarks</span>

          <span>
            {isOpen ? (
              <Icon
                icon={MinusIcon}
                size="md"
                className="font-bold px-0 ml-1 text-black"
              />
            ) : (
              <Icon
                icon={PlusIcon}
                size="md"
                className="font-bold px-0 ml-1 text-black"
              />
            )}
          </span>
        </div>
      </div>

      {isOpen && (
        <div>
          <div className="flex gap-8 my-1">
            <span className="text-lg font-semibold">Remote:</span>
            <Link
              href="/admin/listings?onlyRemote=1&tagsIn=reactjs,typescript"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              React+Typescript
            </Link>
            <Link
              href="/admin/listings?onlyRemote=1&tagsIn=nodejs,typescript"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              Node+Typescript
            </Link>
            <Link
              href="/admin/listings?onlyRemote=1&tagsIn=nextjs"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              Next
            </Link>
          </div>

          <div className="flex gap-8 ">
            <span className="text-lg font-semibold">LinkedIn:</span>
            <Link
              href="/admin/listings?providersIn=LinkedIn&tagsIn=reactjs,typescript&locationsIn=United%20States"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              React+Typescript
            </Link>
            <Link
              href="/admin/listings?providersIn=LinkedIn&tagsIn=nodejs,typescript&locationsIn=United%20States"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              Node+Typescript
            </Link>
            <Link
              href="/admin/listings?providersIn=LinkedIn&tagsIn=nextjs&locationsIn=United%20States"
              className="text-lg hover:opacity-75 text-blue-700"
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
