const mongoose = require('mongoose');

class DatabaseSingleton {
  static connection = null;

  static async connect(uri) {
    if (!DatabaseSingleton.connection) {
      DatabaseSingleton.connection = await mongoose.connect(uri);

      console.log('MongoDB connected using Singleton Pattern');
    }

    return DatabaseSingleton.connection;
  }
}

module.exports = DatabaseSingleton;