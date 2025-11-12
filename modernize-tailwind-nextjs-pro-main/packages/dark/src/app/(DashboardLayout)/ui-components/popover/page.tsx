import React from "react";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import PopoverWrapper from "./PopoverWrapper";

export const metadata: Metadata = {
  title: "Ui Popover",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Popover",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Popover" items={BCrumb} />
      <PopoverWrapper />
    </>
  );
};

export default page;