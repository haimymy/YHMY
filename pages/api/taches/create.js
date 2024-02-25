import { PrismaClient } from '@prisma/client';
import { getSession } from "@lib/session";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    console.log(req);
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskName, taskDescription, selectedUserId, selectedEffort, projectId } = req.body;

    // Ensure to await getSession to get the user's session
    const session = await getSession(req);
    const authorName = session.user.name;

    try {
        const task = await prisma.task.create({
            data: {
                title: taskName,
                description: taskDescription,
                authorName,
                effort: selectedEffort,
                projectId,
                // Assuming assignees need to be specified
                assignees: {
                    connect: [{ userName: selectedUserId }] // Assuming assignees is an array of user names
                }
            },
        });

        return res.status(201).json({ message: 'Tâche added successfully', task });
    } catch (error) {
        console.error('Error adding task:', error);
        return res.status(500).json({ error: 'An error occurred while adding task' });
    }
}
