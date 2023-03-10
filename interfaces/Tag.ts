import { TagType } from './TagType';

export interface Tag {
  id: string;
  title: string;
  imgTitle?: string;
  tagType?: TagType;
  sections?: string[];
}
