/*import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import participationData from '../../data/participation.json';

const SalarieId = ({ projects }) => {
    const router = useRouter();
    const { salarieId } = router.query;
    const [userProjects, setUserProjects] = useState([]);

    useEffect(() => {
        if (Array.isArray(projects)) {
            setUserProjects(projects);
        }
    }, [projects]);


    const renderProjects = () => {
        if (userProjects.length === 0) {
            return <p>No projects found for this salarie.</p>;
        }

        return (
            <ul>
                {userProjects.map(project => (
                    <li key={project.project_id}>
                        <Link href={`/projects/${project.project_id}`}>
                            {project.project_id}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <h1>Espace personnel</h1>
            <h2>Ajout d'un projet </h2>

            <h2>Mes Projets</h2>
            {renderProjects()}
        </div>
    );
};

export async function getServerSideProps({ params }) {
    const salarieId = params.salarieId;
    // Filter participation data to get projects associated with the salarieId
    const projects = participationData.participation
        .filter(participation => participation.salarie_id === salarieId)
        .map(participation => {
            return {
                project_id: participation.project_id,
                // You can include additional project details here if needed
            };
        });

    return {
        props: {
            projects: projects
        }
    };
}

export default SalarieId;*/

// pages/add-project.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddProject() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const managerName = router.query.userName;
    //console.log(managerName);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description,managerName}),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/projects/${data.project.id}`);
            } else {
                setError('Error adding project');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            setError('An error occurred while adding project');
        }
    };

    return (
        <div>
            <h1>Add Project</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Manager:</label>
                    <input
                        type="text"
                        value={managerName}
                        disabled
                    />
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
}
