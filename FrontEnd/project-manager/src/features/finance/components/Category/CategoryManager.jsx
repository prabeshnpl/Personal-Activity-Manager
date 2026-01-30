import { useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Spinner } from '../../../../shared/components/Spinner';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddCategoryModal } from './AddCategoryModal';
import { Plus, Edit2, Trash2, Tag, MoreVertical } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';
import ErrorState from '../../../../shared/components/Error/ErrorState';

export const CategoryManager = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategory();
  const {data:categoryData, isLoading: categoryLoading, error:categoryError, refetch} = categories;
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowAddModal(true);
    setMenuOpen(null);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Delete this category? Transactions with this category will be uncategorized.')) {
      try {
        await deleteCategory.mutateAsync(categoryId);
      } catch (error) {
        alert('Failed to delete category');
      }
    }
    setMenuOpen(null);
  };

  const getCategoryColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  if (categoryLoading){
    return <Spinner size="md" />;
  }

  if (categoryError){
    return <ErrorState message="Failed to load categories." onRetry={refetch} />;
  }

  return (
    <>
      <Card
        title={`Categories (${categoryData.length})`}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        }
      >
        {categoryData?.length===0 ? 
          <EmptyState
            icon={Tag}
            iconClassNames='h-8 w-8 text-gray-400'
            title="No categories yet"
            description="Create categories to organize your transactions"
            classNames = "text-center"
          /> : 
          <div className="space-y-3">
            {categoryData.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${getCategoryColor(category.color)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">
                      {category.category_type.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">                
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === category.id ? null : category.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>

                    {menuOpen === category.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setMenuOpen(null)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                          <button
                            onClick={() => handleEdit(category)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {category.type && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded-full">
                      {category.type}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      </Card>

      {showAddModal && (
        <AddCategoryModal
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
          onCreate={createCategory}
          onUpdate={updateCategory}
        />
      )}
    </>
  );
};