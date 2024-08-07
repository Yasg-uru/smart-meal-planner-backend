import { Schema, model } from "mongoose";

const ShoppingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: {
          type: String,
        },
        quantity: {
          type: String,
        },
        isChecked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
ShoppingSchema.index({ name: "text", "items.name": "text" });

const shoppingmodel = model("Shopping", ShoppingSchema);
export default shoppingmodel;
