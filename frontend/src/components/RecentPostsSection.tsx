import RecentPosts from "./RecentPosts";
const RecentPostsSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Recent Posts
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Stay up to date with our latest articles and insights
            </p>
          </div>
        </div>
        <RecentPosts />
      </div>
    </section>
  );
};

export default RecentPostsSection;
