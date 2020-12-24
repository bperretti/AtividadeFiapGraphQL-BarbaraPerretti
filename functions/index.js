const express = require("express")
const {importSchema} = require('graphql-import')
const resolvers = require("./resolvers")
const functions = require('firebase-functions')
const {ApolloServer, gql} = require("apollo-server-express")


const app = express()

const server = new ApolloServer({
    typeDefs: importSchema("./schema/index.graphql"),
    resolvers: resolvers
})

server.applyMiddleware({app,path:"/",cors:true})

exports.graphql = functions.https.onRequest(app)