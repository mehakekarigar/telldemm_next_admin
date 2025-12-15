import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  parent?: BreadcrumbItem; 
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, parent }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Home
              <Chevron />
            </Link>
          </li>

          {/* Optional Parent (Channels) */}
          {parent && (
            <li>
              <Link
                href={parent.href}
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {parent.label}
                <Chevron />
              </Link>
            </li>
          )}

          {/* Current Page */}
          <li className="font-medium text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

const Chevron = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageBreadcrumb;
