export class Category {
  private _id: string;
  private _name: string;
  private _userId: string;

  constructor(id: string, name: string, userId: string) {
    this._id = id;
    this._name = name;
    this._userId = userId;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get userId(): string { return this._userId; }
}
