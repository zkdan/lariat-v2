
import { useEffect, useState, useRef } from "react";
import ImageCard from "./ImageCard";
import Filter from "./Filter";
import Modal from './Modal';
import getMonth from "./utils.js"
import "./ImageGrid.css";

const monthFilters = ['Cover','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const  ImageGrid = () =>{
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const [allPhotos, setAllPhotos] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const modalRef = useRef(null);
  const imgRef=useRef(null);

  const getAllYears = (data) => {
    let years = new Set();
    data.forEach(item=> {
      years.add(item.year);
    });
    years = Array.from(years);
    setAllYears(years);
  }

  useEffect(()=>{

    getData();

    const handleEvent = (e) => {
      const element = modalRef.current;
      if(element && element === e.target){
        setModal(false);
      }
      
    };
    const handleKeydown = (e)=> {
      const isImageCard = e.target.id && e.target.classList[0] === 'imageCard';
      //spacebar
      if(e.keyCode === 32 && isImageCard){
        handleImageClick(e.target.id)
      }
      const leftArrow = e.keyCode ===37;
      const rightArrow = e.keyCode === 39;
      let curr = allPhotos.filter(photo=>{
        return photo.id === selectedPhoto.id
      });
      if(leftArrow || rightArrow){
        if(modal){
          curr = allPhotos.indexOf(curr[0]);
          if(rightArrow){
            setSelectedPhoto(allPhotos[curr +1])
          } else if(leftArrow){
            setSelectedPhoto(allPhotos[curr -1])
          }
        }
      }
    }
    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
      document.removeEventListener("keydown", handleKeydown);
    };
  },[]);

  const getData = async ()=>{
    fetch('https://storage.googleapis.com/storage/v1/b/lariat-images/o/')
    .then(res=> res.json())
    .then(res => {
      const data = res.items.filter(item => item.name.includes('mini')).map(item => {
        const baseUrl = `https://storage.googleapis.com/`;
        const month = getMonth(item.name.slice(5,7));
        const year = item.name.slice(0,4);
        const name = item.name;
        const trimPoint = item.id.lastIndexOf('/');
        const miniUrl = `${baseUrl}${item.id.slice(0,trimPoint)}`;
        const thumbUrl = miniUrl.replace('mini', 'thumb');
        const photoSpecs = {
          miniUrl,
          thumbUrl,
          name,
          id:item.generation,
          month,
          year
        }
        return photoSpecs;
      }).reverse();
      setAllPhotos(data);
      getAllYears(data);
    });
  }

  const handleUpdateYear = (newYear)=>{
    if(year === newYear){
      setYear(null);
    } else {
      setYear(newYear);
    }
  }
  const handleUpdateMonth =(newMonth)=>{
    if(month === newMonth){
      setMonth(null);
    } else {
      setMonth(newMonth);
    }
  }
  const handleImageClick =(x)=>{
    const selected = allPhotos.filter(photo => {
      return photo.id === x
    });
    setSelectedPhoto(selected[0]);
    setModal(true);
  }
  const handleCloseModal =()=>{
    setModal(false);
    setSelectedPhoto(null);
  }
  const filteredPhotos = allPhotos
  .filter(photo => {
    if(year && month){
      return photo.year === year && photo.month === month
    }
    return photo
  })
  .filter(photo =>{
    if(year){
      return photo.year === year
    }
    return photo
  })
  .filter(photo =>{
    if(month){
      return photo.month === month
    }
    return photo
  });
  return(
    <main>
      {modal && selectedPhoto && 
      <Modal 
        ref={modalRef}
        mini={selectedPhoto.miniUrl}
        url={selectedPhoto.thumbUrl}
        close={handleCloseModal}
        isOpen={modal}
        title={`${selectedPhoto.month} ${selectedPhoto.year}`}
      />
      }
      <Filter
        type={'year'} 
        allValues ={allYears} 
        handleChange={handleUpdateYear} 
        currentValue={year}
        />
        <Filter 
          type={'month'}
          allValues={monthFilters}
          handleChange={handleUpdateMonth}
          currentValue={month}
        />
      <section>
        {filteredPhotos.length ? filteredPhotos.map(photo =>{
          return <ImageCard 
          ref={imgRef}
          key={photo.id} 
          cardInfo={photo} 
          handleClick={handleImageClick}/>
        }) : <p className="empty-message">sorry, nothing here for the moment</p>
        }
      </section>
    </main>
  )
  }
  
  export default ImageGrid;