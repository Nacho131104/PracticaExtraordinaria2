

export const schema = `#graphql 

    type Hotel {
        id: ID!
        name: String!
        city: String!
        country: String!
        rooms: Int!
        stars: Int!
        initial_temp: Int!
        current_temp: Int!
        luxury_score: Int!
    }
    type Query {
        getHotel(id:ID!): Hotel
        getHotels: [Hotel!]!
    }
    type Mutation {
        addHotel(name: String!, city: String!, rooms: Int!, stars: Int!): Hotel!
        deleteHotel(id: ID!): Boolean!
    }

`;