import jsonwebtoken from "jsonwebtoken";

const SECRET_KEY = String(process.env.SECRET_KEY);

export function generateToken(payload : object ): string{
    return jsonwebtoken.sign(payload,SECRET_KEY)
}

export function verifyToken(token : string) : Object{
    return jsonwebtoken.verify(token,SECRET_KEY);
}