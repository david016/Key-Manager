import { Key } from "../models/key";

export class ApiKey extends Key {
  constructor(
    public name: string,
    public key: string,
    public description: string,
    public userId: string,
    public createdAt: number,
    public keyId?: string
  ) {
    super(name, key, description, userId, createdAt, keyId);
  }
}
