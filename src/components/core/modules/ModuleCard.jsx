export default function ModuleCard({ module }) {
  return (
    <div className="group border-border hover:border-primary/50 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
      <div
        className={`${module.color} flex h-32 items-center justify-center text-5xl opacity-90 transition-opacity group-hover:opacity-100`}
      >
        {module.icon}
      </div>
    </div>
  )
}
