import { jwtVerify, SignJWT } from 'jose';

export const createFakeToken = async (user) => {
  const secret = new TextEncoder().encode('my_fake_secret');
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .setPayload({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    .sign(secret);

  return token;
};

export const decodeFakeToken = async (token) => {
  const secret = new TextEncoder().encode('my_fake_secret');

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error('token is expired:', err);
    return null;
  }
};
