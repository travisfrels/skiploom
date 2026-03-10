import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import type { ShoppingListItem } from '../types';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Card from './Card';

interface ShoppingListFormProps {
  mode: 'new' | 'edit';
}

function ShoppingListForm({ mode }: ShoppingListFormProps) {
  const { id } = useParams<{ id: string }>();

  const currentList = useAppSelector((state) => state.shoppingList.currentListId
    ? state.shoppingList.lists[state.shoppingList.currentListId]
    : null
  );

  const submitting = useAppSelector((state) => state.shoppingList.submitting);
  const validationErrors = useAppSelector((state) => state.shoppingList.validationErrors);

  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  const navigate = useNavigate();

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
  };

  useEffect(() => {
    if (id && mode === 'edit') {
      ops.setCurrentShoppingListId(id);
      ops.loadShoppingListById(id);
    } else {
      ops.clearCurrentShoppingListId();
    }
    return () => { ops.clearCurrentShoppingListId(); };
  }, [id, mode]);

  useEffect(() => {
    if (currentList) {
      setTitle(currentList.title || '');
      setItems(structuredClone(currentList.items));
    }
  }, [currentList]);

  const addItem = () => {
    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      label: '',
      checked: false,
      orderIndex: items.length + 1,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    const filtered = items.filter((i) => i.id !== itemId);
    const reindexed = filtered.map((i, index) => ({ ...i, orderIndex: index + 1 }));
    setItems(reindexed);
  };

  const updateItemLabel = (itemId: string, label: string) => {
    setItems(items.map((i) => (i.id === itemId ? { ...i, label } : i)));
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const index = items.findIndex((i) => i.id === itemId);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems.map((i, idx) => ({ ...i, orderIndex: idx + 1 })));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submittedItems = items.map((item, index) => ({
      ...item,
      label: item.label.trim(),
      orderIndex: index + 1,
    }));

    if (mode === 'edit') {
      if (await ops.updateShoppingList({
        id: id || '',
        title: title.trim(),
        items: submittedItems,
      })) {
        navigate(`/shopping-lists/${id}`);
      }
    } else {
      const newId = await ops.createShoppingList({
        id: '',
        title: title.trim(),
        items: [],
      });
      if (newId) { navigate(`/shopping-lists/${newId}`); }
    }
  };

  if (mode === 'edit' && !currentList) { return (<div><p>Shopping list not found.</p></div>); }

  return (
    <div>
      <BackLink to="/shopping-lists">Back to Shopping Lists</BackLink>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
        {mode === 'edit' ? 'Edit Shopping List' : 'New Shopping List'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
              placeholder="Shopping list title"
            />
            {getFieldError('title') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('title')}</p>
            )}
          </div>
        </Card>

        {mode === 'edit' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
              >
                + Add Item
              </button>
            </div>

            {getFieldError('items') && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">{getFieldError('items')}</p>
            )}

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItemLabel(item.id, e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`items[${index}].label`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                      placeholder="Item label"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {getFieldError(`items[${index}].label`) && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError(`items[${index}].label`)}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Shopping List')}
          </Button>
          <ButtonLink variant="secondary" to="/shopping-lists">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </div>
  );
}

export default ShoppingListForm;
