import { useState, FC, useCallback, useEffect } from "react";
import { CardData, DragAndDropHandler } from "./types";
import DnD from "./components/DnD";
import Button from "./components/Button";
import Spinner from "./components/Spinner";
import styles from "./App.module.css";
import cardListData from "./data";

const App: FC = () => {
  const [cardList, setCardList] = useState<CardData[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
    <div>
      <h1 className={styles.card_list_title}>카드</h1>
      {isLoaded ? (
        <DnD.Container onDragAndDrop={handleDragAndDrop}>
          {cardList.map((item, index) => (
            <DnD.Element key={item.cardId} index={index}>
              <div className="card">
                <div className="img-container">
                  <img src={item.cardLogoURL} alt="cardLogo" />
                </div>
                <div className="box">
                  <h4>{item.title}</h4>
                  <h2>{item.desc}</h2>
                </div>
              </div>
            </DnD.Element>
          ))}
        </DnD.Container>
      ) : (
        <div className={styles.card_list_spinner_warp}>
          <Spinner />
        </div>
      )}
      <Button disabled={isLoaded} onClick={() => console.log(cardList)}>
        CLICK
      </Button>
    </div>
  );
};

export default App;
