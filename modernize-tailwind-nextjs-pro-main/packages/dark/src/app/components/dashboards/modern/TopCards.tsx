import React, { useContext } from "react";
import Image from "next/image"
import { useRouter } from "next/navigation"
import CardBox from "../../shared/CardBox"
import iconConnect from "/public/images/svgs/icon-connect.svg"
import iconSpeechBubble from "/public/images/svgs/icon-speech-bubble.svg"
import iconFavorites from "/public/images/svgs/icon-favorites.svg"
import iconMailbox from "/public/images/svgs/icon-mailbox.svg"
import iconBriefcase from "/public/images/svgs/icon-briefcase.svg"
// import iconUser from "/public/images/svgs/icon-user-male.svg"
import { UserDataContext } from "@/app/context/UserDataContext";
import { Reminder } from "@/types/apps/invoice";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const TopCards = () => {
    const router = useRouter();
    const { reminders } = useContext(UserDataContext);

    // Calculate Dynamic Counts
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const activeReminders = reminders.filter((r: Reminder) => r.active);
    const completedReminders = reminders.filter((r: Reminder) => !r.active || r.completed);

    const pendingCount = activeReminders.filter((r: Reminder) => new Date(r.reminderEndDate) > now).length;
    const activeCount = activeReminders.length;
    const completedCount = completedReminders.length;

    const in7DaysCount = activeReminders.filter((r: Reminder) => {
        const endDate = new Date(r.reminderEndDate);
        return endDate >= now && endDate <= sevenDaysFromNow;
    }).length;

    const in30DaysCount = activeReminders.filter((r: Reminder) => {
        const endDate = new Date(r.reminderEndDate);
        return endDate >= now && endDate <= thirtyDaysFromNow;
    }).length;

    
    const TopCardInfo = [
        {
            key:"card1",
            title:"Pending notifications",
            desc: pendingCount.toString(),
            img:iconMailbox,
            bgcolor:"bg-lightprimary dark:bg-lightprimary ",
            textclr:"text-primary dark:text-primary",
            filterType:"pending"
        },
        {
            key:"card2",
            title:"In seven days",
            desc: in7DaysCount.toString(),
            img:iconSpeechBubble,
            bgcolor:"bg-lightsuccess dark:bg-lightsuccess",
            textclr:"text-success dark:text-success",
            filterType:"7days"
        },
        {
            key:"card3",
            title:"In 30 days",
            desc: in30DaysCount.toString(),
            img:iconBriefcase,
            bgcolor:"bg-lighterror dark:bg-lighterror",
            textclr:"text-error dark:text-error",
            filterType:"30days"
        },
        {
            key:"card4",
            title:"Completed",
            desc: completedCount.toString(),
            img:iconFavorites,
            bgcolor:"bg-lightwarning dark:bg-lightwarning",
            textclr:"text-warning dark:text-warning",
            filterType:"completed"
        },
        {
            key:"card5",
            title:"Active notifications",
            desc: activeCount.toString(),
            img:iconConnect,
            bgcolor:"bg-lightinfo dark:bg-darkinfo",
            textclr:"text-info dark:text-info",
            filterType:"active"
        },
    ]

    const handleCardClick = (filterType: string) => {
        router.push(`/apps/invoice/list?filter=${filterType}`);
    }


    return (
        <>
          <div>
          <Swiper
        slidesPerView={6}
        spaceBetween={24}
        loop={true}
        dir="ltr"
        grabCursor={true}
        breakpoints={{
            0 : {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1030: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1200: {
              slidesPerView: 5, // Changed to 5 since we have 5 items
              spaceBetween: 24,
            },
          }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper !pb-12"
      >
     {
        TopCardInfo.map((item)=>{
            return(
                <SwiperSlide key={item.key} >
                <CardBox 
                    className={`shadow-sm rounded-2xl w-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent dark:border-gray-800 ${item.bgcolor}`}
                    onClick={() => handleCardClick(item.filterType)}
                >
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-dark shadow-md mb-4 transition-transform hover:rotate-12">
                            <Image src={item.img}
                                width="32" height="32" alt="icon"/>
                        </div>
                        <p className={`font-semibold text-base ${item.textclr} mb-2 opacity-90 min-h-[3rem] flex items-center justify-center`}>
                            {item.title}
                        </p>
                        <h5 className={`text-3xl font-bold ${item.textclr}`}>{item.desc}</h5>
                    </div>
                </CardBox>
                </SwiperSlide>
            )
        })
     }

      </Swiper>
          </div>
        </>
    )
}
export { TopCards }