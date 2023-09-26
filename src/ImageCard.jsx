import {forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ImageCard = forwardRef(function ImageCard({cardInfo, handleClick}, ref){
  const {month, miniUrl, name, year, id} = cardInfo;
return(
  <div ref={ref}
      id={id}
      className="imageCard" 
      tabIndex={1} 
      onClick={() => handleClick(id)}>
    <p>{month} {year}</p>
    <LazyLoadImage 
      // width={"100%"}
      threshold={"50"}
      placeholderSrc={miniUrl}
      src={miniUrl} 
      effect="blur"
      alt={name} />
      
  </div>
)
})

export default ImageCard;