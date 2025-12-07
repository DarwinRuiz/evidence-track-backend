import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const passwordSecurity = {
    async hashPassword(plainPassword: string): Promise<string> {
        return bcrypt.hash(plainPassword, SALT_ROUNDS);
    },

    async comparePassword(
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    },
};
