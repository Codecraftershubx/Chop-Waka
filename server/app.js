import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// Sample menu data
const menuItems = [
  { id: 1, name: "Margherita Pizza", price: 12.99, category: "pizza" },
  { id: 2, name: "Caesar Salad", price: 8.99, category: "salads" }
];

// API endpoint
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

export default app;