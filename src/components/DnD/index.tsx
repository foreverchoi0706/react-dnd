import {
  FC,
  PropsWithChildren,
  HTMLAttributes,
  useRef,
  useReducer,
  createContext,
  useEffect,
  Dispatch,
  useContext,
  PointerEvent,
} from "react";
import { DragAndDropHandler } from "../../types";
import styles from "./index.module.css";

interface IDnDContext {
  dragStart?: (e: PointerEvent<HTMLLIElement>, index: number) => void;
  dispatch: Dispatch<number> | null;
}

const DnDContext = createContext<IDnDContext>({
  dragStart: undefined,
  dispatch: null,
});

const reducer = (state: number[], payload: number) => state.concat(payload);

const Container: FC<
  PropsWithChildren<
    HTMLAttributes<HTMLUListElement> & {
      onDragAndDrop: DragAndDropHandler;
    }
  >
> = ({ children, onDragAndDrop, ...rest }) => {
  const refComtainer = useRef<HTMLUListElement>(null);
  const [indexList, dispatch] = useReducer(reducer, []);

  //드래그시작
  const dragStart = (e: PointerEvent<HTMLLIElement>, index: number) => {
    const container = refComtainer.current;
    if (container === null || e.buttons !== 1) return;

    const items = [...container.childNodes] as HTMLElement[];
    // move the elements below dragItem.
    const itemsBelowDragItem = items.slice(index + 1);
    const dragItem = items[index];
    const noDragItems = items.filter((_, i) => i !== index);
    const dragIndex = indexList[index];

    // getBoundingClientRect of dragItem
    const dragBoundingRect = dragItem.getBoundingClientRect();

    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    // distance to be moved.
    // distance between two card
    const distance = dragBoundingRect.height + space;

    // set style for dragItem when mouse down
    dragItem.style.position = "fixed";
    dragItem.style.zIndex = "999999";
    dragItem.style.width = `${dragBoundingRect.width}px`;
    dragItem.style.height = `${dragBoundingRect.height}px`;
    dragItem.style.top = `${dragBoundingRect.top}px`;
    dragItem.style.left = `${dragBoundingRect.left}px`;
    dragItem.style.cursor = "grabbing";

    // create alternate div element when dragItem position is fixed
    const tempArea = window.document.createElement("div");
    tempArea.id = "temp-area";
    tempArea.style.width = `${dragBoundingRect.width}px`;
    tempArea.style.height = `${dragBoundingRect.height}px`;
    tempArea.style.pointerEvents = "none";
    container.appendChild(tempArea);

    itemsBelowDragItem.forEach(({ style }) => {
      style.transform = `translateY(${distance}px)`;
    });

    // get the original coordinates of the mouse pointer
    const x = e.clientX;
    const y = e.clientY;

    //드래그중
    window.document.onpointermove = (e) => {
      // Calculate the distance the mouse pointer has traveled.
      // original coordinates minus current coordinates.
      const posX = e.clientX - x;
      const posY = e.clientY - y;
      // Move Item
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`;
      // swap position and data
      noDragItems.forEach((noDragItem) => {
        // check two elements is overlapping.
        const dragItemRect = dragItem.getBoundingClientRect();
        const noDragItemRect = noDragItem.getBoundingClientRect();

        const isOverlap =
          dragItemRect.y < noDragItemRect.y + noDragItemRect.height / 2 &&
          dragItemRect.y + noDragItemRect.height / 2 > noDragItemRect.y;

        if (!isOverlap) return;
        //겹처진아이템위치변경
        if (noDragItem.getAttribute("style")) {
          noDragItem.style.transform = "";
          index++;
        } else {
          noDragItem.style.transform = `translateY(${distance}px)`;
          index--;
        }
      });
    };

    //드래그끝남
    window.document.onpointerup = () => {
      window.document.onpointerup = null;
      window.document.onpointermove = null;
      dragItem.style.position = "";
      dragItem.style.zIndex = "";
      dragItem.style.cursor = "";
      dragItem.style.width = "";
      dragItem.style.height = "";
      dragItem.style.top = "";
      dragItem.style.left = "";
      container?.removeChild(tempArea);
      items.forEach(({ style }) => (style.transform = ""));
      onDragAndDrop(dragIndex, index);
    };
  };

  return (
    <DnDContext.Provider value={{ dispatch, dragStart }}>
      <ul className={styles.dnd_container} ref={refComtainer} {...rest}>
        {children}
      </ul>
    </DnDContext.Provider>
  );
};

const Element: FC<
  PropsWithChildren<HTMLAttributes<HTMLLIElement> & { index: number }>
> = ({ children, ...rest }) => {
  const { dispatch, dragStart } = useContext(DnDContext);

  useEffect(() => {
    if (dispatch === null) return;
    dispatch(rest.index);
  }, []);

  return (
    <li
      onPointerDown={dragStart ? (e) => dragStart(e, rest.index) : undefined}
      {...rest}
    >
      {children}
    </li>
  );
};

const DnD = {
  Container,
  Element,
};

export default DnD;
