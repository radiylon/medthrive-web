import { useRouter } from "next/router";
import Link from "next/link";

interface Tab {
  id: string;
  label: string;
  href?: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange?: (tabId: string) => void;
}

export function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
  const router = useRouter();

  const handleClick = (tab: Tab) => {
    if (tab.href) {
      router.push(tab.href);
    } else if (onChange) {
      onChange(tab.id);
    }
  };

  return (
    <div
      role="tablist"
      className="flex gap-1 p-1 bg-base-200 rounded-lg w-fit"
      aria-label="Tab navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const baseClasses =
          "px-4 py-2 text-sm font-medium rounded-md transition-colors";
        const activeClasses = isActive
          ? "bg-base-100 text-base-content shadow-sm"
          : "text-base-content/60 hover:text-base-content hover:bg-base-100/50";

        if (tab.href) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={`${baseClasses} ${activeClasses}`}
            >
              {tab.label}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleClick(tab)}
            className={`${baseClasses} ${activeClasses}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
