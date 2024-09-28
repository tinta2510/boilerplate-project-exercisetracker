import mongoose from 'mongoose';
import dotenv from 'dotenv'; dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function() { console.log("Connected to the cluster.")})
    .catch(function(err) { console.error("Cannot connect to the cluster.")});

const exerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: 1
    },
    duration: {
        type: Number,
        required: 1
    },
    date: Date
});

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: 1
    },
    log: [exerciseSchema]
});

userSchema.virtual('count').get(function() {
    return this.log.length;
});

// Ensure virtuals are included when converting to JSON or an Object
userSchema.set('toJSON', { 
    virtuals: true,
    transform: function(doc, ret) {
        // Loop through the log array and format the date
        if (ret.log) {
          ret.log = ret.log.map(logEntry => {
            if (logEntry.date) {
              // Customize the date format (e.g., to "Mon Jan 01 1990")
              logEntry.date = logEntry.date.toDateString(); // You can change this to any format you want
            }
            return logEntry;
          });
        }
        return ret;
    } 
});
userSchema.set('toObject', { 
    virtuals: true,
    transform: function(doc, ret) {
        // Loop through the log array and format the date
        if (ret.log) {
          ret.log = ret.log.map(logEntry => {
            if (logEntry.date) {
              // Customize the date format (e.g., to "Mon Jan 01 1990")
              logEntry.date = logEntry.date.toDateString(); // You can change this to any format you want
            }
            return logEntry;
          });
        }
        return ret;
    } 
});
const User = mongoose.model('User', userSchema);

export function createUser(username_) {
    try {
        return User.create({ username: username_, log: [] });     
    } catch(err) {
        throw(err);
    }
}

export function addExercise(id_ , description_, duration_, date_) {
    try {
        return User.findByIdAndUpdate( id_, 
            {$push: {
                log: {
                    description: description_,
                    duration: duration_,
                    date: date_
                }
            }}
        )
    } catch(err) {
        throw err;
    }
}

export function getAllUsers() {
    return User.find();
}

export function getUserById(id) {
    return User.findById(id);
}
