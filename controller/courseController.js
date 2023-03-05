import Course from '../model/course.js';

export const createCourse = async (req, res) => {
    const course = new Course({
        module: req.body.module,
        title: req.body.title,
        grade: req.body.grade,
        //icon: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
        //image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
        estimatedTime: req.body.estimatedTime,
        games: req.body.games,
    })
    course.save()
        .then(() => {
            res.status(201).json({
                course: course,
            });
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        })
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
}

export const getUserCourses = async (req, res) => {
    try {
        const userGrade = req.user.grade;
        console.log("grade: "+userGrade);
        const courses = await Course.find({grade: userGrade});
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
}