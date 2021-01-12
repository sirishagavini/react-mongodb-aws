import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
//
// const articlesInfo = {
//  'learn-react': {
//      upvotes: 0,
//      comments: []
//  },
//  'learn-node': {
//      upvotes: 0,
//      comments: []
//  }
// };

const app = express();
app.use(express.static(path.join(__dirname, '/build')))
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.get('/api/articles/:name', async (req, res) => {
    try {
        const articleName = req.params.name;
const client = await
MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
const db = client.db('my-blog');

const articleInfo = await
db.collection('articles').findOne({name: articleName})
res.status(200).json(articleInfo);
client.close();
} catch(error) {
        res.status(500).json({message: "error", error });
}
});


app.get('/articles', (req, res) => res.send("Test successful!"));
app.get('/articles/:name', (req, res) => res.send(`Test ${req.params.name} auto!! `));

app.post('/articles', (req, res) => res.send(`Test ${req.body.name} successful!`));
app.post('/api/articles/:name/upvotes', (req, res) => {
const articleName = req.params.name;
 articlesInfo[articleName].upvotes += 1;
 res.status(200).send(`${articleName} has ${articlesInfo[articleName].upvotes} votes `);
});

app.post('/api/articles/:name/add-comments', (req, res) => {
    const {username, text} = req.body;
    const articleName = req.params.name;
    articlesInfo[articleName].comments.push({ username, text});
    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log("listening on 8000"));