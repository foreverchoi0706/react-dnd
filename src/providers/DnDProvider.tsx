import {
  FC,
  PropsWithChildren,
  Children,
  cloneElement,
  DragEvent,
  HTMLAttributes,
  ReactElement,
  useState,
} from "react";

interface DnDProviderProps {
  onDragEnd: (item: any[]) => void;
}

const DnDProvider: FC<PropsWithChildren<DnDProviderProps>> = ({
  children,
  onDragEnd,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addDraggableAttribute = (child: ReactElement, index: number) =>
    cloneElement(child, {
      draggable: true,
      id: index,
      styles: {
        cursor: "grabbing",
      },
      onDragStart: () => setDraggedIndex(index),
      onDragEnd: () => setDraggedIndex(null),
      onDragOver: (e: DragEvent<HTMLAttributes<HTMLElement>>) => {
        e.preventDefault();
      },
      onDrop: (e: DragEvent<HTMLAttributes<HTMLElement>>) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        console.log(children);

        const newItems = Children.map(
          children as ReactElement<unknown>,
          ({ props }) => props.children.props
        );
        if (!newItems) return;

        const droppedItem = newItems.splice(draggedIndex, 1)[0];
        newItems.splice(index, 0, droppedItem);
        onDragEnd(newItems);
      },
    });

  if (!children || typeof children === "object") {
    const modifiedChildren = Children.map(
      children as ReactElement,
      addDraggableAttribute
    );

    return Children.map(modifiedChildren, (item) => item);
  }
  return null;
};

export default DnDProvider;
