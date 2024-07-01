import { Image } from "./image"
import { Project } from "./project"
import { ProjectWithTech } from "./projectWithTech"
import { Technology } from "./technology"

export interface ProjectDto extends ProjectWithTech{
    images:Image[]
}