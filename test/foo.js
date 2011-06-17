var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var sys = require('sys');

var client = new Db('test', new Server("127.0.0.1", 27017, {}));

client.open(function(err, db) { 
  if (err) { console.log("Error opening: " + err); return; } 

  db.collection("mingo_test", function(err, collection) { 
    if (err) { console.log("Error accessing collection: " + err); return; } 

    collection.find({}, function(err, cursor) { 
      console.log("in find callback...") 
      if (err) { console.log("Error in find: " + err); return;} 

        cursor.each(function(err, item) { 
          if (err) { console.log("Error in cursor.each: " + err); 
          return;} // ERROR HERE 
          if (!item) { 
            console.log("All done"); 
            db.close(); 
          } else { 
            console.log(sys.inspect(item)); 
          } 
        }); 
      }); 
    }); 
});