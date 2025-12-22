import { getTwoInitials } from '@/utils/helper'
import { ArrowUpRightFromSquare } from 'lucide-react'

export default function ModuleListItem({ item }) {
  return (
    <div className="hover:bg-muted/50 border-border flex items-center justify-between border-b p-4 transition-colors last:border-b-0">
      <div className="flex flex-1 items-center gap-4">
        <div className="bg-bluePrimary-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <span className="text-primary-foreground text-sm font-semibold">
            {getTwoInitials(item.title)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-foreground text-sm font-medium">{item.title}</h4>
          <p className="text-muted-foreground truncate text-xs">
            {item.description}
          </p>
        </div>
      </div>
      <div className="ml-4 flex shrink-0 items-center gap-2">
        <button
          onClick={() => window.open(item.modul_uri, '_blank')}
          className="hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors"
        >
          <ArrowUpRightFromSquare className="text-muted-foreground h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
