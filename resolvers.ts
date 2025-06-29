import { HotelModel } from "./types.ts";
import { getTemp } from "./utils.ts";


export const resolvers ={

    Hotel :{
        id:(parent: HotelModel)  => parent._id!.toString() ,
        intitial_temp:async(parent: HotelModel): Promise<number> =>{
            const datos  = await getTemp(parent.latitude, parent.longitude);
            return datos.min_temp
        },
        current_temp:async(parent:HotelModel):Promise<number> =>{
            const datos  = await getTemp(parent.latitude, parent.longitude);
            return datos.temp
        },
        luxury_score:(parent: HotelModel): number =>{
            return parent.rooms * parent.stars
        },
    }

}