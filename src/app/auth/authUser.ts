export class AuthUser {
  constructor(
    public localId: string,
    private email: string,
    private idToken: string,
    private refreshToken?: string,
    private expiresIn?: string
  ) {}
}
