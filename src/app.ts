import * as mongoose from "mongoose";
import { arrayProp, prop, Typegoose } from "typegoose";

async function Connect(): Promise<void> {
  return new Promise<void>((res, rej) => {
    mongoose.connect("mongodb://localhost:27017/test", {});
    mongoose.connection.on("error", (err) => {
      return rej(err);
    });
    mongoose.connection.once("open", () => {
      return res();
    });
  });
}

class EmailAddress {
  @prop()
  public email?: string;
}

// ===========================================================
// Main bug here.
// Line 29 works fine
// Lines 27 and 28 do not work
// ===========================================================
class Profile {
  @arrayProp({ default: () => [], items: EmailAddress })
  // @arrayProp({ items: EmailAddress, required: true })
  // @arrayProp({ items: EmailAddress})
  public emailAddresses?: EmailAddress[];
}

class Person extends Typegoose {
  @prop()
  public profile?: Profile
}

const PersonModel = new Person().getModelForClass(Person);

async function Test() {
  const p = new PersonModel();
  p.profile = { emailAddresses: [{ email: "test@example.com" }] };
  await p.save();
  const p2 = await PersonModel.findOne();
  console.log(p2);
}

Connect();
Test();
