
import { Sidebar } from "flowbite-react";
import React, { useContext } from "react";
import { ChildItem } from "../Sidebaritems";
import NavItems from "../NavItems";
import { Icon } from "@iconify/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { UserDataContext } from "@/app/context/UserDataContext";

interface NavCollapseProps {
  item: ChildItem;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item }: any) => {
  const pathname = usePathname();
  const activeDD = item.children.find((t: { url: string; }) => t.url === pathname)
  const { t } = useTranslation();
  const { permissions } = useContext(UserDataContext);

  const validChildren = item.children?.filter((child: any) => {
      if (!child.requiredPermission) return true;
      return permissions?.includes(child.requiredPermission);
  });

  if (!validChildren || validChildren.length === 0) return null;

  return (
    <>
      <Sidebar.Collapse
        label={t(`${item.name}`)} 
        open={activeDD ? true : false}
        icon={() => <Icon icon={item.icon} height={20} stroke="1" className="my-0.5" />}
        className={`${activeDD ? '!text-white bg-primary active-dropdown' : ''} collapse-menu`}
        renderChevronIcon={(theme, open) => {
          const IconComponent = open
            ? HiOutlineChevronDown
            : HiOutlineChevronDown;
          return (
            <IconComponent
              aria-hidden
              className={`${twMerge(theme.label.icon.open[open ? "on" : "off"])} drop-icon`}
            />
          );
        }}
      >
        {/* Render child items */}
        {validChildren && (
          <Sidebar.ItemGroup className="sidebar-dropdown">
            {validChildren.map((child: any) => (
              <React.Fragment key={child.id}>
                {/* Render NavItems for child items */}
                {child.children ? (
                  <NavCollapse item={child}  /> // Recursive call for nested collapse
                ) : (
                  <NavItems item={child} isMenuItem={true} />
                )}
              </React.Fragment>
            ))}
          </Sidebar.ItemGroup>
        )}
      </Sidebar.Collapse>
    </>
  );
};

export default NavCollapse;
