import { useState, FC, useCallback, useEffect } from "react";
import DnD from "../../components/DnD";
import Button from "../../components//Button";
import Spinner from "../../components/Spinner";
import Card from "../../components/Card";
import { CardData, Response, DragAndDropHandler } from "../../types";
import styles from "./index.module.css";

const API_KEY = "Nakdajdjdkjd0ak202kn" as const;

const Home: FC = () => {
  const [cardList, setCardList] = useState<CardData[]>([]);
  const [isDataLoaded, setDataIsLoaded] = useState<boolean>(false);
  const [isSortable, setIsSortable] = useState<boolean>(false);

  const handleSortClick = () => {
    const cardIdList = cardList.map(({ cardId }) => cardId);

    fetch("/api/recruit/update/list", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        cardIdList,
      }),
    })
      .then(() => alert("변경이 완료되었습니다."))
      .catch((error) => console.error(error))
      .finally(() => setIsSortable(false));
  };

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
    fetch("/api/recruit/get/list", {
      method: "POST",
      headers: {
        Authorization: "Nakdajdjdkjd0ak202kn",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ data }: Response<{ cardList: CardData[] }>) =>
        setCardList(data.cardList)
      )
      .catch((error) => console.error(error))
      .finally(() => setDataIsLoaded(true));
  }, []);

  return (
    <main className={styles.home}>
      <h1 className={styles.home_title}>멤버십 지갑 목록 화면</h1>
      <div className={styles.home_contents_wrap}>
        {isDataLoaded ? (
          <DnD.Container
            isDraggable={isSortable}
            onDragAndDrop={handleDragAndDrop}
          >
            {cardList.map((card, index) => (
              <DnD.Element
                className={styles.home_dnd_element}
                key={card.cardId}
                index={index}
              >
                <Card {...card} isSortable={isSortable} />
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
        <Button type="button" isFull onClick={handleSortClick}>
          변경완료
        </Button>
      ) : (
        <Button
          type="button"
          disabled={!isDataLoaded}
          isFull
          onClick={() => setIsSortable(true)}
        >
          순서변경
        </Button>
      )}
    </main>
  );
};

export default Home;
