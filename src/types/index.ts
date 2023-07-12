import { Dispatch, PointerEvent } from "react";

export interface CardData {
    cardId: number;
    title: string;
    desc: string;
    cardLogoURL: string;
}

export type DragAndDropHandler = (dragIndex: number, dropIndex: number) => void;

export interface DnDContext {
    dragStart?: (e: PointerEvent<HTMLLIElement>, index: number) => void;
    dispatch?: Dispatch<number>;
}
