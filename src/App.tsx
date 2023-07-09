import { FC, useCallback, useEffect, useState } from "react";
import Button from "./components/Button";
import Card from "./components/Card";
import Spinner from "./components/Spinner";
import DnDProvider from "./providers/DnDProvider";
import styles from "./App.module.css";
import { CardData } from "./types";
import data from "./data";

const App: FC = () => {
  const [cardlist, setCardList] = useState<CardData[]>([]);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const dragEndHandler = useCallback<(item: CardData[]) => void>((item) => {
    setCardList(item);
  }, []);

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
        <ul className={styles.card_list_warp}>
          <DnDProvider onDragEnd={dragEndHandler}>
            {cardlist.map((card) => (
              <li key={card.cardId}>
                <Card {...card} />
              </li>
            ))}
          </DnDProvider>
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
