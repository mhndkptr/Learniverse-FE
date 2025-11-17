
export default function ModuleCard({ module }) {
  return (
    <div className="group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg">
      <div className={`${module.color} h-32 flex items-center justify-center text-5xl opacity-90 group-hover:opacity-100 transition-opacity`}>
        {module.icon}
      </div>
    </div>
  )
}
