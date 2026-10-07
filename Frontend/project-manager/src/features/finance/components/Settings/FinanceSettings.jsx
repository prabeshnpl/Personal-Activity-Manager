import React, { useRef, useState } from 'react';
import { TabPanel } from '../../../../shared/components/tabs/Tabs';
import { CategoryManager } from '../Category/CategoryManager';
import { AccountManager } from '../Account/AccountManager';
import { Button } from '../../../../shared/components/Button';
import { Plus } from 'lucide-react';

const FinanceSettings = () => {

    const [activeTab, setActiveTab] = useState('account');
    const categoryAddActionRef = useRef(null);
    const accountAddActionRef = useRef(null);

    const tabs = [
        {
        id: 'account',
        label: 'Accounts'
        },
        {
        id: 'category',
        label: 'Category'
        },
    ];

    const addButtonConfig = activeTab === 'category'
      ? {
          label: 'Add Category',
          onClick: () => categoryAddActionRef.current?.(),
        }
      : {
          label: 'Add Account',
          onClick: () => accountAddActionRef.current?.(),
        };

    return (
        <div className='h-full flex flex-col overflow-hidden'>
            <div className="flex items-center gap-3 border-b border-gray-300">
              <nav className="flex flex-1 min-w-0 space-x-8" aria-label="Finance settings tabs">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 py-4 px-1 border-b-2 
                        font-medium text-sm transition-colors cursor-pointer
                        ${
                          isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              <Button 
                size="sm" 
                onClick={addButtonConfig.onClick} 
                className="h-10 px-2 py-1 text-xs inline-flex items-center shrink-0 whitespace-nowrap"
              >                
                <span className="inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  {addButtonConfig.label}
                </span>
              </Button>
            </div>

            <div className='mt-4 flex-1 min-h-0 overflow-hidden'>

                <TabPanel isActive={activeTab === 'account'}>
                  <div className="h-full overflow-y-auto pr-1">
                    <AccountManager addActionRef={accountAddActionRef} />
                  </div>
                </TabPanel>

                <TabPanel isActive={activeTab === 'category'}>
                  <div className="h-full pr-1">
                    <CategoryManager addActionRef={categoryAddActionRef} />
                  </div>
                </TabPanel>

            </div>
        </div>
    )
};
export default FinanceSettings;
