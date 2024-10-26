import { PrismaService } from '../../prisma/prisma.service';
export declare class ActivateRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        activationLink: string;
        activationCode: string;
        isActivated: boolean;
        userId: number;
    }>;
    updateActivate(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        activationLink: string;
        activationCode: string;
        isActivated: boolean;
        userId: number;
    }>;
    create(activationLink: string, activationCode: string, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        activationLink: string;
        activationCode: string;
        isActivated: boolean;
        userId: number;
    }>;
    deleteById(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        activationLink: string;
        activationCode: string;
        isActivated: boolean;
        userId: number;
    }>;
}
