import { FC, useEffect, useRef, useState, PointerEvent } from "react";
import Button from "./components/Button";
import Card from "./components/Card";
import Spinner from "./components/Spinner";
import styles from "./App.module.css";
import { CardData } from "./types";
import data from "./data";

const App: FC = () => {
  const [cardlist, setCardList] = useState<CardData[]>([]);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDraggedIndex, setIsDraggedIndex] = useState<number | null>(null);
  const refContianer = useRef<HTMLUListElement>(null);

  const handleTouchStart = (e: PointerEvent<HTMLLIElement>, index: number) => {
    const container = refContianer.current;
    if (container === null || e.buttons !== 1) return; // only use left mouse click;

    const items = [...container.childNodes] as HTMLElement[];
    const dragItem = items[index];
    const itemsBelowDragItem = items.slice(index + 1);
    const notDragItems = items.filter((_, i) => i !== index);
    const dragData = data[index];
    let newData = [...data];

    // getBoundingClientRect of dragItem
    const dragBoundingRect = dragItem.getBoundingClientRect();

    // distance between two card
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    // set style for dragItem when mouse down
    dragItem.style.position = "fixed";
    dragItem.style.zIndex = "5000";
    dragItem.style.width = `${dragBoundingRect.width}px`;
    dragItem.style.height = `${dragBoundingRect.height}px`;
    dragItem.style.top = `${dragBoundingRect.top}px`;
    dragItem.style.left = `${dragBoundingRect.left}px`;

    // create alternate div element when dragItem position is fixed
    const div = document.createElement("div");
    div.id = "div-temp";
    div.style.width = `${dragBoundingRect.width}px`;
    div.style.height = `${dragBoundingRect.height}px`;
    div.style.pointerEvents = "none";
    container.appendChild(div);

    // move the elements below dragItem.
    // distance to be moved.
    const distance = dragBoundingRect.height + space;

    itemsBelowDragItem.forEach((item) => {
      item.style.transform = `translateY(${distance}px)`;
    });

    // get the original coordinates of the mouse pointer
    const x = e.clientX;
    const y = e.clientY;

    // perform the function on hover.
    document.onpointermove = dragMove;

    function dragMove(e) {
      // Calculate the distance the mouse pointer has traveled.
      // original coordinates minus current coordinates.
      const posX = e.clientX - x;
      const posY = e.clientY - y;

      // Move Item
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`;

      // swap position and data
      notDragItems.forEach((item) => {
        // check two elements is overlapping.
        const rect1 = dragItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();

        const isOverlapping =
          rect1.y < rect2.y + rect2.height / 2 &&
          rect1.y + rect1.height / 2 > rect2.y;

        if (isOverlapping) {
          // Swap Position Card
          if (item.getAttribute("style")) {
            item.style.transform = "";
            index++;
          } else {
            item.style.transform = `translateY(${distance}px)`;
            index--;
          }

          // Swap Data
          newData = data.filter((item) => item.id !== dragData.id);
          newData.splice(index, 0, dragData);
        }
      });
    }

    // finish onPointerDown event
    document.onpointerup = dragEnd;

    function dragEnd() {
      window.document.onpointerup = null;
      window.document.onpointermove = null;

      dragItem.style = "";
      container?.removeChild(div);

      items.forEach((item) => (item.style = ""));

      setIsDraggedIndex(null);
    }
  };

  useEffect(() => {
    // fetch("/api/recruit/get/list", {
    //   method: "POST",
    //   headers: {
    //     Authorization: "Nakdajdjdkjd0ak202kn",
    //     "Content-type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => console.error(error))
    //   .finally(() => setIsListLoaded(true));

    new Promise((resolve) =>
      setTimeout(() => {
        setCardList(data);
        resolve(true);
      }, 1000)
    )
      .catch((error) => console.error(error))
      .finally(() => setIsListLoaded(true));
  }, []);

  return (
    <main className={styles.card_list}>
      <h1 className={styles.card_list_title}>멤버쉽 카드 지갑</h1>
      {isListLoaded ? (
        <ul ref={refContianer} className={styles.card_list_warp}>
          {cardlist.map((card, index) => (
            <li
              className={`${styles.card_list_item} ${
                isDraggedIndex === index ? styles.card_list_item_dragged : ""
              }`}
              onPointerDown={(e) => handleTouchStart(e, index)}
              key={card.cardId}
            >
              <Card {...card} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.card_list_spinner_warp}>
          <Spinner />
        </div>
      )}
      <Button onClick={() => setIsEditMode((prevState) => !prevState)}>
        {isEditMode ? "변경 완료" : "순서 변경"}
      </Button>
    </main>
  );
};

export default App;
