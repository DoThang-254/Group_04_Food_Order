import { SignJWT } from 'jose';

export const createFakeToken = async (user) => {
  const secret = new TextEncoder().encode('my_fake_secret'); 
  const alg = 'HS256';

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return token;
};
