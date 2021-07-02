# Dashboard_Unita - Local installation guide

__Clone the directory:__

* Either in a command prompt  
git clone https://github.com/anais-ferrera/Dashboard_Unita.git
* Either download ZIP 

__Download Node JS :__  LTS https://nodejs.org/en/download/  
-- Follow the step of installation  

__Download MongoDB :__ 
https://www.mongodb.com/try/download/community  
-- Follow the step of installation  

__Download MongoDB Tools :__
https://www.mongodb.com/try/download/database-tools?tck=docs_databasetools  
-- Follow the step of installation  

__Once MongoDB is installed :__

* Go to "Modify the system environment variables" 

* Go to “Environment variables” then select “Path” and “Modify” (“Modifier”)   
                
* Click on “Browse” (“Parcourir”) and select folder “bin” in MongoDB Server and do the same with Tools then click “OK”
 

You can open a command prompt and check if everything is well installed with :
mongod --version
node --version


__Build the ReplicaSet__

On your C drive create a data folder 

In this data folder create 4 folders: arb, R0S1, R0S2, R0S3

Once this is done open a 1st command prompt :
Go to C   
And copy this line :  
  mongod --replSet rs0 --port 27018 --dbpath /data/R0S1  


In a 2nd command prompt :
Go to C   
And copy this line :  
mongod --replSet rs0 --port 27019 --dbpath /data/R0S2  
In a 3rd one :
Go to C   
And copy this line :  
mongod --replSet rs0 --port 27020 --dbpath /data/R0S3

In a new command prompt :  
Type : mongo --port 27018

Then : rs.initiate()  

You can check the configuration of the ReplicaSet with : rs.conf()  
Then add the other localhost : 27019 and 27020 with :  
rs.add(“localhost:27019”)   
rs.add(“localhost:27020”)  

Define the arbiter :  
In a new command prompt :  
Go to C and enter this line :  
mongod --port 30000 --dbpath /data/arb --replSet rs0  


Now we can check which server is the Primary. It will be on this server that we will create the database.  
To know which one is Primary you can go back to the command prompt mongo --port 27018 and enter rs.status().  

In the members section you can see the state of the server (primary or secondary).  
 
Now we can create the database :  
In a new command prompt :  
mongo --port <primary>  

use database_unita  

Then Ctrl+c and type :  
mongoimport --port  [primary] -d unita -c coord_map --jsonArray [your_path]/coord_map.json  
mongoimport --port [primary] -d unita --jsonArray -c data_map [your_path]/data_map.json  
mongoimport --port  [primary] -d unita -c data_thematic_sunburst [your_path]/data_thematic_sunburst.json  
mongoimport --port  [primary] -d unita -c data_univ_sunburst [your_path]/data_sun_univ.json  
mongoimport --port  [primary] -d unita -c data_table_courses  --jsonArray [your_path]/data_table_courses.json  

In a command prompt :   

cd  Dashboard_Unita-master  

npm install  
node index.js   

In your browser go to localhost:8080  
