import { OptionalId } from "mongodb";


export type HotelModel =OptionalId<{
    name: string,
    city: string,
    country: string,
    rooms: number,
    stars: number,
    latitude: number,
    lomngitude: number
}>

//city api para coger datos de la ciudad
export type APIcity = Array<{
    country: string,
    latitude: number,
    longitude: number
}>

