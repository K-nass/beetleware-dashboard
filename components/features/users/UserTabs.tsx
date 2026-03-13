"use client";

import { useSearchParams } from "next/navigation";

interface UserTabsProps {
  activeTab: 'internal' | 'external';
  onTabChange: (tab: 'internal' | 'external') => void;
  internalCount?: number;
  externalCount?: number;
}

export default function UserTabs({ 
  activeTab, 
  onTabChange, 
  internalCount, 
  externalCount 
}: UserTabsProps) {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  
  const buildHref = (type: 'internal' | 'external') => {
    const params = new URLSearchParams();
    params.set('type', type);
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    return `?${params.toString()}`;
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => onTabChange('internal')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'internal'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          Internal Users
          {internalCount !== undefined && (
            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
              activeTab === 'internal' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
            }`}>
              {internalCount}
            </span>
          )}
        </button>
        
        <button
          onClick={() => onTabChange('external')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'external'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          External Users
          {externalCount !== undefined && (
            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
              activeTab === 'external' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
            }`}>
              {externalCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}


