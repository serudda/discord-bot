import type { PrismaClient } from '@prisma/client';

export type Ctx = {
  prisma: PrismaClient;
};

export type Params<T> = {
  ctx: Ctx;
  input: T;
};
