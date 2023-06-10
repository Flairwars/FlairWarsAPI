const mongoose = require('mongoose');
const { RegisterApplication, ReadByName, AddPermissions, PermissionTypes } = require('./operations/application');
const { CreateFWColor } = require('./operations/FWColor');

// Connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Create a reference to the connection
const db = mongoose.connection;

// Handle ERROR events by logging them
db.on('error', console.error.bind(console, 'connection error:'));

// Logs once the connection is completed
db.once('open', function() {
  console.log("Connected to MongoDB!")
  // TODO: this is buggy as hell, what's wrong???
  // if(process.env.REGISTER_TILLV2 == "true"){
  //     RegisterApplication('tillv2').then(AddPermissions('tillv2', PermissionTypes.All))
  // }
  // TODO: hardcoded values are yucky! do NOT!
  if(process.env.POPULATE == 'true'){
    CreateFWColor("yellow", "r/YellowOnlineUnion", "https://i.imgur.com/WB8mUHl.png", "placeholder_invite", "1038828453136445606", ()=>{})
  }
});


