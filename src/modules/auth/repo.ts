import { db } from "@/lib/db";
import { Role } from "./schema";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      organizationMembers: {
        include: {
          organization: true,
        },
      },
    },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      organizationMembers: {
        include: {
          organization: true,
        },
      },
    },
  });
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: Role;
  organizationName: string;
  city: string;
  province: string;
  address?: string;
  picName: string;
  picPhone?: string;
}

export async function createUserWithOrganization(data: CreateUserInput) {
  const orgType = data.role === "INDUSTRY" ? "INDUSTRY" : "UMKM";

  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role,
        status: "PENDING", // Always PENDING on registration
      },
    });

    const organization = await tx.organization.create({
      data: {
        name: data.organizationName,
        type: orgType,
        city: data.city,
        province: data.province,
        address: data.address,
        picName: data.picName,
        picPhone: data.picPhone,
        verificationStatus: "PENDING",
      },
    });

    const member = await tx.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    return { user, organization, member };
  });
}

export async function updateFailedLogin(
  userId: string,
  attempts: number,
  lockedUntil: Date | null
) {
  return db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: attempts,
      lockedUntil,
    },
  });
}

export async function resetFailedLogin(userId: string) {
  return db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export async function saveResetToken(
  userId: string,
  token: string,
  expiry: Date
) {
  return db.user.update({
    where: { id: userId },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
}

export async function findUserByResetToken(token: string) {
  return db.user.findFirst({
    where: { resetToken: token },
  });
}

export async function updatePassword(userId: string, passwordHash: string) {
  return db.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export async function listAllUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organizationMembers: {
        include: {
          organization: true,
        },
      },
    },
  });
}

export async function updateUserAndOrgStatus(
  userId: string,
  status: "PENDING" | "VERIFIED" | "SUSPENDED"
) {
  return db.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { status },
      include: {
        organizationMembers: true,
      },
    });

    const orgStatus =
      status === "VERIFIED"
        ? "VERIFIED"
        : status === "SUSPENDED"
          ? "SUSPENDED"
          : "PENDING";

    for (const member of user.organizationMembers) {
      await tx.organization.update({
        where: { id: member.organizationId },
        data: { verificationStatus: orgStatus },
      });
    }

    return user;
  });
}
