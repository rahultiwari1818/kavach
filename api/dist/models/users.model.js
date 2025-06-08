import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "public"], default: "public" },
    createdAt: { type: Date, default: Date.now },
});
export default model("User", userSchema);
//# sourceMappingURL=users.model.js.map