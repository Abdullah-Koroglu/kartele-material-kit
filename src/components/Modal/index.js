import { useEffect, useState } from "react";
import CSS from "./index.module.css"

function Modal({children, open, setOpenFromParent}) {
  const [isOpen, setOpen] = useState (open)
  console.log(open);
  useEffect (() => {
    setOpen (open)
  }, [open])
  return isOpen ? <div className={CSS["main-container"]}>
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      onClick={setOpenFromParent}
      onKeyDown={setOpenFromParent}
      className={CSS.background}
    />
      <div className={CSS["modal-container"]}>{children}</div>
    </div> : null;
}
export default Modal;