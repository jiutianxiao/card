var _ = require('koa-route');
var Koa = require('koa');
const mongo = require("koa-mongo");
var app = new Koa();
app.use(mongo({
    uri: 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb',
    port: 27017,
    db: 'test',
}));


app.use(_.all('/', async (ctx) => {
    const result = await ctx.db.collection('users').insert({name: JSON.stringify()});
    const userId = result.ops[0]._id.toString()
    ctx.body = await ctx.db.collection('users').find().toArray();
    ctx.db.collection('users').remove()

}));
app.use(_.get('/pets/:name', ctx = {}));

app.listen(3000);
console.log('listening on port 3000');