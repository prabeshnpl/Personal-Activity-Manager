import { useState } from 'react';
import { FinanceDashboard } from '../components/FinanceDashboard';
import { TransactionsList } from '../components/Transaction/TransactionsList';
import { Tabs, TabPanel } from '../../../shared/components/tabs/Tabs';
import { BarChart3, List, PieChart, Settings } from 'lucide-react';
import FinanceSettings from '../components/Settings/financeSettings';

export const FinancePage = () => {

  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: List,
      // badge: transactions.length,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: PieChart,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="p-6 space-y-6 h-[90vh] overflow-hidden">

      <div className='bg-white h-full px-8 py-4 rounded-lg shadow-md flex flex-col'>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className='overflow-y-auto'>
          <TabPanel isActive={activeTab === 'dashboard'}>
            <FinanceDashboard/>
          </TabPanel>

          <TabPanel isActive={activeTab === 'transactions'}>
            <TransactionsList/>
          </TabPanel>

          <TabPanel isActive={activeTab === 'reports'}>
            <div className="text-center py-12 text-gray-500">
              Reports module coming soon...
            </div>
          </TabPanel>

          <TabPanel isActive={activeTab === 'settings'}>
            <FinanceSettings/>
          </TabPanel>
        </div>
      </div>
    </div>
  );
};