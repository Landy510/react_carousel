import { useState } from 'react'
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

  function handleChange(index) {
    let limit = allImages().length - 1;
    setNow(index < 0 ? limit : index > limit ? 0 : index);
  }

  return (
    <>
      <div style={{
        textAlign: 'center'
      }}>
        <button onClick={() => handleChange(now - 1)}>Prev</button>
        <button onClick={() => handleChange(now + 1)}>Next</button>
      </div>
      <div 
        className="container"
      >
        <div className="swiper-wrapper">
          {
            showImages().map(item => {
              return (
                <div 
                  className='page' 
                  key={item.id}
                  // style={{
                  //   backgroundColor: item.bgc
                  // }}
                >
                  {/* {item.id} */}
                  <img src={item.src} alt="" />
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
