import { Request } from 'express';

export const getHeaderToken = (req: Request) => {
  const { headers } = req;
  let token;
  if (headers.authorization && headers.authorization.startsWith('Bearer')) {
    token = headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  return token;
};

export const isAuthenticated = (req: Request) => Boolean(getHeaderToken(req));

export const REDIRECT_PROTECTED_PAGES = ['/me', '/my-tours'];
