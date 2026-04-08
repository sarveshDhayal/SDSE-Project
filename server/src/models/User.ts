export class User {
  private _id: string;
  private _name: string;
  private _email: string;

  constructor(id: string, name: string, email: string) {
    this._id = id;
    this._name = name;
    this._email = email;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (value.length < 2) throw new Error("Name too short");
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (!value.includes("@")) throw new Error("Invalid email");
    this._email = value;
  }
}
