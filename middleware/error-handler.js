export function notFoundError(req, res, next) {
    res.status(404).json("Not Found")
}