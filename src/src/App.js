import React, { useState, useRef } from 'react'
import { available } from './data'

const App = () => {
  const [data, setData] = useState(available);
  const [isDragging, setIsDragging] = useState();

  const containerRef = useRef()


  function detectLeftButton(e){
    e = e || window.event;
    if("buttons" in e){
      return e.buttons === 1;
    }

    let button = e.which || e.button;
    return button === 1;
  }


  function dragStart(e, index){
    if(!detectLeftButton()) return; // only use left mouse click;
    
    setIsDragging(index);

    const container = containerRef.current;
    const items = [...container.childNodes];
    const dragItem = items[index];
    const itemsBelowDragItem = items.slice(index + 1);
    const notDragItems = items.filter((_, i) => i !== index);
    const dragData = data[index];
    let newData = [...data];


    // getBoundingClientRect of dragItem
    const dragBoundingRect = dragItem.getBoundingClientRect();

    // distance between two card 
    const space = items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().bottom;


    // set style for dragItem when mouse down
    dragItem.style.position = "fixed";
    dragItem.style.zIndex = 5000;
    dragItem.style.width = dragBoundingRect.width + "px";
    dragItem.style.height = dragBoundingRect.height + "px";
    dragItem.style.top = dragBoundingRect.top + "px";
    dragItem.style.left = dragBoundingRect.left + "px";
    dragItem.style.cursor = "grabbing";


    // create alternate div element when dragItem position is fixed
    const div = document.createElement("div");
    div.id = "div-temp";
    div.style.width = dragBoundingRect.width + "px";
    div.style.height = dragBoundingRect.height + "px";
    div.style.pointerEvents = "none";
    container.appendChild(div);


    // move the elements below dragItem.
    // distance to be moved.
    const distance = dragBoundingRect.height + space;

    itemsBelowDragItem.forEach(item => {
      item.style.transform = `translateY(${distance}px)`;
    })


    // get the original coordinates of the mouse pointer
    let x = e.clientX;
    let y = e.clientY;


    // perform the function on hover.
    document.onpointermove = dragMove;

    function dragMove(e){
      // Calculate the distance the mouse pointer has traveled.
      // original coordinates minus current coordinates.
      const posX = e.clientX - x;
      const posY = e.clientY - y;

      // Move Item
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`;

      // swap position and data
      notDragItems.forEach(item => {
        // check two elements is overlapping.
        const rect1 = dragItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();

        let isOverlapping = 
          rect1.y < rect2.y + (rect2.height / 2) && rect1.y + (rect1.height / 2) > rect2.y;

        if(isOverlapping){
          // Swap Position Card
          if(item.getAttribute("style")){
            item.style.transform = "";
            index++
          }else{
            item.style.transform = `translateY(${distance}px)`;
            index--
          }

          // Swap Data
          newData = data.filter(item => item.id !== dragData.id);
          newData.splice(index, 0, dragData);
        }

      })

    }


    // finish onPointerDown event
    document.onpointerup = dragEnd;

    function dragEnd(){
      document.onpointerup = "";
      document.onpointermove = "";

      dragItem.style = "";
      container.removeChild(div);

      items.forEach(item => item.style = "");
      
      setIsDragging(undefined);
      setData(newData)
    }
  }
 

  return (
    <div className='container' ref={containerRef}>
      {
        data.map((item, index) => (
          <div key={item.id} onPointerDown={e => dragStart(e, index)}>

            <div className={`card ${isDragging === index ? 'dragging' : ''}`}>
              <div className="img-container">
                <img src="./card.svg" alt="" />
              </div>

              <div className="box">
                <h4>{item.subtitle}</h4>
                <h2>{item.title}</h2>
              </div>
            </div>

          </div>
        ))
      }
    </div>
  )
}

export default App
