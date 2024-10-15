import { type PrismaClient } from '@prisma/client';

export interface Ctx {
  prisma: PrismaClient;
}

export interface Params<T> {
  ctx: Ctx;
  input: T;
}
