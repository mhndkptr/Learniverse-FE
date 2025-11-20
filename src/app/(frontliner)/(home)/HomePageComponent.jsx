'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetAllCourse } from '@/hooks/course.hook'
import { ExternalLink, Search, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const faqs = [
  {
    question: 'What types of courses do you offer?',
    answer:
      'We offer a wide range of courses including programming, mathematics, science, design, and more. Each course is carefully crafted by industry experts to provide practical and theoretical knowledge.',
  },
  {
    question: 'How do I enroll in a course?',
    answer:
      'Simply browse our course catalog, select the course you are interested in, and click the enroll button. You will be guided through a quick registration process to get started.',
  },
  {
    question: 'What if I have questions during the course?',
    answer:
      'Our support team and instructors are always available to help. You can reach out through our contact form, email, or access our community forums where you can interact with other learners.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer:
      'Yes! All our courses are self-paced, allowing you to learn whenever and wherever you want. You have lifetime access to the course materials after enrollment.',
  },
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    rating: 5,
    text: 'The courses at Learniverse transformed my career! The interactive content and expert instructors made learning enjoyable and effective.',
  },
  {
    id: 2,
    name: 'Mark T.',
    rating: 5,
    text: 'I was hesitant about online learning, but Learniverse exceeded my expectations. The flexibility allowed me to balance my studies with work. Highly recommended!',
  },
  {
    id: 3,
    name: 'Emily R.',
    rating: 5,
    text: 'As a creative professional, I loved the variety of courses offered. The hands-on projects helped me build a strong portfolio, and I feel more confident in my career.',
  },
]

export default function HomePageComponent() {
  const router = useRouter()
  const { courses } = useGetAllCourse({
    params: {
      pagination: {
        page: 1,
        limit: 4,
      },
    },
  })

  return (
    <div className="flex h-full">
      <main className="flex h-full w-full flex-col items-center justify-start py-32">
        <section className="w-full px-5 pb-24 md:px-16">
          <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-12">
            <div className="flex flex-1 flex-col justify-center">
              <h1 className="text-foreground mb-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                Empower Your Future with Online Learning
              </h1>
              <p className="text-muted-foreground mb-8 md:text-lg">
                Dive into an endless world of knowledge. Flexible, affordable,
                and deeply engaging courses for every stage of your career.
              </p>

              <div className="relative w-full">
                <Input
                  type={'text'}
                  placeholder="Search course"
                  className="bg-bluePrimary-500 w-full rounded-full px-6 py-3.5 pr-12 text-white placeholder:text-white focus:ring-2 focus:outline-none"
                />
                <button className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-white hover:opacity-80">
                  <Search size={20} />
                </button>
              </div>
            </div>

            <Image
              src="/assets/images/img-reading-book.png"
              alt="Woman reading with bookshelves"
              width={4096}
              height={2731}
              className="h-auto w-full rounded-tr-4xl rounded-bl-4xl object-cover shadow-lg lg:w-1/2"
            />
          </div>
        </section>

        <section className="w-full bg-gray-50 px-5 py-24 md:px-16">
          <div className="w-full">
            {/* Section Header */}
            <div className="mb-8 text-center md:mb-12">
              <h2 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">
                Our Courses
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Explore our courses today and start transforming your future!
              </p>
            </div>

            {/* Courses Grid */}
            <div className="mb-8 grid w-full gap-6 md:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="w-full overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex gap-4 p-4">
                    {/* Course Image */}
                    <div className="shrink-0">
                      <Image
                        src={
                          course.image ||
                          '/assets/images/img-image-placeholder.png'
                        }
                        alt={course?.title}
                        width={120}
                        height={120}
                        className="h-24 w-24 rounded object-cover md:h-32 md:w-32"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-foreground mb-2 text-lg font-bold">
                        {course?.title}
                      </h3>
                      <p className="text-muted-foreground mb-3 flex-1 text-sm">
                        {course?.description}
                      </p>
                      <Button
                        onClick={() => router.push(`/course/${course.id}`)}
                        variant="secondary"
                        type="button"
                        className="w-fit"
                      >
                        See Detail
                        <ExternalLink size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => router.push('/course')}
                variant="secondary"
                size="lg"
                className="w-fit"
                type="button"
              >
                See More
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full px-5 py-24 md:px-16">
          <div className="w-full">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
              {/* Left Image */}
              <div className="w-full flex-1">
                <Image
                  src="/assets/images/img-class.png"
                  alt="Teacher mentoring students in classroom"
                  width={400}
                  height={300}
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Right Content */}
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                  Share Your Knowledge and Inspire Others
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Are you passionate about teaching and helping others grow? At
                  Learniverse, we are always looking for dedicated mentors to
                  join our community of educators. Share your expertise, connect
                  with eager learners, and make a real impact on their lives.
                </p>
                <Button variant="secondary" size={'lg'} className="w-fit">
                  Become Mentor
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-gray-50 px-5 py-24 md:px-16">
          <div className="mx-auto max-w-3xl">
            {/* Section Header */}
            <div className="mb-8 text-center md:mb-12">
              <h2 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">
                FAQ
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Find answers to common questions about our courses, enrollment
                process, and learning experience at Learniverse
              </p>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-foreground text-left font-medium hover:text-amber-700">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="w-full px-5 py-24 md:px-16">
          <div className="w-full">
            {/* Section Header */}
            <div className="mb-8 text-center md:mb-12">
              <h2 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">
                Hear from Our Learners
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Discover how Learniverse has empowered students to achieve their
                goals and transform their careers through engaging online
                courses.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border-border rounded-lg border bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <Image
                      src={
                        testimonial.image ||
                        '/assets/images/img-avatar-placeholder.png'
                      }
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-foreground font-semibold">
                        {testimonial.name}
                      </h3>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
