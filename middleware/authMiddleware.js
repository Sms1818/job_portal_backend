import jwt from "jsonwebtoken";
const authenticateToken=(req,res,next)=>{
    const authHeader=req.header('Authorization');
    const token=authHeader && authHeader.startsWith('Bearer ')?authHeader.split(' ')[1]:null;
    if(!token){
        return res.status(401).json({message:'Access denied. No token provided.'});
    }

    try{
        const decoded=jwt.verify(token, process.env.SECRET_KEY);
        req.user=decoded;
        next();

    }catch(error){
        return res.status(401).json({message:'Invalid Token'});
    }


}

export default authenticateToken