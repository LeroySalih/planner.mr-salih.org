'use client';

import SortableList, { DragHandle } from '@/components/dnd-list';
import { Unit, Units } from '@/actions/units/types';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CurrentDetailsObjectAtom } from '@/atoms';


export default function UnitList({initial, onReorder}: {initial: Units, onReorder: (units: Units)=> void}) {
  
  const [units, setUnits] = useState<Unit[]>(initial);
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);

  
  useEffect(()=> {
    setUnits(initial);
  }, [initial]);

  const handleReorder =(newOrder: string[]) => {

    const newUnits = newOrder.map((id) => units.find((u) => u.unit_id === id))
      .map((item, i) => ({...item, order_by: i}))
      .filter((x): x is Unit => Boolean(x)
    );

    setUnits(newUnits);

    onReorder && onReorder(newUnits);

  }

  const handleUnitClick = (unit: Unit) => {
    setCurrentDetailsObject(unit);
  }

  return (
    <SortableList
      onReorder={handleReorder}
    >
      {units.sort((a, b) => a.order_by - b.order_by). map((item) => (
        <div
          key={item.unit_id}
          data-id={item.unit_id}  
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
            <div className="font-medium" onClick={() => handleUnitClick(item)}>{item.title}</div>
            
          </div>
        </div>
      ))}
    </SortableList>
  );
}
