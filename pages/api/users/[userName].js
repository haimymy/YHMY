// api/[userName].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { userName } = req.query;

    try {
        // Fetch user projects based on the provided userName
        const user = await prisma.user.findUnique({
            where: {
                name: userName,
            },
            include: {
                projects: {
                    where: {
                        OR: [
                            { managerName: userName },
                            { tasks: { some: { assignees: { some: { userName: userName } } } } }
                        ]
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ projects: user.projects });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return res.status(500).json({ error: 'An error occurred while fetching user projects' });
    }
}
