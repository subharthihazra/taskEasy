import { model, Schema } from "mongoose";
import { TokenModel } from "types/token";

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const tokenModel = model<TokenModel>('Token', tokenSchema);

export default tokenModel;