require('dotenv').config();
const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json({message: 'The server is working'})
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

