import { useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { RoadmapCard } from './RoadmapCard';
import { AddRoadmapModal } from './AddRoadmapModal';
import { Plus, Filter, Target } from 'lucide-react';

export const RoadmapList = ({
  roadmaps,
  filters,
  onFilterChange,
  onCreate,
  onUpdate,
  onDelete,
  onSelect,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <Card
        title={`My Roadmaps (${roadmaps.length})`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="hidden sm:flex"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Roadmap</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        }
      >
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => onFilterChange({ ...filters, type: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => onFilterChange({ ...filters, status: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    </select>
                    </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                                </label>
                                <select
                                value={filters.category || ''}
                                onChange={(e) => onFilterChange({ ...filters, category: e.target.value || null })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                <option value="">All</option>
                                <option value="skill_development">Skill Development</option>
                                <option value="career">Career</option>
                                <option value="personal">Personal</option>
                                <option value="health">Health</option>
                                <option value="other">Other</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        )}

                        {/* Roadmaps Grid */}
                        {roadmaps.length === 0 ? (
                        <EmptyState
                            icon={Target}
                            title="No roadmaps found"
                            description="Create your first roadmap to start tracking your progress"
                            action={
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Roadmap
                            </Button>
                            }
                        />
                        ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {roadmaps.map((roadmap) => (
                            <RoadmapCard
                                key={roadmap.id}
                                roadmap={roadmap}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                onClick={() => onSelect(roadmap.id)}
                            />
                            ))}
                        </div>
                        )}
                    </Card>

                    {showAddModal && (
                        <AddRoadmapModal
                        onClose={() => setShowAddModal(false)}
                        onCreate={onCreate}
                        />
                    )}
                    </>
                    );
                    };