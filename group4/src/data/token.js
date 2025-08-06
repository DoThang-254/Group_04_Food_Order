import { jwtVerify, SignJWT } from 'jose';

export const createFakeToken = async (data) => {
  const secret = new TextEncoder().encode('my_fake_secret');
  const alg = 'HS256';
  const user = data.user
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    phone: user.phone,
    gender: user.gender,
    birthDate: user.birthDate,
    address: user.address
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
