import { createUser as _createUser, 
        addExercise as _addExercise,
        getAllUsers,
        getUserById  } from "./model.js";

export async function createUser(req, res) {
    try {
        const user = await _createUser(req.body.username);
        res.json({
            username: user.username,
            _id: user._id
        })
        console.log("Add user successfully");
        return user;
    } catch(err) {
        console.error("Cannot add user: ", err);
    }
}    


export async function addExercise(req, res) {
    const date = (req.body.date)? new Date(req.body.date) : new Date(Date.now());
    try {
        const user = await _addExercise(req.params._id, req.body.description,
                                        req.body.duration, date);
        res.json({
            _id: user._id,
            username: user.username,
            date: date.toDateString(),
            duration: parseInt(req.body.duration, 10), 
            description: req.body.description,
        })   
        console.log("Add exercise successfully");
        return user;
    } catch (err) {
        console.error("Cannot add exercise: ", err);
    }
}

export async function getLog(req, res) {
    try {
        const users = await getAllUsers();
        console.log('Find all users successfully.');
        res.json(users);
    } catch (err) {
        console.error('Cannot find all users: ', err);
    }   
}

export async function getUserLog(req, res) {
    if (Object.keys(req.query).length === 0) {
        try {
            const user = await getUserById(req.params._id);
            res.json(user);
            console.log("Get user's log successfully");
        } catch(err) {
            console.error("Cannot get user's log:", err);
        }
    }
    else {
        const from_ = (req.query.from)?new Date(req.query.from) : null;
        const to_ = (req.query.to)?new Date(req.query.to) : null;
        const limit_ = req.query.limit;
        try {
            const user = await getUserById(req.params._id);
            let filterdLogs = user.log;
            if (from_ || to_){
                filterdLogs = filterdLogs.filter(function(log) {
                    if (from_ && to_)
                        return log.date >= from_ && log.date <= to_;
                    else if (from_) 
                        return log.date >= from_;
                    else if (to_)
                        return log.date <= to_;
                })
            }
            if (limit_) {
                filterdLogs.splice(limit_);
            }
            res.json({
                _id: user._id,
                username: user.username,
                ...(from_ && {from: from_.toDateString()}),
                ...(to_ && {to: to_.toDateString()}),
                count: filterdLogs.length,
                log: filterdLogs
            });
            console.log("Get user's log successfully");
        } catch(err) {
            console.error("Cannot get user's log:", err);
        }
    }
    
}
