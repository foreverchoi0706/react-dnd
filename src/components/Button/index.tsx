import { FC, PropsWithChildren, ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

const Button: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
    isFull?: boolean;
  }
> = ({ children, isFull = false, ...rest }) => {
  return (
    <button
      className={`${styles.button} ${isFull ? styles.button_full : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
