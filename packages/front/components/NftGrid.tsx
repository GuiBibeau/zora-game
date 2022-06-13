import clsx from "clsx";
import { FC } from "react";

type Props = {
  files: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export const NftGrid: FC<Props> = ({ files, selectedIndex, onSelect }) => {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {[...files, "https://www.placecage.com/300/300"].map((file, index) => {
        const isSelected = index === selectedIndex;
        const baseClass =
          "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100  overflow-hidden";
        const selectedClass = isSelected ? "border-4 border-red-500 " : "";
        const className = clsx(baseClass, selectedClass);
        return (
          <li key={file} className="relative">
            <div className={className}>
              <img
                src={file}
                alt="NFt"
                className="object-cover pointer-events-none group-hover:opacity-75"
              />
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {file}</span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
