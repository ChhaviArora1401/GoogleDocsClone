import React, { useEffect, useRef } from "react";

//menu

function Menu({ hideShowMenu, children, classStyle }) {
  const ref = useRef();
  useOnClickOutside(ref, hideShowMenu);
  return (
    <span ref={ref} className={`${classStyle}`}>
      {children}
    </span>
  );
}

//function to close after clicking outside the menu

function useOnClickOutside(ref, callbackFunc) {
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callbackFunc();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
}

export default Menu;
