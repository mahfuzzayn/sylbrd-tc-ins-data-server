const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const cors = require('cors'); // Import the cors middleware

const app = express();

const url = 'http://application.sylhetboard.gov.bd/index.php/tc/showSeat/11'; // Replace with your URL

// Use the cors middleware
app.use(cors());

app.get('/:id', async (req, res) => {
    try {
        const targetIdValue = req.params.id;

        const htmlResponse = await request(url);
        const $ = cheerio.load(htmlResponse);

        const targetTrElement = $(`td:contains(${targetIdValue})`).closest('tr');

        const rowData = {
            id: targetTrElement.find('td:eq(0)').text(),
            collegeName: targetTrElement.find('td:eq(1)').text(),
            version: targetTrElement.find('td:eq(2)').text(),
            shift: targetTrElement.find('td:eq(3)').text(),
            group: targetTrElement.find('td:eq(4)').text(),
            gender: targetTrElement.find('td:eq(5)').text(),
            minimumGPA: targetTrElement.find('td:eq(6)').text(),
            availableSubjects: targetTrElement.find('td:eq(7)').text(),
            availableSeats: targetTrElement.find('td:eq(8)').text()
        };

        res.json(rowData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
