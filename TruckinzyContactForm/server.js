// server.js

const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
    const data = req.body;

    // Convert data to an array of arrays
    const rows = [
        ['Field', 'Value'],
        ...Object.entries(data)
    ];

    // Create a new workbook and add the data
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'Data');

    // Save the workbook to a file
    xlsx.writeFile(wb, 'FleetData.xlsx');

    res.send('Data saved to FleetData.xlsx');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
