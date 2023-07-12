import { useState, FC, useCallback, useEffect } from "react";
import DnD from "../../components/DnD";
import Button from "../../components//Button";
import Spinner from "../../components/Spinner";
import Card from "../../components/Card";
import { CardData, DragAndDropHandler } from "../../types";
import styles from "./index.module.css";
import cardListData from "../../data";

const Home: FC = () => {
  const [cardList, setCardList] = useState<CardData[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSortable, setIsSortable] = useState<boolean>(false);

  const handleClick = () => setIsSortable(true);

  const handleClick2 = () => setIsSortable(false);

  const handleDragAndDrop = useCallback<DragAndDropHandler>(
    (dragIndex, dropIndex) => {
      setCardList((prevState) => {
        const dragCard = prevState.splice(dragIndex, 1)[0];
        prevState.splice(dropIndex, 0, dragCard);
        return [...prevState];
      });
    },
    []
  );

  useEffect(() => {
    new Promise((resolve) =>
      setTimeout(() => {
        setCardList(cardListData);
        resolve(true);
      }, 1000)
    )
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true));
  }, []);

  return (
    <main className={styles.home}>
      <h1 className={styles.home_title}>멤버십 지갑 목록 화면</h1>
      <div className={styles.home_contents_wrap}>
        {isLoaded ? (
          <DnD.Container
            isDraggable={isSortable}
            onDragAndDrop={handleDragAndDrop}
          >
            {cardList.map((item, index) => (
              <DnD.Element
                className={styles.home_dnd_element}
                key={item.cardId}
                index={index}
              >
                <Card {...item} isSortable={isSortable} />
              </DnD.Element>
            ))}
          </DnD.Container>
        ) : (
          <div className={styles.home_spinner_warp}>
            <Spinner />
          </div>
        )}
      </div>
      {isSortable ? (
        <Button isFull onClick={handleClick2}>
          변경완료
        </Button>
      ) : (
        <Button disabled={!isLoaded} isFull onClick={handleClick}>
          순서변경
        </Button>
      )}
    </main>
  );
};

export default Home;
