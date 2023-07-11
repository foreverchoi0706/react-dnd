import { useState, FC, useCallback } from "react";
import cardListData from "./data";
import { TCardData } from "./types";
import { Container, DragAndDropHandler, Element } from "./components/DnD";

const App: FC = () => {
  const [cardList, setCardList] = useState<TCardData[]>(cardListData);

  const handleDragAndDrop = useCallback<DragAndDropHandler>(
    (dragIndex, dropIndex) => {
      setCardList((prevState) => {
        const nextCard = prevState.splice(dragIndex, 1)[0];
        prevState.splice(dropIndex, 0, nextCard);
        return [...prevState];
      });
    },
    []
  );

  return (
    <div>
      <Container className="container" onDragAndDrop={handleDragAndDrop}>
        {cardList.map((item, index) => (
          <Element key={item.cardId} index={index}>
            <div className="card">
              <div className="img-container">
                <img src={item.cardLogoURL} alt="cardLogo" />
              </div>
              <div className="box">
                <h4>{item.title}</h4>
                <h2>{item.desc}</h2>
              </div>
            </div>
          </Element>
        ))}
      </Container>
      <button onClick={() => console.log(cardList)}>CLICK</button>
    </div>
  );
};

export default App;
