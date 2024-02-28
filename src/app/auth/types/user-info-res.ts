interface ProviderUserInfo {
  email: string;
  federatedId: string;
  providerId: string;
  rawId: string;
}

interface User {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  lastLoginAt: string;
  lastRefreshAt: string;
  localId: string;
  passwordHash: string;
  passwordUpdatedAt: number;
  providerUserInfo: ProviderUserInfo[];
}

export interface UserInfoResponse {
  kind: "identitytoolkit#GetAccountInfoResponse";
  users: User[];
}
