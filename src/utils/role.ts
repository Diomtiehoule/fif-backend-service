import {db} from "./db";

export const createDefaultRole = async () => {
  const roles = await db.role.findMany();
  if (!roles.length) {
    const role = await db.role.createMany({
      data: [
        { title: 'USER', description: 'Normal user' },
        { title: 'ADMIN', description: 'Administrator' },
        { title: 'SUPER-ADMIN', description: 'Super Admin' },
      ],
    });
    console.log("list role created")
    return role.count;
  }
  return;
};

export const createDefaultType = async () => {
  const types = await db.type.findMany();
  if (!types.length) {
    const type = await db.type.createMany({
      data: [
        { name: 'Private', content: 'type private' },
        { name: 'Public', content: 'type public' },
        { name: 'Mixt', content: 'private and public (both)' },
      ],
    });
    console.log("types list created")
    return type.count;
  }
  return;
};
