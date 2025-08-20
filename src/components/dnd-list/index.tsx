'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

/* ===========================
   Types
   =========================== */

type SortableListProps = {
  /** Children: one element per item; each must have a stable `data-id` (preferred) or `key`. */
  children: React.ReactElement[] | React.ReactElement;
  /** Called with the new order of item IDs (taken from `data-id`) after a drop. */
  onReorder?: (newOrder: string[]) => void;
  /** Optional: initial order override; defaults to children’s order. */
  order?: string[];
  /** Optional: extra class on the outer wrapper. */
  className?: string;
};

type HandleCtx = {
  setActivatorNodeRef: (el: HTMLElement | null) => void;
  listeners: ReturnType<typeof useSortable>['listeners'];
  attributes: ReturnType<typeof useSortable>['attributes'];
};

/* ===========================
   Drag handle context + component
   =========================== */

const DragHandleContext = createContext<HandleCtx | null>(null);

/** Place inside each item: only this area acts as the drag activator. */
export function DragHandle(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const ctx = useContext(DragHandleContext);
  if (!ctx) {
    // If handle used outside of a SortableItem, just render a normal button.
    return <button type="button" {...props} />;
  }
  const { setActivatorNodeRef, listeners, attributes } = ctx;
  return (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Reorder"
      {...props}
    >
      {props.children ?? (
        // Simple 6-dot icon as a default handle
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="7" cy="6" r="1.8" /><circle cx="12" cy="6" r="1.8" /><circle cx="17" cy="6" r="1.8" />
          <circle cx="7" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="17" cy="12" r="1.8" />
        </svg>
      )}
    </button>
  );
}

/* ===========================
   SortableItem (internal)
   =========================== */

function SortableItem({
  id,
  child,
}: {
  id: string;
  child: React.ReactElement;
}) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  // Clone child to attach container ref + animated style.
  // @ts-ignore
  const mergedStyle = { ...(child.props?.style ?? {}), ...style };
  const cloned = React.cloneElement(child, {
    //@ts-ignore
    ref: setNodeRef,
    style: mergedStyle,
  });

  const handleCtx = useMemo<HandleCtx>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes]
  );

  return (
    <DragHandleContext.Provider value={handleCtx}>
      {cloned}
    </DragHandleContext.Provider>
  );
}

/* ===========================
   SortableList (public)
   =========================== */

export default function SortableList({
  children,
  onReorder,
  order,
  className,
}: SortableListProps) {
  // Normalize children into an array of elements
  const childArray = React.Children.toArray(children) as React.ReactElement[];

  // Extract stable IDs from `data-id` (fallback to React key for dev convenience)
  const childIds = childArray.map((el, idx) => {
    //@ts-ignore
    const dataId = el.props?.['data-id'] as string | undefined;
    if (!dataId && el.key == null) {
      throw new Error(
        `SortableList: child at index ${idx} must have a stable 'data-id' (recommended) or a 'key'.`
      );
    }
    return dataId ?? String(el.key);
  });

  // Resolve working order: respect `order` when provided, but ensure it matches current items.
  const activeOrder = useMemo(() => {
    if (!order || order.length === 0) return childIds;
    const set = new Set(childIds);
    const filtered = order.filter((k) => set.has(k));
    const missing = childIds.filter((k) => !filtered.includes(k));
    return [...filtered, ...missing];
  }, [order, childIds]);

  // Map id -> child
  const childMap = useMemo(() => {
    const m = new Map<string, React.ReactElement>();
    childArray.forEach((el) => {
        //@ts-ignore
      const id = (el.props?.['data-id'] as string | undefined) ?? String(el.key);
      m.set(id, el);
    });
    return m;
  }, [childArray]);

  // Sensors (pointer w/ small activation distance + keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeOrder.indexOf(String(active.id));
    const newIndex = activeOrder.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(activeOrder, oldIndex, newIndex);
    onReorder?.(newOrder); // returns your real data-ids
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={activeOrder} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {activeOrder.map((id) => {
            const child = childMap.get(id);
            if (!child) return null; // tolerate dynamic list changes
            return <SortableItem key={id} id={id} child={child} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
