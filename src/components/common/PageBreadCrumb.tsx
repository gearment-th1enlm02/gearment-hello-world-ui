import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: string;
  description?: string; // thêm props tùy chọn
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, description }) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {pageTitle}
        </h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Home
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
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              {pageTitle}
            </li>
          </ol>
        </nav>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default PageBreadcrumb;
