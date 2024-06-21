import { Schema } from "mongoose";

const ShoppingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      Name: {
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
});
const shoppingmodel = model("Shopping", ShoppingSchema);
export default shoppingmodel;
