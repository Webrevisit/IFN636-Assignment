const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const DatabaseSingleton = require('./patterns/DatabaseSingleton');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/licenses', require('./routes/licenseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/license-requests', require('./routes/licenseRequestRoutes'));

if (require.main === module) {
  const startServer = async () => {
    try {
      await DatabaseSingleton.connect(process.env.MONGO_URI);

      const PORT = process.env.PORT || 5001;

      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  };

  startServer();
}

module.exports = app;