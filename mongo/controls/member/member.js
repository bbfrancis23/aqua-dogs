export const basicMemberFields = async (member) => {
  // console.log('member', member);

  member = await member.toObject({ getters: true });

  member = {
    id: member.id,
    email: member.email,
    name: member.name ? member.name : '',
  };

  return member;
};
