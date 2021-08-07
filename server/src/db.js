const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost/live-chat',
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log('DB connected')
);

module.exports = mongoose;
