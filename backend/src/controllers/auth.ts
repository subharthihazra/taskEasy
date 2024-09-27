import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import userModel from "../models/users";
import tokenModel from "../models/tokens";
import { CustomError } from "../errorhandlers/CustomError";
import User from "../types/user";
import { JWT_SECRET_KEY, REFRESH_TOKEN_SECRET } from "../config/env";
import { DataStoredInToken, TokenData } from "../types/token";

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      return next(new CustomError(400, "Already signed in"));
    }
    let { email, password }: { email: string; password: string } = req.body;
    if (!(email && password)) {
      return next(new CustomError(400, "Not enough data provided"));
    }
    const foundUser = await userModel.validateUserCredentials(email, password);
    if (!foundUser) {
      return next(new CustomError(401, "Invalid email or password"));
    }
    const tokenData = createToken(foundUser);
    const accessTokenCookie = createCookie(tokenData);

    const refreshTokenData = createRefreshToken(foundUser);
    const refreshTokenCookie = createCookie(refreshTokenData);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await tokenModel.create({
      userId: foundUser._id,
      token: refreshTokenData.token,
      expiresAt,
    });

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    res
      .status(201)
      .json({ success: true, data: foundUser, message: "loggedin" });
  } catch (err) {
    next(err);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      return next(new CustomError(400, "Already signed in"));
    }
    const {
      email,
      password,
      name,
    }: { email: string; password: string; name: string } = req.body;
    if (!(email && password && name)) {
      return next(new CustomError(400, "Not enough data provided"));
    }

    console.log("New User:", email);
    try {
      const createdUser: User = await userModel.create({
        email,
        password,
        name,
      });
      res.status(201).json({
        success: true,
        email: createdUser.email,
        name: createdUser.name,
      });
    } catch (err: any) {
      console.log("ERROR: ", err.code, err.name);
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new CustomError(400, "Email is already used"));
      } else {
        return next(new CustomError(400, err.message));
      }
    }
  } catch (err) {
    next(err);
  }
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .status(201)
      .json({ success: true, data: req.user, message: "authorized" });
  } catch (err) {
    next(err);
  }
}

function createToken(user: User | DataStoredInToken): TokenData {
  // console.log(user);
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
    email: user.email,
  };
  const secretKey: string = String(JWT_SECRET_KEY);
  const expiresIn: number = 14 * 24 * 60 * 60;

  return {
    expiresIn,
    name: "Authorization",
    token: sign(dataStoredInToken, secretKey, { expiresIn }),
  };
}

function createRefreshToken(user: User | DataStoredInToken): TokenData {
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
    email: user.email,
  };

  const secretKey: string = String(REFRESH_TOKEN_SECRET);
  const expiresIn: number = 7 * 24 * 60 * 60 * 1000;

  return {
    expiresIn,
    name: "refreshToken",
    token: sign(dataStoredInToken, secretKey, {
      expiresIn,
    }),
  };
}

function createCookie(tokenData: TokenData): string {
  return `${tokenData.name}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=None;  Secure`;
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: User = req.user;
    if (!userData) {
      return next(new CustomError(400, "userData is empty"));
    }
    if (!(userData._id && userData.email)) {
      return next(new CustomError(400, "userData is empty"));
    }

    const foundUser = await userModel.findOne(
      {
        _id: userData._id,
        email: userData.email,
      },
      {
        _id: 1,
        email: 1,
      }
    );
    if (!foundUser) {
      throw new CustomError(409, `This email ${userData.email} was not found`);
    }

    res.setHeader("Set-Cookie", [
      "Authorization=; Max-age=0",
      "refreshToken=; Max-age=0",
    ]);
    res
      .status(200)
      .json({ success: true, data: foundUser, message: "loggedout" });
  } catch (error) {
    next(error);
  }
}

export async function verifyUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      req.header("Authorization")?.split("Bearer ")[1];

    if (!Authorization) {
      return next(new CustomError(404, "Authentication token missing"));
    }
    const secretKey: string = String(JWT_SECRET_KEY);
    const verificationResponse = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken;
    if (
      !(verificationResponse._id?.trim() && verificationResponse.email?.trim())
    ) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    const foundUser = await userModel.findOne(
      {
        _id: verificationResponse._id,
        email: verificationResponse.email,
      },
      {
        _id: 1,
        email: 1,
        name: 1,
      }
    );

    if (!foundUser) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    req.user = foundUser;
    next();
  } catch (error) {
    next(new CustomError(401, "Wrong authentication token"));
  }
}

export async function isUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      req.header("Authorization")?.split("Bearer ")[1];

    if (!Authorization) {
      return next();
    }
    const secretKey: string = String(JWT_SECRET_KEY);
    const verificationResponse = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken;
    if (
      !(verificationResponse._id?.trim() && verificationResponse.email?.trim())
    ) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    const foundUser = await userModel.findOne(
      {
        _id: verificationResponse._id,
        email: verificationResponse.email,
      },
      {
        _id: 1,
        email: 1,
        name: 1,
      }
    );

    if (!foundUser) {
      return next(new CustomError(401, "Wrong authentication token"));
    }
    req.user = foundUser;
    next();
  } catch (error) {
    next(new CustomError(401, "Wrong authentication token"));
  }
}

export async function getNewToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken =
      req.cookies["refreshToken"] ||
      req.header("refreshToken")?.split("Bearer ")[1];

    if (!refreshToken) {
      return next();
    }

    const secretKey: string = String(REFRESH_TOKEN_SECRET);
    const foundUser = (await verify(
      refreshToken,
      secretKey
    )) as DataStoredInToken;

    const tokenDoc = await tokenModel.findOne({ token: refreshToken });

    if (!tokenDoc) {
      throw new Error("Invalid refresh token");
    }

    const tokenData = createToken(foundUser);
    const accessTokenCookie = createCookie(tokenData);

    res.setHeader("Set-Cookie", [accessTokenCookie]);
    res
      .status(201)
      .json({ success: true, data: foundUser, message: "new token stored" });
  } catch (error) {
    next(new CustomError(401, "Wrong refesh token"));
  }
}
