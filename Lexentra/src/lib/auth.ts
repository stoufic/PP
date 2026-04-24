import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { demoCredentials, demoOrganization, demoUsers } from "@/lib/fixtures";
import { SessionUser } from "@/lib/types";

const COOKIE_NAME = "lexentra_session";

function secretKey() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "lexentra-dev-secret-change-me"
  );
}

export async function createSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secretKey());

  return payload as unknown as SessionUser;
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSession(user);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  try {
    await prisma.session.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });
  } catch {
    // Allow cookie-only sessions in demo mode or before the database is configured.
  }
}

export async function clearSessionCookie() {
  const token = cookies().get(COOKIE_NAME)?.value;

  cookies().delete(COOKIE_NAME);

  if (!token) {
    return;
  }

  try {
    await prisma.session.deleteMany({ where: { token } });
  } catch {
    // Ignore when no database is attached.
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (token) {
    try {
      return await verifySession(token);
    } catch {
      cookies().delete(COOKIE_NAME);
    }
  }

  if (process.env.ENABLE_DEMO_FALLBACK === "true") {
    const user = demoUsers[0];

    return {
      id: user.id,
      organizationId: user.organizationId,
      workspaceId: user.workspaceId,
      departmentId: user.departmentId,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title
    };
  }

  return null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function authenticateWithPassword(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await compare(password, user.passwordHash))) {
      const workspace = await prisma.workspace.findFirst({
        where: { organizationId: user.organizationId },
        orderBy: { createdAt: "asc" }
      });

      return {
        id: user.id,
        organizationId: user.organizationId,
        workspaceId: workspace?.id || demoOrganization.workspaceId,
        departmentId: user.departmentId || undefined,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title || "Team Member"
      } satisfies SessionUser;
    }
  } catch {
    // Ignore and check demo credentials below.
  }

  if (
    process.env.ENABLE_DEMO_FALLBACK === "true" &&
    email === demoCredentials.email &&
    password === demoCredentials.password
  ) {
    const demoUser = demoUsers[0];

    return {
      id: demoUser.id,
      organizationId: demoUser.organizationId,
      workspaceId: demoUser.workspaceId,
      departmentId: demoUser.departmentId,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      title: demoUser.title
    } satisfies SessionUser;
  }

  return null;
}

export async function createOrganizationAdmin(input: {
  organizationName: string;
  workspaceName: string;
  departmentName: string;
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await hash(input.password, 12);

  const organization = await prisma.organization.create({
    data: {
      name: input.organizationName,
      slug: input.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      workspaces: {
        create: {
          name: input.workspaceName
        }
      },
      departments: {
        create: {
          name: input.departmentName
        }
      }
    },
    include: {
      workspaces: true,
      departments: true
    }
  });

  const admin = await prisma.user.create({
    data: {
      organizationId: organization.id,
      departmentId: organization.departments[0]?.id,
      name: input.name,
      email: input.email,
      passwordHash,
      role: "ADMIN",
      title: "Workspace Administrator"
    }
  });

  return {
    id: admin.id,
    organizationId: organization.id,
    workspaceId: organization.workspaces[0]?.id || demoOrganization.workspaceId,
    departmentId: admin.departmentId || undefined,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    title: admin.title || "Workspace Administrator"
  } satisfies SessionUser;
}
