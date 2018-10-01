var express = require('express');
var graphqlHTTP = require('express-graphql');
var {
    buildSchema,
    graphql
} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type User {
        id: Int!,
        name: String,
    }
    type Query {
        rollDice(numDice: Int!, numSides: Int): [Int]
        getUserById(id: Int): User
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
    rollDice: function({ numDice, numSides }) {
        var output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },

    getUserById({ id }) {
        console.log('getUser: ', id);

        return {
            id,
            name: 'Name-' + id,
        };
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: false, // 设置为 true 可以使用 GraphiQL 工具来手动执行 GraphQL 查询
}));

app.get('/client(\.html)?', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

app.listen(4000);
console.log(`Running a GraphQL API server at localhost:4000/graphql
    Or  http://localhost:4000/client
`);


// 服务端查询
// === http://localhost:4000/graphql?query={getUserById(id:3){id,name}}
graphql(schema, '{getUserById(id:3){id,name}}', root).then((response) => {
    console.log('服务端查询结果: ', response);
});