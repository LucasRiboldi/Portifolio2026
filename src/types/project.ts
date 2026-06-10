export interface Project {
  id: string;

  title: string;

  slug: string;

  description: string;

  image: string;

  technologies: string[];

  githubUrl?: string;

  demoUrl?: string;

  featured: boolean;

  createdAt: string;
}
