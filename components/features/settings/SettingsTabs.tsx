"use client";

type SettingsTab = 'land-classifications' | 'commission-offers' | 'communications' | 'faq';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Settings tabs">
        <button
          onClick={() => onTabChange('land-classifications')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            ${activeTab === 'land-classifications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          Land Classifications
        </button>
        
        <button
          onClick={() => onTabChange('commission-offers')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            ${activeTab === 'commission-offers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          Commission & Offers
        </button>
        
        <button
          onClick={() => onTabChange('communications')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            ${activeTab === 'communications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          Communications
        </button>
        
        <button
          onClick={() => onTabChange('faq')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            ${activeTab === 'faq'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          FAQ Management
        </button>
      </nav>
    </div>
  );
}
