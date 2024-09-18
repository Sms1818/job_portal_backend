import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (!process.env.SECRET_KEY) {
        return res.status(500).json({ message: 'Missing secret key.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name==='TokenExpiredError'){
            return res.status(401).json({ message: 'Token has expired. Please Log In Again.' });
        }
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

const checkRole = (role) => {
    return (req, res, next) => {
        try {
            if (req.user.role !== role) {
                return res.status(403).json({ message: 'Access denied. Insufficient Permissions' });
            }
            next(); 
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

export { authenticateToken, checkRole };
