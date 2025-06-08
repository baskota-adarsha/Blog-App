import Link from "next/link";
const NoPosts = ({
  names,
  links,
  message,
}: {
  names: string;
  links: string;
  message: string;
}) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-16 px-4">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full p-6 border border-gray-200/50 dark:border-gray-600/50">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No {names} Yet
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6 leading-relaxed">
        We're working on bringing you amazing content. Check back soon for
        inspiring stories and insights!
      </p>

      {/* Decorative elements */}
      <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-600">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
      </div>

      {/* Optional action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href={links}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {message}
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
};

export default NoPosts;
