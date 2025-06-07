export function BlogHeader() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Posts
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Explore our collection of articles, tutorials, and insights
            </p>
          </div>
          <div className="w-full max-w-md"></div>
        </div>
      </div>
    </section>
  );
}
