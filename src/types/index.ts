export interface TCardData {
    cardId: number;
    title: string;
    desc: string;
    cardLogoURL: string;
}

export type DragAndDropHandler = (dragIndex: number, dropIndex: number) => void;