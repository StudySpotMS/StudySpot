//See server readme for endpoint documentation
const express = require("express");
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5432;
const {Pool} = require('pg')
const axios = require('axios')

const pool = new Pool({
    user: "kiyeotntjhtpfw",
    host: "ec2-34-202-127-5.compute-1.amazonaws.com",
    database: "d6h3vnqcknj7pb",
    password: "447b8c3b79b1f866e436495cafcc983b50bd0b76ba695eca6c851c4243d0ea99",
    port: `${PORT}`,
    ssl: {
        rejectUnauthorized: false
      }
})

//Set appropriate time zone, make all classes available, then make classrooms with classes in session unavailable
pool.query(
    `SET time zone 'America/Montreal';

    UPDATE building_room SET curr_availability = 2;
    
    UPDATE building_room SET curr_availability = 0
        WHERE building_room_id IN 
        (SELECT course.building_room_id FROM course_meeting course 
            WHERE array_to_string(course.days, ',') LIKE '%' || TRIM(INITCAP(to_char(now(), 'day'))) || '%' AND
            TO_TIMESTAMP(to_char(now(), 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN TO_TIMESTAMP(course.start_time, 'HH24:MI:SS') AND 
            TO_TIMESTAMP(course.end_time, 'HH24:MI:SS'))'`);
/*
//Make classrooms without classes in session as available
pool.query(
    `UPDATE building_room SET curr_availability = 2`);

//Make classrooms with classes in session as unavailable
pool.query(
    `UPDATE building_room SET curr_availability = 0
    WHERE building_room_id IN 
    (SELECT course.building_room_id FROM course_meeting course 
        WHERE array_to_string(course.days, ',') LIKE '%' || TRIM(INITCAP(to_char(now(), 'day'))) || '%' AND
        TO_TIMESTAMP(to_char(now(), 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN TO_TIMESTAMP(course.start_time, 'HH24:MI:SS') AND 
        TO_TIMESTAMP(course.end_time, 'HH24:MI:SS'))`);
*/