import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import React from "react";

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
    },
  });
}

const TrendSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      TrendSidebar
    </div>
  );
};

export default TrendSidebar;
