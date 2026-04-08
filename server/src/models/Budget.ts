export class Budget {
  private _id: string;
  private _amount: number;
  private _categoryId: string;
  private _userId: string;
  private _period: string; // e.g., "MONTHLY"

  constructor(id: string, amount: number, categoryId: string, userId: string, period: string) {
    this._id = id;
    this._amount = amount;
    this._categoryId = categoryId;
    this._userId = userId;
    this._period = period;
  }

  get id(): string { return this._id; }
  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }
  get categoryId(): string { return this._categoryId; }
  get userId(): string { return this._userId; }
  get period(): string { return this._period; }
}
