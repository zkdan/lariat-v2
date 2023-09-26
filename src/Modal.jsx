import { useEffect, forwardRef } from "react";
import './Modal.css'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Modal = forwardRef( function Modal({url, close, title, mini}, ref){

  useEffect(()=>{
    const handleKeydown = (e)=>{
      if(e.keyCode === 27){
        close();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    document.querySelector("body").classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.querySelector("body").classList.remove("no-scroll");
    }
  },[close])
  
  return(
    <div ref={ref}
    className="modal" 
    >
      <div className="container">
        <button autoFocus tabIndex={1} onClick={(e)=>close(e)}></button>
        <p>{title}</p>
        <LazyLoadImage
          placeholderSrc={mini}
          loading="lazy"
          effect="blur"
          src={url} 
          alt={title} 
          />
      </div>
    </div>
)
})
export default Modal;