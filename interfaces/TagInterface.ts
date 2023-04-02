import {TagType} from "./TagTypeInterface"

export interface Tag {
  id: string;
  title: string;
  imgTitle?: string;
  tagType?: TagType;
  sections?: string[];
}
