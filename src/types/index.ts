import { PointerEvent } from "react";

export interface User {
    id: number
    name: string
    username: string
    email: string
    address: Address
    phone: string
    website: string
    company: Company
}

export interface Address {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: Geo
}

export interface Geo {
    lat: string
    lng: string
}

export interface Company {
    name: string
    catchPhrase: string
    bs: string
}


export type DragAndDropHandler = (dragIndex: number, dropIndex: number) => void;

export interface DnDContext {
    handlePointerDown?: (e: PointerEvent<HTMLLIElement>, index: number) => void;
}

