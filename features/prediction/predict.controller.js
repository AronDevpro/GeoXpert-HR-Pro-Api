import {predictPromotion, predictTurnover} from "./predict.service.js";

export const getTurnOver = async (req, res) => {
    try {
        const id = req.params.id;
        const turnover = await predictTurnover(id);
        res.status(200).json(turnover);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const Performance = await predictPromotion(id);
        res.status(200).json(Performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};