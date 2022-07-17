import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://stanley-metray:y16kZD2ylVZkvnNZ@cluster0.hsuir.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("Connected...");
}).catch((err) => {
    console.log(err);
});


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    confirmPassword: {
        type: String
    },
    courses: [{
        courseName: { type: String },
        courseDuration: { type: String },
        coursePrice: { type: String },
        purchasedDate: { type: Date, default: Date.now() }

    }],
    date: {
        type: Date,
        default: Date.now()
    }
});

const UserModel = new mongoose.model("user", UserSchema);


const verifyUser = async (email) => {
    try {
        let result = await UserModel.find({ email: email });
        if (result.length == 0)
            return false;
        else
            return true;
    } catch (error) {
        return error;
    }
}

const verifyEmailAndPassword = async (email, password) => {
    try {
        let result = await UserModel.find({ email: email });

        if (result.length == 0)
            return false;
        else {
            if (result[0].password == password)
                return result[0].firstName
            else
                return false;
        };
    } catch (error) {
        return error;
    }
}

const checkCourse = async (email, course) => {
    let flag = false;
    try {
        let result = await UserModel.find({ email: email });
        result[0].courses.forEach((element) => {
            if (element.courseName == course) {
                flag = true;
            }
        });
    } catch (error) {
        return error;
    }

    return flag;
}


const getUser = async (email)=>{
    try {
        const result = await UserModel.findOne({email : email});
        return result;
    } catch (error) {
        return error;
    }
}

export { UserModel, verifyUser, verifyEmailAndPassword, checkCourse, getUser };