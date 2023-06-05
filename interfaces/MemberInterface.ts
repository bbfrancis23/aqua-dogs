import { getMember } from '../mongo/controllers/memberControllers';
import { Tag } from './TagInterface';

export interface Member {
  email: string;
  name?: string;
  roles?: string[];
  id: string;
  tags: Tag[];
}

export const getValidMember = async (
  authSession: any
): Promise<Member | false> => {
  if (!authSession) {
    return false;
  }

  if (authSession.user && authSession.user.email) {
    const result = await getMember(authSession.user.email);

    if (result.member) {
      const member: Member = result.member;
      return result.member;
    }
  }

  return false;
};
