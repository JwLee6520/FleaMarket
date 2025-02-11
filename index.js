const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_URL = 'https://api.tarkov.dev/graphql';

app.use(express.static('html'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/main.html');
});

app.get('/search', async (req, res) => {
    const itemName = req.query.name;

    if (!itemName) {
        return res.status(400).json({ error: '아이템 검색' });
    }

    const { request, gql } = await import('graphql-request');

    const query = gql`
    query GetItem($itemName: String!) {
    items(name: $itemName) {
        id
        name
        shortName
        low24hPrice
    }
}
`;

    

    try {
        const variables = { itemName };
        const data = await request(API_URL, query, variables);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error' });
    }
});

app.listen(PORT, () => {
    console.log(`여기로 접속 ㄱ : http://localhost:${PORT}`);
});

