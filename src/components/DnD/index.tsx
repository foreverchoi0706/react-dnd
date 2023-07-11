import React, { FC, PropsWithChildren, HTMLAttributes, useRef } from "react";

export const Container: FC<
  PropsWithChildren<HTMLAttributes<HTMLUListElement>>
> = ({ children, ...rest }) => {
  const refUl = useRef<HTMLUListElement>(null);

  return (
    <ul ref={refUl} {...rest}>
      {children}
    </ul>
  );
};

export const Element: FC<PropsWithChildren<HTMLAttributes<HTMLLIElement>>> = ({
  children,
  ...rest
}) => {
  return <li {...rest}>{children}</li>;
};
