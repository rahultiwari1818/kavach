import jsonwebtoken from "jsonwebtoken";
import userToken from "../interfaces/userToken.interface.js";

const SECRET_KEY = String(process.env.SECRET_KEY);



export function generateToken(payload : userToken ): string{
    return jsonwebtoken.sign(payload,SECRET_KEY)
}



export function verifyToken(token : string) : userToken  {
    return  jsonwebtoken.verify(token,SECRET_KEY) as userToken;
}