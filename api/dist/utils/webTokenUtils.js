import jsonwebtoken from "jsonwebtoken";
const SECRET_KEY = String(process.env.SECRET_KEY);
export function generateToken(payload) {
    return jsonwebtoken.sign(payload, SECRET_KEY);
}
export function verifyToken(token) {
    return jsonwebtoken.verify(token, SECRET_KEY);
}
//# sourceMappingURL=webTokenUtils.js.map