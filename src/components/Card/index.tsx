import { FC } from "react";
import { CardData } from "../../types";
import styles from "./index.module.css";

const Card: FC<CardData & { isSortable: boolean }> = ({
  cardLogoURL,
  desc,
  title,
  isSortable,
}) => {
  return (
    <div className={styles.card}>
      <img className={styles.card_img} src={cardLogoURL} alt="cardLogo" />
      <div className={styles.card_contents_wrap}>
        <h3 className={styles.card_contents_title}>{title}</h3>
        <p className={styles.card_contents_desc}>{desc}</p>
      </div>
      {isSortable && <span className={styles.card_sort_btn}>🟰</span>}
    </div>
  );
};

export default Card;
