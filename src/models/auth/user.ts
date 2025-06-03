export class User {
  declare id?: string;
  declare name?: string;
  declare email?: string;
  declare identificationNumber?: number;
  declare private _token: string;
  declare private _tokenExpirationDate: Date;

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
}
