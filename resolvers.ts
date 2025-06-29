import { Collection } from "mongodb";
import { HotelModel } from "./types.ts";
import { getCityData, getTemp } from "./utils.ts";
import { ObjectId } from "../../../../AppData/Local/deno/npm/registry.npmjs.org/bson/6.10.4/bson.d.ts";
import { GraphQLError } from "graphql";


type context ={
    HotelCollection: Collection<HotelModel>
}

type addArguments = {
    name: string,
    city: string,
    rooms: number,
    stars: number
}
export const resolvers ={

    Hotel :{
        id:(parent: HotelModel)  => parent._id!.toString() ,
        initial_temp:async(parent: HotelModel): Promise<number> =>{
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
    },

    Query:{
        getHotel:async(_:unknown, {id}: {id:string}, ctx: context): Promise<HotelModel|null> =>{
            return await ctx.HotelCollection.findOne({_id:new ObjectId(id)});
        },
        getHotels:async(_:unknown,__:unknown,ctx:context): Promise<Array<HotelModel>> =>{
            return await ctx.HotelCollection.find().toArray();
        }
    },
    Mutation:{
        deleteHotel:async(_:unknown,{id}:{id:string},ctx:context): Promise<boolean> =>{
            const deletedHotel = await ctx.HotelCollection.deleteOne({_id: new ObjectId(id)});

            if(!deletedHotel){
                return false
            }
            return true
        },

        addHotel:async(_:unknown, args: addArguments, ctx:context): Promise<HotelModel|null> =>{
            const {name,city,rooms,stars} = args;

            if(!name || !city ||!rooms ||!stars){
                throw new GraphQLError("Se necesitan todos los parametros para añadir un hotel")
            }

            if( stars > 5 || stars < 1){
                throw new GraphQLError("Numero de estrellas no permitido")
            }

            if(rooms < 1 ){
                throw new GraphQLError("El hotel debe tener minimo 1 habitacion")
            }

            const exitsHotel = await ctx.HotelCollection.findOne({name,city});
            if(exitsHotel) throw new GraphQLError("Ese hotel existe en esa ciudad")
            
            const datas = await getCityData(city)
            const{country, latitude,longitude} = datas[0];
            const {insertedId} = await ctx.HotelCollection.insertOne({
                name,
                city,
                country,
                rooms,
                stars,
                latitude,
                longitude
            });
            return {
                _id: insertedId,
                name,
                city,
                country,
                rooms,
                stars,
                latitude,
                longitude
            }
            
        }
    }


}