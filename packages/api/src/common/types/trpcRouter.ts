import type { configService } from '../../services/configService';
import { type PrismaClient } from '@prisma/client';

export interface Ctx {
  prisma: PrismaClient;
  configService: typeof configService;
}

export interface Params<T> {
  ctx: Ctx;
  input: T;
}
