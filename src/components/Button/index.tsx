import { FC, PropsWithChildren, ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

const Button: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...rest }) => {
  return (
    <button className={styles.button} {...rest}>
      {children}
    </button>
  );
};

export default Button;
