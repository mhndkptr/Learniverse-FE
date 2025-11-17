export default function CourseTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="mt-8 border-b px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-2 pb-4 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-foreground'
                : 'hover:text-foreground text-gray-500'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute right-0 bottom-0 left-0 h-1 rounded-t bg-amber-600"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
