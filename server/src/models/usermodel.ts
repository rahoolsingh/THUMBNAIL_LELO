import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true },
        freeQuota: { type: Number, default: 2 },
        isActive: { type: Boolean, default: true },
        paidQuota: { type: Number, default: 0 },
        purchaseHistory: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
        ],
    },
    { timestamps: true }
);

const PurchaseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        gatewayResponse: { type: Object, required: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Purchase = mongoose.model("Purchase", PurchaseSchema);

export { User, Purchase };
