import { useEffect, useRef, useState } from 'react'
import './App.css'

const source = [
  {
    id: 0,
    bgc: 'rgb(255, 10, 0)',
    src: 'https://picsum.photos/id/230/200/300'
  },
  {
    id: 1,
    bgc: 'rgb(255, 50, 0)',
    src: 'https://picsum.photos/id/231/200/300'
  },
  {
    id: 2,
    bgc: 'rgb(255, 150, 0)',
    src: 'https://picsum.photos/id/232/200/300'
  },
  {
    id: 3,
    bgc: 'rgb(255, 255, 50)',
    src: 'https://picsum.photos/id/233/200/300'
  }
]

function App() {
  const [now, setNow] = useState(0);

  const containerRef = useRef(null);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const firstChildWidth = useRef(0);

  const directionRef = useRef('');
  
  const allImages = () => {
    const arr = [];
    const total = source.length;
    let count;
    while(total > 0 && arr.length < 5 + 4) {
      count = Math.floor(arr.length / total);

      for(let i = 0; i < total; i++) {
        arr.push({id: count + '-' + i, bgc: source[i].bgc, src: source[i].src
      })
      }
    }

    return arr;
  }

  const showImages = () => {
    const start = now - 4;
    return allImages().slice(start).concat(allImages().slice(0, start));
  }

  function handleChange(index, direction) {
    directionRef.current = direction;
    let limit = allImages().length - 1;
    setNow(index < 0 ? limit : index > limit ? 0 : index);
    // containerRef.current.scrollLeft += direction === 'prev' ? -firstChildWidth.current : +firstChildWidth.current
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
    console.log('Hello')
    if(containerRef.current.scrollLeft === 0) {
      console.log("you've reached the left end");
      containerRef.current.classList.add('no-transition');
      containerRef.current.scrollLeft = containerRef.current.scrollWidth - ( 2 * containerRef.current.offsetWidth );
      containerRef.current.classList.remove('no-transition');
    }
    else if(Math.ceil(containerRef.current.scrollLeft) === (containerRef.current.scrollWidth - containerRef.current.offsetWidth)) {
      console.log("you've reached the right end");
      containerRef.current.classList.add('no-transition');
      containerRef.current.scrollLeft = containerRef.current.offsetWidth;
      containerRef.current.classList.remove('no-transition');
    }
  }

  useEffect(() => {
    containerRef.current.addEventListener('mousedown', dragStart)
    containerRef.current.addEventListener('mousemove', dragging)
    containerRef.current.addEventListener('scroll', infiniteScroll)
    document.addEventListener('mouseup', dragStop)
    firstChildWidth.current = containerRef.current.children[0].children[0].offsetWidth;

    return () => {
      containerRef.current.removeEventListener('mousemove', dragging);
      containerRef.current.removeEventListener('mousedown', dragStart);
      document.addEventListener('mouseup', dragStop);
    }
  }, [])

  useEffect(() => {
    containerRef.current.scrollLeft += directionRef.current === 'prev' ? -firstChildWidth.current : +firstChildWidth.current
  }, [now])

  return (
    <>
      <div style={{
        textAlign: 'center'
      }}>
        <button onClick={() => handleChange(now - 1, 'prev')} >Prev</button>
        <button onClick={() => handleChange(now + 1, 'next')}>Next</button>
      </div>

      <div 
        className="container"
        ref={containerRef}
      >
        <div className="swiper-wrapper">
          {
            showImages().map(item => {
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
