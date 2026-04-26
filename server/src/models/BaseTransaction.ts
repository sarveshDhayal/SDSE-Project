export abstract class BaseTransaction {
  private _id: string;
  private _amount: number;
  private _date: Date;
  private _description: string;
  private _categoryId: string;
  private _userId: string;

  constructor(id: string, amount: number, date: Date, description: string, categoryId: string, userId: string) {
    this._id = id;
    this._amount = amount;
    this._date = date;
    this._description = description;
    this._categoryId = categoryId;
    this._userId = userId;
  }

  get id(): string { return this._id; }
  
  get amount(): number { return this._amount; }
  set amount(value: number) {
    if (value < 0) throw new Error("Amount must be positive");
    this._amount = value;
  }

  get date(): Date { return this._date; }
  set date(value: Date) { this._date = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get categoryId(): string { return this._categoryId; }
  get userId(): string { return this._userId; }

  abstract getType(): string;

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      date: this.date,
      description: this.description,
      category: this.categoryId,
      userId: this.userId,
      type: this.getType()
    };
  }
}
