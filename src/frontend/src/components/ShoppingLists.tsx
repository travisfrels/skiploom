import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import ButtonLink from './ButtonLink';
import ShoppingListCard from './ShoppingListCard';

function ShoppingLists() {
  const listsMap = useAppSelector((state) => state.shoppingList.lists);
  const listsLoaded = useAppSelector((state) => state.shoppingList.listsLoaded);
  const loading = useAppSelector((state) => state.shoppingList.loading);

  useEffect(() => {
    if (!listsLoaded) { ops.loadShoppingLists(); }
  }, [listsLoaded]);

  const lists = Object.values(listsMap).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Shopping Lists</h2>
        <ButtonLink variant="primary" to="/shopping-lists/new">
          New Shopping List
        </ButtonLink>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Loading...</p>
        </div>
      )}

      {!loading && lists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No shopping lists yet.</p>
        </div>
      )}

      {!loading && lists.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <ShoppingListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShoppingLists;
