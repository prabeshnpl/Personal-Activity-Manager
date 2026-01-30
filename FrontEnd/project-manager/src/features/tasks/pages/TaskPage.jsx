import { useState } from 'react';
import { TasksList } from '../components/TasksList';
import { TaskKanban } from '../components/TaskKanban';
import { AddTaskModal } from '../components/AddTaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { Tabs, TabPanel } from '../../../shared/components/tabs/Tabs';
import { List, LayoutGrid } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Plus, Filter} from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import SearchBar from '../../../shared/components/Search/SearchBar';
import { useTasks } from '../hooks/useTasks';
import FilterModal from '../components/FilterModal';

const TasksPage = () => {
  const {
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  
  const [activeTab, setActiveTab] = useState('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    {
      id: 'list',
      label: 'List View',
      icon: List,
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: LayoutGrid,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        {/* Tabs */}
        <div className='flex justify-between items-center'>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="flex flex-wrap gap-6">

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            {/* Filters */}
            <FilterModal
              show={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              setFilters={setFilters}
            />

            <SearchBar
              placeholder="Search tasks..."
              value={filters.search || ''}
              onSubmit={(value) => setFilters({ ...filters, search: value || null })}
              className="max-w-md h-10"
            />

            <Button 
              size="sm" 
              onClick={() => setShowAddModal(true)} 
              className='w-30 h-10 flex justify-center items-center'
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='mt-10'>
          <TabPanel isActive={activeTab === 'list'}>
            <TasksList showFilters={showFilters} setShowFilters={setShowFilters} />
          </TabPanel>

          <TabPanel isActive={activeTab === 'kanban'}>
            <TaskKanban
            onTaskClick={setSelectedTask}
            />
          </TabPanel>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddTaskModal
            onClose={() => setShowAddModal(false)}
            onCreate={createTask}
          />
        )}

        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </Card>
    </div>
  );
};

export default TasksPage;