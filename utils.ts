import { GraphQLError } from "graphql";
import { APIcity, APIweather } from "./types.ts";


export const getCityData = async(city: string): Promise<APIcity> =>{

    const API_KEY = Deno.env.get("API_KEY");
    if(!API_KEY){
        throw new GraphQLError("Api key no encontrada 1 ")
    }

    const url = `https://api.api-ninjas.com/v1/city?name=${city}`
    const response = await fetch(url,{
        headers: {
            "X-API-KEY":API_KEY
        }
    })

    if(!response.ok){
        throw new GraphQLError("Problemas con la api")
    }

    const data : APIcity = await response.json();

    return data
}


export const getTemp = async(latitude: number, longitude: number): Promise<APIweather> =>{
    const API_KEY = Deno.env.get("API_KEY");
    if(!API_KEY){
        throw new GraphQLError("Api key no encontrada")
    }
    const url = `https://api.api-ninjas.com/v1/weather?lat=${latitude}&&lon=${longitude}`
    const response = await fetch(url,{
        headers: {
            "X-API-KEY":API_KEY
        }
    })

    if(!response.ok){
        throw new GraphQLError("Problemas con la api")
    }

    const data: APIweather = await response.json()
    return data;
}