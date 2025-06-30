const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      
    },
    

  },
);

module.exports = mongoose.model('allstates', stateSchema);
