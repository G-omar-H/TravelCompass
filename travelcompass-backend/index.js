const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const adventureRoutes = require('./routes/adventureRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/adventures', adventureRoutes);
app.use('/api/payments', paymentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});