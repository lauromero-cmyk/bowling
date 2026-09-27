import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next)=> {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: 'token no proporcionado'
        });
    }

    try {
        const decoded = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'token invalido'
        });
    }        
};