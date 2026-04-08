export class User {
  private _id: string;
  private _name: string | null;
  private _email: string;
  private _googleId: string | null;

  constructor(id: string, name: string | null, email: string, googleId: string | null = null) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._googleId = googleId;
  }

  get id(): string {
    return this._id;
  }

  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    if (value && value.length < 2) throw new Error("Name too short");
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (!value.includes("@")) throw new Error("Invalid email");
    this._email = value;
  }

  get googleId(): string | null {
    return this._googleId;
  }

  set googleId(value: string | null) {
    this._googleId = value;
  }
}
