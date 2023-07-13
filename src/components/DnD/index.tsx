import {
  FC,
  PropsWithChildren,
  HTMLAttributes,
  useRef,
  createContext,
  useContext,
  PointerEvent,
} from "react";
import { DnDContext, DragAndDropHandler } from "../../types";
import styles from "./index.module.css";

const SCROLL_SPEED = 7;

const DnDContext = createContext<DnDContext>({});

const Container: FC<
  PropsWithChildren<
    HTMLAttributes<HTMLUListElement> & {
      isDraggable?: boolean;
      onDragAndDrop: DragAndDropHandler;
    }
  >
> = ({ children, isDraggable = true, onDragAndDrop, ...rest }) => {
  const refComtainer = useRef<HTMLUListElement>(null);
  let scrollInterval: number | null = null;

  //드래그시작
  const handlePointerDown = (e: PointerEvent<HTMLLIElement>, index: number) => {
    const container = refComtainer.current;
    if (container === null || e.buttons !== 1) return;
    const items = [...container.childNodes] as HTMLElement[];
    const noDragItems = items.filter((_, i) => i !== index);
    const dragItem = items[index];
    const dragItemBelowItems = items.slice(index + 1);
    const dragIndex = index; //드래그시작시의index기억
    const dragBoundingRect = dragItem.getBoundingClientRect();

    //아이템들이얼만큼이동할지거리
    const distance =
      dragBoundingRect.height +
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    //드래그된아이템스타일변경
    dragItem.style.position = "fixed";
    dragItem.style.zIndex = "999999";
    dragItem.style.width = `${dragBoundingRect.width}px`;
    dragItem.style.height = `${dragBoundingRect.height}px`;
    dragItem.style.top = `${dragBoundingRect.top}px`;
    dragItem.style.left = `${dragBoundingRect.left}px`;
    dragItem.style.cursor = "grabbing";

    //아이템겹치지안도록임시영역생성
    const tempArea = window.document.createElement("div");
    tempArea.id = "temp-area";
    tempArea.style.width = `${dragBoundingRect.width}px`;
    tempArea.style.height = `${dragBoundingRect.height}px`;
    tempArea.style.pointerEvents = "none";
    container.appendChild(tempArea);

    //드래그아이템밑아이템들위치고정
    dragItemBelowItems.forEach(({ style }) => {
      style.transform = `translateY(${distance}px)`;
    });

    //드래그중
    window.document.onpointermove = ({ clientX, clientY }) => {
      //자동스크롤기능
      const isOverFloor =
        clientY > container.clientHeight - dragItem.clientHeight / 2; //container바닥에닿았을때
      const isOverCeil =
        clientY < container.offsetTop + dragItem.clientHeight / 2; //container천장에닿았을때
      if (isOverFloor || isOverCeil) {
        if (scrollInterval === null) {
          scrollInterval = window.setInterval(() => {
            container.scrollTop += isOverFloor
              ? SCROLL_SPEED
              : SCROLL_SPEED * -1;
          }, 10);
        }
      } else {
        if (scrollInterval !== null) {
          window.clearInterval(scrollInterval);
          scrollInterval = null;
        }
      }
      //아이템따라다니게
      dragItem.style.transform = `translate(${clientX - e.clientX}px, ${
        clientY - e.clientY
      }px)`;
      //겹친아이템감지
      noDragItems.forEach((noDragItem) => {
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
      if (scrollInterval !== null) {
        window.clearInterval(scrollInterval);
        scrollInterval = null;
      }
    };
  };
  return (
    <DnDContext.Provider value={isDraggable ? { handlePointerDown } : {}}>
      <ul className={styles.dnd_container} ref={refComtainer} {...rest}>
        {children}
      </ul>
    </DnDContext.Provider>
  );
};

const Element: FC<
  PropsWithChildren<
    Omit<HTMLAttributes<HTMLLIElement>, "onPointerDown"> & {
      index: number;
    }
  >
> = ({ children, ...rest }) => {
  const { handlePointerDown } = useContext(DnDContext);
  return (
    <li
      onPointerDown={
        handlePointerDown ? (e) => handlePointerDown(e, rest.index) : undefined
      }
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
