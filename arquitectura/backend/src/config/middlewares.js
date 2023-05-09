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