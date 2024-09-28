import express from 'express'; const app = express()
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current file
const __dirname = dirname(__filename);


import { createUser, addExercise, getLog, getUserLog } from "./controller.js"

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', createUser);
app.post('/api/users/:_id/exercises', addExercise);
app.get('/api/users', getLog);
app.get('/api/users/:_id/logs', getUserLog)


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
