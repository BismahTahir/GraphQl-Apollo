
import { users, quotes_ } from "./db.js";
import {randomBytes} from 'crypto';
const resolvers = {
  Query: {
    greet: () => {
      return "hello bisma";
    },
    users: () => {
      return users;
    },
    quotes: () => {
      return quotes_;
    },
    user: (parent, args) => {
      return users.find((us) => us.id == args.id);
    },
    singleQuote: (parent, { by }) => {
      return quotes_.filter((quo) => quo.by == by);
    },
  },
  user: {
    quotes: (user) => {
      console.log(user.id);
      return quotes_.filter((quote) => quote.by == user.id);
    },
  },
  Mutation: {
    signUpUser: (parent,{name,address}) => {
        const id = randomBytes(5).toString("hex");
        users.push({id,name,address});
        return users.find(user=>user.id===id)
    },
  },
};

export default resolvers;
