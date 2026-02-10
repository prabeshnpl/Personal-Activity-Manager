import React, { useState } from 'react';
import { Tabs, TabPanel } from '../../../../shared/components/tabs/Tabs';
import { CategoryManager } from '../Category/CategoryManager';
import { AccountManager } from '../Account/AccountManager';

const FinanceSettings = () => {

    const [activeTab, setActiveTab] = useState('category');

    const tabs = [
        {
        id: 'category',
        label: 'Category'
        },
        {
        id: 'account',
        label: 'Accounts'
        }
    ];
    return (
        <div>            
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className='mt-4 h-full'>
                <TabPanel isActive={activeTab === 'category'}>
                    <CategoryManager/>
                </TabPanel>

                <TabPanel isActive={activeTab === 'account'}>
                    <AccountManager/>
                </TabPanel>
            </div>
        </div>
    )
};
export default FinanceSettings;