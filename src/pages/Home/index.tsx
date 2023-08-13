import { useState, FC, useCallback, useEffect } from "react";
import DnD from "../../components/DnD";
import Button from "../../components//Button";
import Spinner from "../../components/Spinner";
import { DragAndDropHandler, User } from "../../types";
import styles from "./index.module.css";

const Home: FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isDataLoaded, setDataIsLoaded] = useState<boolean>(false);
  const [isSortable, setIsSortable] = useState<boolean>(false);

  const handleDragAndDrop = useCallback<DragAndDropHandler>(
    (dragIndex, dropIndex) => {
      setUserList((prevState) => {
        const dragCard = prevState.splice(dragIndex, 1)[0];
        prevState.splice(dropIndex, 0, dragCard);
        return [...prevState];
      });
    },
    []
  );

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "GET",
    })
      .then<User[]>((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) => console.error(error))
      .finally(() => setDataIsLoaded(true));
  }, []);

  return (
    <main className={styles.home}>
      <h1 className={styles.home_title}>USER LIST</h1>
      <div className={styles.home_contents_wrap}>
        {isDataLoaded ? (
          <DnD.Container
            isDraggable={isSortable}
            onDragAndDrop={handleDragAndDrop}
          >
            {userList.map((user, index) => (
              <DnD.Element
                className={styles.home_dnd_element}
                key={user.id}
                index={index}
              >
                <h2>{user.username}</h2>
                <p>FULL NAME : {user.name}</p>
                <h4>{user.email}</h4>
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
        <Button
          type="button"
          isFull
          onClick={() => {
            console.log(userList);
            setIsSortable(false);
          }}
        >
          CONFIRM
        </Button>
      ) : (
        <Button
          type="button"
          disabled={!isDataLoaded}
          isFull
          onClick={() => setIsSortable(true)}
        >
          SORT
        </Button>
      )}
    </main>
  );
};

export default Home;
