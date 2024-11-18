import { ROLE } from '../types/enum';
import { db } from './db';
import { hashPassword } from './password';

export const createDefaultAdmin = async () => {
  const admin = await db.user.findUnique({
    where: {
      email: "fif@test.com",
      OR: [
        {
          role_id: {
            equals: 3,
          },
        },
      ],
    },
  });
  if (!admin) {
    // hashed the password with bcrypt
    const password = await hashPassword("test123");
    await db.user.create({
      data: {
        name: 'super-admin',
        email: "fif@test.com",
        phone: '0707070707',
        password,
        role_id: 3,
        role_name: "super administrator"
      },
    });
    console.log('default admin created');
    return;
  }
  return;
};

// export async function createDefaultAdmin() {
//   const adminEmail = "fif@test.com";
//   const existingAdmin = await db.user.findFirst({
//     where: { email: adminEmail , role_id : 3},
//   });

//   if (!existingAdmin) {
//     const password = await hashPassword("test123");
//     await db.user.create({
//       data: {
//         name: 'super-admin',
//         email: "test123",
//         phone: '0707070707',
//         password,
//         role_id: 3,
//         role_name: "super administrator"
//       },
//     });
//     console.log("Admin user created successfully.");
//   } else {
//     console.log("Admin user already exists.");
//   }
// }

/**
 * check if user is a super-admin and administrator
 * @param req Request
 * @return boolean
 */
export const adminAuthorization = (role_id: number) => {
  if (role_id === ROLE.SUPERADMIN || role_id === ROLE.ADMINISTRATOR) {
    return true;
  }
  return false;
};

/**
 * check if user is a super-admin
 * @param req Request
 * @return boolean
 */
export const superAdminAuthorization = async (role_id: number) => {
  if (role_id === ROLE.SUPERADMIN) {
    return true;
  }
  return false;
};
