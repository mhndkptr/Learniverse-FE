export default function MentorProfile() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      {/* Profile Image */}
      <div className="mb-6">
        <img
          src="/male-mentor-professional.jpg"
          alt="David Kim"
          className="h-40 w-full rounded-lg object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="text-center">
        <h2 className="text-foreground mb-3 text-xl font-bold">David Kim.</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          David Kim is a software engineer with extensive experience in web
          development and programming languages such as Python and JavaScript.
        </p>
      </div>
    </div>
  )
}
