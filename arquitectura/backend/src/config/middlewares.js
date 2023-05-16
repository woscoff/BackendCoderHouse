export const checkSessionRole = (role) => {
    return (req, res, next) => {
        if (!req.session.login) {
            return res.status(401).send("No active session.");
        }
        if (req.session.user.role !== role) {
            return res.status(401).send("Access denied.");
        }
        next();
    };
}
export const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.login) {
            if (req.session.user.role !== role) {
                return res.status(401).send(`Action not allowed to ${req.session.user.role}`)
            }
            next()

        } else {
            return res.status(401).send(`No active session found`)
        }
    }
}
export const isSessionActive = async (req, res, next) => {
    try {
        if (req.session.login) {
            return next()
        } else {
            return res.status(401).send('No active session')
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error: error.message
        })
    }
}