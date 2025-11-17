import { ArrowUpRightFromSquare, MoreVertical } from 'lucide-react'

export default function ModuleListItem({ item }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-sm font-semibold">{item.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-2 flex-shrink-0">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowUpRightFromSquare className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
