import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";


export async function jwtCallback({
  token,
  user,
}: {
  token: JWT;
  user?: User;
}): Promise<JWT> {
  if (user) {
    return {
      ...token,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      tokenExpiration: user.tokenExpiration,
      isFirstTimeLogin: user.isFirstTimeLogin,
    };
  }

  // Return existing token
  return token;
}



export async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}): Promise<Session> {
  // Populate session with user data
  return {
    ...session,
    user: {
      id: token.id,
      email: token.email,
      fullName: token.fullName,
      phoneNumber: token.phoneNumber,
      role: token.role,
      permissions: token.permissions,
      isActive: token.isActive,
    },
    isFirstTimeLogin: token.isFirstTimeLogin,
    accessToken: token.accessToken,
  };
}
