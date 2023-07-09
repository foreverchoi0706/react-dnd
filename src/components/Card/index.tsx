import { FC } from "react";
import styles from "./index.module.css";
import { CardData } from "../../types";

const Card: FC<CardData> = ({ cardLogoURL, desc, title }) => {
  return (
    <div className={styles.card}>
      <img
        draggable={false}
        className={styles.card_img}
        src={cardLogoURL}
        alt="cardLogo"
      />
      <div>
        <h3 className={styles.card_title}>{title}</h3>
        <p className={styles.card_desc}>{desc}</p>
      </div>
    </div>
  );
};

export default Card;
