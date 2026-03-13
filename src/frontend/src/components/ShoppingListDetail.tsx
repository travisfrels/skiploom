import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Card from './Card';

function ShoppingListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const list = useAppSelector((state) => state.shoppingList.currentListId
    ? state.shoppingList.lists[state.shoppingList.currentListId]
    : null
  );
  const [saving, setSaving] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');

  useEffect(() => {
    if (id) {
      ops.setCurrentShoppingListId(id);
      ops.loadShoppingListById(id);
    }
    return () => { ops.clearCurrentShoppingListId(); };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this shopping list?')) {
      if (await ops.deleteShoppingList({ id })) { navigate('/shopping-lists'); }
    }
  };

  const handleToggleItem = async (itemId: string) => {
    if (!list || saving) return;
    setSaving(true);
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    await ops.updateShoppingList({ ...list, items: updatedItems });
    setSaving(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!list || saving) return;
    setSaving(true);
    const filtered = list.items.filter((item) => item.id !== itemId);
    const reindexed = filtered.map((item, index) => ({ ...item, orderIndex: index + 1 }));
    await ops.updateShoppingList({ ...list, items: reindexed });
    setSaving(false);
  };

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!list || !newItemLabel.trim() || saving) return;
    setSaving(true);
    const newItem = {
      id: crypto.randomUUID(),
      label: newItemLabel.trim(),
      checked: false,
      orderIndex: list.items.length + 1,
    };
    await ops.updateShoppingList({ ...list, items: [...list.items, newItem] });
    setNewItemLabel('');
    setSaving(false);
  };

  if (!list) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Shopping List Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          The shopping list you're looking for doesn't exist.
        </p>
        <Link
          to="/shopping-lists"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Back to Shopping Lists
        </Link>
      </div>
    );
  }

  const sortedItems = [...list.items].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div>
      <BackLink to="/shopping-lists">Back to Shopping Lists</BackLink>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {list.title}
          </h2>
          <div className="flex gap-2">
            <ButtonLink variant="secondary" to={`/shopping-lists/${id}/edit`}>
              Edit
            </ButtonLink>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Card>
        {sortedItems.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No items yet. Add your first item below.
          </p>
        )}

        {sortedItems.length > 0 && (
          <ul className="space-y-2 mb-4">
            {sortedItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                  disabled={saving}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`flex-1 text-slate-800 dark:text-slate-100 ${item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
                >
                  {item.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={saving}
                  aria-label={`Remove ${item.label}`}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
          />
          <Button type="submit" variant="primary" disabled={saving || !newItemLabel.trim()}>
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ShoppingListDetail;
