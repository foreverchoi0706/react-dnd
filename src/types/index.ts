export interface CardData {
    cardId: number;
    title: string;
    desc: string;
    cardLogoURL: string;
}

export type DragAndDropHandler = (dragIndex: number, dropIndex: number) => void;