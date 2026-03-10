import { Link } from 'react-router-dom';
import type { ShoppingList } from '../types';

interface ShoppingListCardProps {
  list: ShoppingList;
}

function ShoppingListCard({ list }: ShoppingListCardProps) {
  const checkedCount = list.items.filter((item) => item.checked).length;

  return (
    <Link
      to={`/shopping-lists/${list.id}`}
      className="block bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {list.title}
      </h3>
      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>{list.items.length} {list.items.length === 1 ? 'item' : 'items'}</span>
        {checkedCount > 0 && <span>{checkedCount} checked</span>}
      </div>
    </Link>
  );
}

export default ShoppingListCard;
