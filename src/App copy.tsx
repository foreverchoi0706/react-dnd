import { useState, FC, PointerEvent, useRef } from "react";
import cardListData from "./data";
import { TCardData } from "./types";

const App: FC = () => {
  const [cardList, setCardList] = useState<TCardData[]>(cardListData);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStart = (e: PointerEvent<HTMLDivElement>, index: number) => {
    const container = containerRef.current;
    if (container === null || e.buttons !== 1) return;

    setIsDragging(index);

    const items = [...container.childNodes] as HTMLElement[];
    const itemsBelowDragItem = items.slice(index + 1);
    const dragItem = items[index];
    const noDragItems = items.filter((_, i) => i !== index);
    const dragData = cardList[index];

    console.log(dragItem);
    console.log(dragItem);

    // getBoundingClientRect of dragItem
    const dragBoundingRect = dragItem.getBoundingClientRect();
    // distance between two card
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;
    // move the elements below dragItem.
    // distance to be moved.
    const distance = dragBoundingRect.height + space;
    let nextCardList = cardList;

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

        const isOverlapping =
          dragItemRect.y < noDragItemRect.y + noDragItemRect.height / 2 &&
          dragItemRect.y + noDragItemRect.height / 2 > noDragItemRect.y;

        if (!isOverlapping) return;
        // Swap Position Card
        if (noDragItem.getAttribute("style")) {
          noDragItem.style.transform = "";
          index++;
        } else {
          noDragItem.style.transform = `translateY(${distance}px)`;
          index--;
        }
        // Swap Data
        nextCardList = cardList.filter(
          ({ cardId }) => cardId !== dragData.cardId
        );
        nextCardList.splice(index, 0, dragData);
      });
    };
    // perform the function on hover.

    // finish onPointerDown event
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

      setIsDragging(null);
      setCardList(nextCardList);
    };
  };

  return (
    <div className="container" ref={containerRef}>
      {cardList.map((item, index) => (
        <div key={item.cardId} onPointerDown={(e) => dragStart(e, index)}>
          <div className={`card ${isDragging === index ? "dragging" : ""}`}>
            <div className="img-container">
              <img src={item.cardLogoURL} alt="cardLogo" />
            </div>
            <div className="box">
              <h4>{item.title}</h4>
              <h2>{item.desc}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
