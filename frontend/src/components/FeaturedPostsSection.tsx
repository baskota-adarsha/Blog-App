import { FeaturedPosts } from "./FeaturedPosts";

const FeaturedPostsSection = () => {


  return (
    <>
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Posts
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Explore our most popular and thought-provoking articles
              </p>
            </div>
          </div>
          <FeaturedPosts />
        </div>
      </section>
    </>
  );
};

export default FeaturedPostsSection;
