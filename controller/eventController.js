import Event from "../model/event.js";

export const createEvent = async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        description: req.body.description,
        isDone: req.body.isDone,
        type: req.body.type,
        eventImage: req.body.eventImage,
        location: req.body.location,
        requirementsDescription: req.body.requirementsDescription,
    });
    event.save()
        .then(() => {
            res.status(201).json({
                event: event,
            });
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        });
}


export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
}

export const registerEvent = async (req, res) => {
    const { eventId } = req.body;
  
    try {
      const user = req.user;
      const event = await Event.findById(eventId);
  
      if (user.events.some(userEvent => userEvent._id.toString() === eventId)) {
        user.events.pull(event);
        await user.save();
        console.log('Event removed');
        res.status(200).json({ message: 'Event removed' });
      } else {
        user.events.push(event);
        await user.save();
        console.log('Event added');
        res.status(200).json({ message: 'Event added' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

//get user events
export const getUserEvents = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        if (user) {
            res.status(200).json(user.events);
        } else {
            res.status(404).json({error: "User not found"});

        }
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}
