import { jwtVerify, SignJWT } from 'jose';

export const createFakeToken = async (data) => {
  const secret = new TextEncoder().encode('my_fake_secret');
  const alg = 'HS256';
  console.log(data.user.role)
  const token = await new SignJWT({
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
  return token;
};

export const decodeFakeToken = async (token) => {
  const secret = new TextEncoder().encode('my_fake_secret');

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
};
