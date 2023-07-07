import { useEffect, useRef, useState } from 'react'
import './App.css'
import { v4 as uuidv4 } from 'uuid';
const source = [
  {
    id: uuidv4(),
    bgc: 'rgb(255, 10, 0)',
    src: 'https://picsum.photos/id/230/200/300'
  },
  {
    id: uuidv4(),
    bgc: 'rgb(255, 50, 0)',
    src: 'https://picsum.photos/id/231/200/300'
  },
  {
    id: uuidv4(),
    bgc: 'rgb(255, 150, 0)',
    src: 'https://picsum.photos/id/232/200/300'
  },
  {
    id: uuidv4(),
    bgc: 'rgb(255, 255, 50)',
    src: 'https://picsum.photos/id/233/200/300'
  }
]

function App() {
  const containerRef = useRef(null);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const firstChildWidth = useRef(0);

  const anchorPoint = useRef(3);
  const swiperContainerRef = useRef(null);

  const directionRef = useRef('');

  const allImages = () => {
    let arr = []
    
    arr = source.slice();
    arr = [
      ...arr.slice(-3),
      ...arr,
      ...arr.slice(0,3)
    ].map(item => {
      return {
        ...item,
        id: uuidv4()
      }
    })
    return arr
  }

  function handleChange(index, direction) {
    anchorPoint.current = index
    directionRef.current = direction
    swiperContainerRef.current.style.transform = `translateX(${anchorPoint.current * -firstChildWidth.current}px)`
  }

  const dragStart = (e) => {
    isDrag.current = true; 
    containerRef.current.classList.add('dragging');

    startX.current = e.pageX;
    startScrollLeft.current = containerRef.current.scrollLeft;
  }

  const dragging = (e) => {
    if(!isDrag.current) return;
    containerRef.current.scrollLeft = startScrollLeft.current - (e.pageX - startX.current);
  }

  const dragStop = () => {
    isDrag.current = false;
    containerRef.current.classList.remove('dragging');
  }

  const infiniteScroll = () => {
    if(containerRef.current.scrollLeft === 0) {
      console.log("you've reached the left end");
      containerRef.current.classList.add('no-transition');
      // containerRef.current.scrollLeft = containerRef.current.scrollWidth - ( 2 * containerRef.current.offsetWidth );
      swiperContainerRef.current.style.transform = `translate3d(${-2 * firstChildWidth.current}px, 0, 0)`
      containerRef.current.classList.remove('no-transition');
    }
    else if(Math.ceil(containerRef.current.scrollLeft) === (containerRef.current.scrollWidth - containerRef.current.offsetWidth)) {
      console.log("you've reached the right end");
      containerRef.current.classList.add('no-transition');
      containerRef.current.scrollLeft = containerRef.current.offsetWidth;
      containerRef.current.classList.remove('no-transition');
    }
  }

  function checkPos() {
    console.group('swiper coordination info')
    console.log('checkPos? ', swiperContainerRef.current.getBoundingClientRect())
    console.log('left? ', Math.round(Math.abs(swiperContainerRef.current.getBoundingClientRect().left)))
    console.log('right? ', Math.round(Math.abs(swiperContainerRef.current.style.right)))
    console.log('width? ', Math.round(Math.abs(swiperContainerRef.current.clientWidth)))
    console.log('scrollLeft ', swiperContainerRef.current.style.transform)
    console.log('scrollWidth ', swiperContainerRef.current.scrollWidth)
    console.groupEnd()
    if(
      directionRef.current === 'next' && 
      Math.round(Math.abs(swiperContainerRef.current.getBoundingClientRect().left)) === Math.round(Math.abs(swiperContainerRef.current.getBoundingClientRect().width))
    ) {
      // if swiperContainer touched its right end, this block will be processed
      console.log('right end')
      swiperContainerRef.current.style.transition = 'none';
      const shiftDistance = swiperContainerRef.current.getBoundingClientRect().left + 4 * firstChildWidth.current;
      swiperContainerRef.current.style.transform = `translateX(${shiftDistance}px)`;
      
      anchorPoint.current -= 4;
      setTimeout(() => {
        swiperContainerRef.current.style.transition = 'transform .5s';
      }, 0)
    }
    else if(
      directionRef.current === 'prev' && 
      swiperContainerRef.current.getBoundingClientRect().left >= 0
    ) {
      // if swiperContainer touched its left end, this block will be processed
      console.log('leftt end')
      swiperContainerRef.current.style.transition = 'none';
      const shiftDistance = swiperContainerRef.current.getBoundingClientRect().left - 4 * firstChildWidth.current;
      swiperContainerRef.current.style.transform = `translateX(${shiftDistance}px)`;

      anchorPoint.current += 4;
      setTimeout(() => {
        swiperContainerRef.current.style.transition = 'transform .5s';
      }, 0)
    }
  }

  useEffect(() => {
    containerRef.current.addEventListener('mousedown', dragStart)
    containerRef.current.addEventListener('mousemove', dragging)
    containerRef.current.addEventListener('scroll', infiniteScroll)
    swiperContainerRef.current.addEventListener('transitionend', checkPos)
    document.addEventListener('mouseup', dragStop)

    firstChildWidth.current = swiperContainerRef.current.children[0].getBoundingClientRect().width;
    swiperContainerRef.current.style.transform = `translateX(${anchorPoint.current * -firstChildWidth.current}px)`; 
    

    return () => {
      containerRef.current.removeEventListener('mousemove', dragging);
      containerRef.current.removeEventListener('mousedown', dragStart);
      document.addEventListener('mouseup', dragStop);
    }
  }, [])

  return (
    <>
      <div style={{
        textAlign: 'center'
      }}>
        <button onClick={() => handleChange(anchorPoint.current - 1, 'prev')} >Prev</button>
        <button onClick={() => handleChange(anchorPoint.current + 1, 'next')}>Next</button>
      </div>

      <div 
        className="container"
        ref={containerRef}
      >
        <div className="swiper-wrapper" ref={swiperContainerRef}>
          {
            allImages().map(item => {
              return (
                <div 
                  className='page' 
                  key={item.id}
                >
                  <p>{item.id}</p>
                  <img 
                    src={item.src} 
                    alt="" 
                    draggable={false}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default App
