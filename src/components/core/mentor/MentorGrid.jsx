'use client'

import MentorCard from './MentorCard'

// Sample mentor data - Replace with your actual data or fetch from API
const mentors = [
  {
    id: 1,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 2,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 3,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 4,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 5,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 6,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 7,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
  {
    id: 8,
    name: 'David Kim.',
    description:
      'David Kim is a software engineer with extensive experience in web development and programming languages such as Python and JavaScript.',
    image: '/male-mentor-professional.jpg',
  },
]

export default function MentorGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  )
}
