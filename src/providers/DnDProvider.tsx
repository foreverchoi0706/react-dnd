import {
  FC,
  PropsWithChildren,
  Children,
  cloneElement,
  DragEvent,
  isValidElement,
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
  const [draggedOffsetY, setDraggedOffsetY] = useState<number | null>(null);

  const addDraggableAttribute = (child: ReactElement, index: number) =>
    cloneElement(child, {
      draggable: true,
      onDragStart: ({ clientY }: DragEvent<HTMLAttributes<HTMLElement>>) => {
        setDraggedOffsetY(clientY);
        setDraggedIndex(index);
      },
      onDragEnd: () => {
        setDraggedIndex(null);
        setDraggedOffsetY(null);
      },
      onDragOver: (e: DragEvent<HTMLAttributes<HTMLElement>>) => {
        e.preventDefault();
      },
      onDrop: (e: DragEvent<HTMLAttributes<HTMLElement>>) => {
        e.preventDefault();
        if (draggedIndex === null || draggedOffsetY === null) return;

        const newItems = Children.map(
          children,
          ({ props }) => props.children.props
        );
        if (!newItems) return;
        const droppedItem = newItems.splice(draggedIndex, 1)[0];
        newItems.splice(index, 0, droppedItem);
        onDragEnd(newItems);
      },
    });

  if (!children || typeof children === "object") {
    const modifiedChildren = Children.map<ReactElement[], ReactElement>(
      children,
      addDraggableAttribute
    );

    return Children.map(modifiedChildren, (item) => item);
  }
  return null;
};

export default DnDProvider;
