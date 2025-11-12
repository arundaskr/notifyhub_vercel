"use client";
import React from "react";
import dynamic from "next/dynamic";

const DefaultPopover = dynamic(() => import('@/app/components/ui-components/Popover/DefaultPopover'), { ssr: false });
const CompanyProfile = dynamic(() => import('@/app/components/ui-components/Popover/CompanyProfile'), { ssr: false });
const ControlledPopover = dynamic(() => import('@/app/components/ui-components/Popover/ControlledPopover'), { ssr: false });
const DisableArrow = dynamic(() => import('@/app/components/ui-components/Popover/DisableArrow'), { ssr: false });
const ImagePopover = dynamic(() => import('@/app/components/ui-components/Popover/ImagePopover'), { ssr: false });
const PasswordPopover = dynamic(() => import('@/app/components/ui-components/Popover/PasswordPopover'), { ssr: false });
const PlacementPopover = dynamic(() => import('@/app/components/ui-components/Popover/PlacementPopover'), { ssr: false });
const TriggerType = dynamic(() => import('@/app/components/ui-components/Popover/TriggerType'), { ssr: false });

const PopoverWrapper = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Default */}
      <div className="lg:col-span-3 md:col-span-6 col-span-12">
        <DefaultPopover />
      </div>
      {/* Company Profile */}
      <div className="lg:col-span-3 md:col-span-6 col-span-12">
        <CompanyProfile />
      </div>
      {/* Controlled Popover */}
      <div className="lg:col-span-3 md:col-span-6 col-span-12">
        <ControlledPopover />
      </div>
      {/* Disable Arrow */}
      <div className="lg:col-span-3 md:col-span-6 col-span-12">
        <DisableArrow />
      </div>
      {/* Image Popover */}
      <div className="lg:col-span-6 col-span-12">
        <ImagePopover />
      </div>
      {/* Password Popover */}
      <div className="lg:col-span-6 col-span-12">
        <PasswordPopover />
      </div>
      {/* Placement Popover */}
      <div className="lg:col-span-8 col-span-12">
        <PlacementPopover />
      </div>
      {/* Trigger Type */}
      <div className="lg:col-span-4 col-span-12">
        <TriggerType/>
      </div>
    </div>
  );
};

export default PopoverWrapper;
