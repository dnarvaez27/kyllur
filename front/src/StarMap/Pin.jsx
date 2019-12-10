import React, { useState, useEffect } from 'react';

const Pin = ({refresh}) => {
  useEffect(()=>{}, [refresh]);
  const [show, setShow] = useState(true);

  return (
    <>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 384 512"
          id="img-pin"
          onClick={_=>setShow(false)}
          className={show?'unclicked':''}>
        <path
          fill="#ea4335"
          fillRule="evenodd"
          d="M0,192C0,86,86,0,192,0S384,86,384,192c0,77.41-118.44,320-192,320S0,269.41,0,192Zm192,80a80,80,0,1,0-80-80A80,80,0,0,0,192,272Z">
          <animate
            id="animation-to-check"
            repeatCount="1"
            dur="2.5s"
            attributeName="d"
            fill="freeze"
            begin="click"
            calcMode="spline"
            keySplines="0.1 1 0.56 0.72; 0.1 1 0.56 0.72"
            values="
              M0,192C0,86,86,0,192,0S384,86,384,192c0,77.41-118.44,320-192,320S0,269.41,0,192Zm192,80a80,80,0,1,0-80-80A80,80,0,0,0,192,272Z;
              M0,192C0,86,86,0,192,0S384,86,384,192c0,77.41-73.56,182.65-192,182.65S0,269.41,0,192Zm192,80a80,80,0,1,0-80-80A80,80,0,0,0,192,272Z;
              M0,336.12c0-106,86-192,192-192s192,86,192,192C384,413.54,310.44,512,192,512S0,413.54,0,336.12Zm192,80a80,80,0,1,0-80-80A80,80,0,0,0,192,416.12Z"
            />
        </path>
      </svg>
      <div id="pin-bubble" className={show?'':'hide'}>
        <span>Here you are!</span>
      </div>
    </>
  );
}

export default Pin;
