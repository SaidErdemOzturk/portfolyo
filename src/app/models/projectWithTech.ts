import { Image } from "./image"
import { Project } from "./project"
import { Technology } from "./technology"

export interface ProjectWithTech extends Project{
    technologies:Technology[]
}