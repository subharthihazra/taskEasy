interface User extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export default User;
