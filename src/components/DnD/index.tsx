import {
  FC,
  PropsWithChildren,
  HTMLAttributes,
  useRef,
  useReducer,
  createContext,
  useEffect,
  useContext,
  PointerEvent,
} from "react";
import { DnDContext, DragAndDropHandler } from "../../types";
import styles from "./index.module.css";

const DnDContext = createContext<DnDContext>({});

const DnDreducer = (state: number[], payload: number) => state.concat(payload);

const Container: FC<
  PropsWithChildren<
    HTMLAttributes<HTMLUListElement> & {
      isDraggable?: boolean;
      onDragAndDrop: DragAndDropHandler;
    }
  >
> = ({ children, isDraggable = true, onDragAndDrop, ...rest }) => {
  const refComtainer = useRef<HTMLUListElement>(null);
  const [indexList, dispatch] = useReducer(DnDreducer, []);

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

    const dragBoundingRect = dragItem.getBoundingClientRect();

    //아이템간의거리
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    //얼만큼이동할지거리
    const distance = dragBoundingRect.height + space;

    //드래그된아이템스타일변경
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

    //드래그중
    window.document.onpointermove = ({ clientX, clientY }) => {
      //자동스크롤기능
      const isOverFloor =
        clientY > container.clientHeight - dragItem.clientHeight; //container바닥에닿았을때
      const isOverCeil = clientY < container.offsetTop + dragItem.clientHeight; //container천장에닿았을때

      if (isOverFloor || isOverCeil) {
        const nextIndex = isOverFloor ? index + 1 : index - 1;
        items[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      //아이템따라다니게
      dragItem.style.transform = `translate(${clientX - e.clientX}px, ${
        clientY - e.clientY
      }px)`;
      //겹친아이템감지
      noDragItems.forEach((noDragItem) => {
        // check two elements is overlapping.
        const dragItemRect = dragItem.getBoundingClientRect();
        const noDragItemRect = noDragItem.getBoundingClientRect();

        const isOverlap =
          dragItemRect.y < noDragItemRect.y + noDragItemRect.height / 2 &&
          dragItemRect.y + noDragItemRect.height / 2 > noDragItemRect.y;

        if (!isOverlap) return;
        //겹친아이템위치저장
        if (noDragItem.getAttribute("style")) {
          noDragItem.style.transform = "";
          index++;
        } else {
          noDragItem.style.transform = `translateY(${distance}px)`;
          index--;
        }
      });
    };
    //드래그끝
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
    <DnDContext.Provider value={isDraggable ? { dispatch, dragStart } : {}}>
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
    if (dispatch === undefined) return;
    dispatch(rest.index);
  }, [dispatch]);

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
