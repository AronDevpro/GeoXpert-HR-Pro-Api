import {fetchLocation} from "./location.service.js";


export const getLocation = async (req, res) => {
    try {
        const list = await fetchLocation(req.query);
        res.status(200).json(list);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};