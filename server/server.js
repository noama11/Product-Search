const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');


const app = express();
const PORT = 5000;

const DATA_FILE = path.join(__dirname, 'MeNow_product_task.json');


// Helper function to read JSON data
async function readDataFile() {
    try {
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(fileData);
    } catch (e) {
        console.error("Error reading data file:", error);
        throw e;
    }

}


app.use(cors()); // Enable CORS for all routes

// Enable JSON parsing for incoming requests
app.use(express.json());  // Middleware



// GET shuffled products
app.get("/skincare", async (req, res) => {
    try {
        const data = await readDataFile();
        const shuffled = data.sort(() => 0.5 - Math.random());
        res.json(shuffled.slice(0, 5));
    } catch (e) {
        res.status(500).json({ message: "Faild to read products" })
    }

})

// Proxy to fetch images from Google Drive
app.get('/image-proxy', async (req, res) => {
    const { imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400).send('Image URL is required');

    }
    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
        });
        response.data.pipe(res);
    } catch (error) {
        console.error('Failed to fetch image:', error);
        res.status(500).send('Failed to fetch image');

    }
});



// Search products
app.get('/skincare/search', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    try {
        const data = await readDataFile();
        const filtered = data.filter((item) => item.keywords.includes(keyword));
        const sortedByScore = filtered.sort((a, b) => b.score - a.score).slice(0, 5);
        res.json(sortedByScore);
    } catch (e) {
        res.status(500).json({ message: "Failed to process search" });

    }
})


// Update product score
app.put('/skincare/:id', async (req, res) => {

    try {
        const data = await readDataFile();

        const id = parseInt(req.params.id);
        console.log(id)

        const { newScore } = req.body;

        const index = findProductIndexById(id, data);

        if (index === -1) return res.status(404).json({ message: 'Product not found' });

        // Update the score field if it exists
        if (newScore !== undefined && !isNaN(newScore)) {
            data[index].score = newScore || data[index].score
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8'); // update the file with the new score number.
            res.json({ success: true, data: data[index] });
        } else {
            res.status(400).json({ message: 'New score is required' });

        }
    }
    catch (e) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Failed to update score' });
    }


})

// Helper function to find the index of a product by ID
function findProductIndexById(id, data) {
    for (let i = 0; i < data.length; i++) {
        if (Number(data[i].id) === id) {
            return i; // Return the index if ID matches
        }
    }
    return -1; // Return -1 if ID is not found
}

app.listen(PORT, () => { console.log("Server listening on port 5000") }) // Because react is on port 3000 by default.
