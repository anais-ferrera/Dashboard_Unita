#!/bin/bash
mongoimport -d database_unita -c coord_map coord_map.json
mongoimport -d database_unita --jsonArray -c data_map data_map.json 
mongoimport -d database_unita -c data_thematic_sunburst data_thematic_sunburst.json 
mongoimport -d database_unita -c data_univ_sunburst data_sun_univ.json  
mongoimport -d database_unita -c data_table_courses --jsonArray data_table_courses.json