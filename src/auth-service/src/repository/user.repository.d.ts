import { PrismaService } from '../../prisma/prisma.service';
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findUserById(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        isAdmin: boolean;
        email: string;
        password: string;
        counter: number;
    }>;
    findUserByEmail(email: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        isAdmin: boolean;
        email: string;
        password: string;
        counter: number;
    }>;
    updateUser(email: string, password: string): Promise<{
        id: number;
        fullName: string;
        isAdmin: boolean;
    }>;
    createUser(email: string, password: string, fullName: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        isAdmin: boolean;
        email: string;
        password: string;
        counter: number;
    }>;
    deleteUser(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        isAdmin: boolean;
        email: string;
        password: string;
        counter: number;
    }>;
}
