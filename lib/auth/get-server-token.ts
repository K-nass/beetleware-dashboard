import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";


export async function getServerAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return null;
  }

  return session.accessToken;
}
