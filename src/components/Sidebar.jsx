import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../context/ContextProvider";
import Sidelink from "./Sidelink";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, user, isLoading } =
    useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 z-50'>
      {activeMenu && (
        <>
          <div className='flex justify-between items-center'>
            <Link
              to='/'
              onClick={handleCloseSideBar}
              className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight transition duration-300 dark:text-white text-slate-900'
            >
              <img src='/images/logo-internity.png' alt='logo' width='50' />
              <p>Internity</p>
            </Link>
            <TooltipComponent content='Menu' position='BottomCenter'>
              <button
                type='button'
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className='mt-10 '>
            <Sidelink
              name='home'
              icon='octicon:home-16'
              handler={handleCloseSideBar}
            />
            <Sidelink
              name='activity'
              icon='mdi:recent'
              handler={handleCloseSideBar}
            />
            {isLoading ? (
              <></>
            ) : (
              user.in_internship && (
                <Sidelink
                  name='report'
                  icon='tabler:news'
                  handler={handleCloseSideBar}
                />
              )
            )}
            <Sidelink
              name='intern'
              icon='ci:suitcase'
              handler={handleCloseSideBar}
            />
            <Sidelink
              name='profile'
              icon='mdi:user-outline'
              handler={handleCloseSideBar}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
