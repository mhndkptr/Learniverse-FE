import ModuleCard from '@/components/core/modules/ModuleCard'
import ModuleListItem from '@/components/core/modules/ModuleListItem'
import { Search, MoreVertical, ArrowLeft } from 'lucide-react'

export default function ModulesPage() {
  const modules = [
    {
      id: 1,
      title: 'Kalkulus Lanjutan',
      description: 'Pelajari konsep-konsep dasar kalkulus dengan pemahaman mendalam tentang limit, turunan, dan integral',
      icon: '∫',
      color: 'bg-emerald-500',
    },
    {
      id: 2,
      title: 'Pengenalan AI & Machine Learning',
      description: 'Memahami fundamentals dari artificial intelligence dan machine learning untuk pemula',
      icon: '⚙️',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'Discrete Mathematics',
      description: 'Eksplorasi matematika diskrit termasuk teori graf, kombinatorika, dan logika formal',
      icon: '∑',
      color: 'bg-purple-500',
    },
  ]

  const listItems = [
    {
      id: 1,
      title: 'Pengantar Python Programming',
      description: 'Pelajari dasar-dasar bahasa pemrograman Python untuk pemula',
      avatar: 'M',
    },
    {
      id: 2,
      title: 'Web Development dengan React',
      description: 'Membangun aplikasi web modern menggunakan React dan TypeScript',
      avatar: 'R',
    },
    {
      id: 3,
      title: 'Database Design & SQL',
      description: 'Merancang database yang efisien dan menulis query SQL yang optimal',
      avatar: 'D',
    },
    {
      id: 4,
      title: 'DevOps & Cloud Computing',
      description: 'Memahami praktik DevOps dan deployment aplikasi ke cloud',
      avatar: 'C',
    },
  ]

  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
                {/* Header Section */}
        <div className="mb-8 flex items-center gap-3">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Modules</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari modul..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Module Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        {/* List Items Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">All Modules</h2>
          <div className="space-y-2 border border-border rounded-lg overflow-hidden">
            {listItems.map((item) => (
              <ModuleListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}