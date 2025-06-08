import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Jane Smith",
      role: "Founder & Editor-in-Chief",
      bio: "Jane has over 10 years of experience in tech journalism and previously worked at major tech publications.",
      image: "/11.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      role: "Senior Writer",
      bio: "John specializes in web development trends and has been coding for over 15 years.",
      image: "/22.jpeg",
    },
    {
      id: 3,
      name: "Sarah Williams",
      role: "Design Editor",
      bio: "Sarah has a background in UX/UI design and writes about design trends and best practices.",
      image: "/33.webp",
    },
    {
      id: 4,
      name: "Michael Johnson",
      role: "Technical Editor",
      bio: "Michael reviews all technical content and has a PhD in Computer Science.",
      image: "/44.jpg",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "ModernBlog Founded",
      description:
        "Started as a small personal blog focused on web development.",
    },
    {
      year: "2019",
      title: "Team Expansion",
      description:
        "Grew to a team of 4 writers covering various technology topics.",
    },
    {
      year: "2020",
      title: "Reached 100K Monthly Readers",
      description: "A major milestone in our growth and community building.",
    },
    {
      year: "2021",
      title: "Launched Premium Content",
      description:
        "Started offering in-depth guides and tutorials for subscribers.",
    },
    {
      year: "2022",
      title: "Community Forum Launch",
      description:
        "Created a space for readers to discuss topics and share ideas.",
    },
    {
      year: "2023",
      title: "Mobile App Release",
      description:
        "Expanded our platform with native iOS and Android applications.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About ModernBlog
            </h1>
            <p className="mb-8 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We're a team of passionate writers and developers dedicated to
              sharing knowledge and insights about technology, design, and
              development.
            </p>
            <div className="mx-auto w-full max-w-lg">
              <img
                src="/team.jpg"
                alt="Team working together"
                className="aspect-video w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">
              Our Mission
            </h2>
            <p className="mb-8 text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              At ModernBlog, we believe in making technology and development
              knowledge accessible to everyone. Our mission is to create
              high-quality, easy-to-understand content that helps our readers
              stay informed and grow their skills.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m7 10 2 2 6-6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quality Content</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  We focus on creating well-researched, accurate, and valuable
                  content.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 6.1H3"></path>
                    <path d="M21 12.1H3"></path>
                    <path d="M15.1 18H3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  We make complex topics easy to understand for readers of all
                  skill levels.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M16.5 9.4 7.5 4.21"></path>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <path d="M3.27 6.96 12 12.01l8.73-5.05"></path>
                    <path d="M12 22.08V12"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Community</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  We foster a supportive community where readers can learn and
                  grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Meet Our Team
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Our Journey
            </h2>
            <div className="relative border-l border-gray-200 pl-8 dark:border-gray-700">
              {milestones.map((milestone, index) => (
                <div key={index} className="mb-10 ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {index + 1}
                  </span>
                  <h3 className="mb-1 flex items-center text-lg font-semibold">
                    {milestone.title}
                    <span className="ml-3 rounded bg-gray-100 px-2 py-0.5 text-sm font-normal text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {milestone.year}
                    </span>
                  </h3>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our Readers Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <p className="mb-4 italic text-gray-600 dark:text-gray-300">
                  "ModernBlog has been an invaluable resource for me as I've
                  learned web development. The tutorials are clear, concise, and
                  always up-to-date with the latest technologies."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <img src="/44.jpg" alt="Reader" />
                  </div>
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-sm text-gray-500">Frontend Developer</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <p className="mb-4 italic text-gray-600 dark:text-gray-300">
                  "I've been following ModernBlog for years, and it's
                  consistently been my go-to source for learning about new
                  technologies and best practices in web development."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <img src="/33.webp" alt="Reader" />
                  </div>
                  <div>
                    <p className="font-medium">Maria Garcia</p>
                    <p className="text-sm text-gray-500">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
    </div>
  );
}
