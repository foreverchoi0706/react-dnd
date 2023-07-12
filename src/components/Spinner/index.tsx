import { FC } from "react";
import logo from "../../assets/react.svg";
import styles from "./index.module.css";

const Spinner: FC = () => {
  return (
    <img
      className={styles.spinner}
      src={logo}
      alt="spinner"
      title="spinner"
      width={50}
      height={50}
    />
  );
};

export default Spinner;
