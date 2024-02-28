export abstract class Key {
  constructor(
    public name: string,
    public key: string,
    public description: string,
    public userId: string,
    public createdAt: number,
    public keyId?: string
  ) {}
}
