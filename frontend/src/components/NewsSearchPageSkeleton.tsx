export default function NewsSearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Skeleton */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-10 lg:py-14">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8 animate-pulse">
                <div className="h-8 bg-slate-300 rounded mb-2 w-64 mx-auto"></div>
                <div className="h-5 bg-slate-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Results Grid */}
        <div className="grid gap-8 lg:gap-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <article
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/50 overflow-hidden animate-pulse"
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Image Section Skeleton */}
                <div className="flex-shrink-0 lg:w-80">
                  <div className="relative w-full h-64 lg:h-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                    {/* Image placeholder */}
                    <div className="w-full h-full bg-slate-300"></div>

                    {/* Source badge skeleton */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <div className="h-4 w-20 bg-slate-300 rounded"></div>
                      </div>
                    </div>

                    {/* Reading time badge skeleton */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-slate-300/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <div className="h-3 w-16 bg-slate-400 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section Skeleton */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col">
                  <div className="flex-1">
                    <div className="mb-6">
                      {/* Author and date skeleton */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="inline-block px-4 py-2 bg-slate-200 rounded-full">
                          <div className="h-4 w-24 bg-slate-300 rounded"></div>
                        </div>
                        <div className="h-4 w-20 bg-slate-300 rounded"></div>
                      </div>

                      {/* Title skeleton */}
                      <div className="mb-5">
                        <div className="h-8 bg-slate-300 rounded mb-2"></div>
                        <div className="h-8 bg-slate-300 rounded mb-2 w-4/5"></div>
                        <div className="h-8 bg-slate-300 rounded w-3/5"></div>
                      </div>

                      {/* Description skeleton */}
                      <div className="mb-6">
                        <div className="h-5 bg-slate-200 rounded mb-2"></div>
                        <div className="h-5 bg-slate-200 rounded mb-2"></div>
                        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-300 rounded"></div>
                        <div className="h-4 w-24 bg-slate-300 rounded"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-300 px-6 py-3 rounded-2xl">
                      <div className="h-4 w-20 bg-slate-400 rounded"></div>
                      <div className="w-4 h-4 bg-slate-400 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 animate-pulse">
          <div className="px-8 py-4 bg-slate-200 rounded-2xl">
            <div className="h-4 w-20 bg-slate-300 rounded"></div>
          </div>

          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="w-12 h-12 bg-slate-200 rounded-2xl"
              ></div>
            ))}
            <div className="px-4 py-2">
              <div className="h-4 w-6 bg-slate-200 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
          </div>

          <div className="px-8 py-4 bg-slate-200 rounded-2xl">
            <div className="h-4 w-16 bg-slate-300 rounded"></div>
          </div>
        </div>

        {/* Results Info Skeleton */}
        <div className="mt-10 text-center animate-pulse">
          <div className="inline-block px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
            <div className="h-4 w-48 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
