import { PointerEvent } from "react";

export interface Response<T = unknown> {
    status: number,
    message: string,
    data: T
    requestTime: number,
    completeTime: number
}

export interface CardData {
    cardId: number;
    title: string;
    desc: string;
    cardLogoURL: string;
}

export type DragAndDropHandler = (dragIndex: number, dropIndex: number) => void;

export interface DnDContext {
    handlePointerDown?: (e: PointerEvent<HTMLLIElement>, index: number) => void;
}
