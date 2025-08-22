'use client';

import SortableList, { DragHandle } from '@/components/dnd-list';

import { useState } from 'react';

type Item = { id: string; title: string, order: number };


export default function MyList({}) {
  
  const [items, setItems] = useState<Item[]>([
    { id: 'a', title: 'Task 0', order: 0 },
    { id: 'b', title: 'Task 1', order: 1 },
    { id: 'c', title: 'Task 2', order: 2 },
  ]);

  const sortResult = (a: string, b: string) => {

    // find the objects
    const itemA = items.find((i) => i.id === a);
    const itemB = items.find((i) => i.id === b);

    // compare for the sort
    return (itemA?.order || 0) - (itemB?.order || 0);

  }

  return (
    <SortableList
      onReorder={(newOrder) => {
  setItems((prev) =>
    newOrder
      .map((id) => prev.find((p) => p.id === id))
      .map((item, i) => ({...item, order: i}))
      .filter((x): x is Item => Boolean(x)) // guard against undefined
  );
  // persist newOrder to DB if needed
}}
    >
      {items.sort((a, b) => a.order - b.order). map((item) => (
        <div
          key={item.id}
          data-id={item.id}  
          className="flex items-center gap-3 rounded-xl border p-3"
        >
          {/* The tiny handle — only this area starts the drag */}
          <DragHandle className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100">
            {/* You can put any icon here */}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="7" cy="6" r="1.8" /><circle cx="12" cy="6" r="1.8" /><circle cx="17" cy="6" r="1.8" />
              <circle cx="7" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="17" cy="12" r="1.8" />
            </svg>
          </DragHandle>

          <div className="grow">
            <div className="font-medium">{item.title}</div>
            <div className="">{item.order}</div>
            <div className="text-sm text-neutral-500">Drag by the dots</div>
          </div>
        </div>
      ))}
    </SortableList>
  );
}
