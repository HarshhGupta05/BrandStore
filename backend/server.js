const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/manufacturer-orders', require('./routes/manufacturerRoutes'));
app.use('/api/vendor-invoices', require('./routes/vendorInvoiceRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requisitions', require('./routes/requisitionRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
