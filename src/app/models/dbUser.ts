export class DbUser {
  constructor(
    public uId: string,
    public email: string,
    public username?: string,
    public name?: string,
    public surname?: string,
    public age?: number,
    public address?: string,
    public city?: string,
    public country?: string,
    public postalCode?: string,
    public aboutMe?: string
  ) {}
}
