import { Captain, PrismaClient, User } from '@prisma/client'

declare global {
    namespace Express {
        interface Request {
            prisma: PrismaClient
            user?: User;
            captain?: Captain
        }
    }
}
