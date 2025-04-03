import React, { createRef, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import AddUpdate from "./Components/AddUpdate";
import {deleteStickyNote, getAllStickyNotes, saveStickyNote, updateStickyNote} from "./apiUtils/apicalls"


const StickyNotes = () => {
  const [allStickyNotes, setAllStickyNotes] = useState([]);
  const [screenDimensions, setScreenDimensions]=useState({maxX:null, maxY:null})
  const[inPlaceEditText, setInplaceEditText]=useState("")
  const stickyNoteContainerRef=useRef(null)
  const [focusedNote, setFocusedNote] = useState({
    id: null,
    stickyNoteContent: "",
    newNote: true,
    posX: null,
    posY: null,
  });

  useEffect(() => {
    getAllStickyNotes(saveStickyNotes)

  }, []);


  //handling window resize
  useEffect(()=>{
    const updateScreenDimensions=()=>{
      if(stickyNoteContainerRef.current){
    
        const maxX = stickyNoteContainerRef.current.clientWidth - 250;
  const maxY = stickyNoteContainerRef.current.clientHeight - 250;
  setScreenDimensions({maxX:maxX,maxY:maxY})
      }
    }

    updateScreenDimensions()
    window.addEventListener("resize",updateScreenDimensions)


    return ()=>{
      window.removeEventListener("resize",updateScreenDimensions)
    }


  },[])

  const saveStickyNotes=(stickyNotes)=>{
    setAllStickyNotes(stickyNotes);
  }

  const stickyNotesRef = useRef({});

  const modifyStickyNotesList = (newNote, noteId, noteContent, posX, posY) => {
    const newNoteContents = {
      stickyNoteContent: noteContent,
      posX: posX || Math.floor(Math.random() * screenDimensions.maxX),
      posY: posY || Math.floor(Math.random() * screenDimensions.maxY),
    };
    if (newNote) {
        saveStickyNote(newNoteContents, saveStickyNotes);
    } else {
     
  newNoteContents.id=noteId
  updateStickyNote(noteId,newNoteContents,saveStickyNotes)
    }

   

    setFocusedNote({ id: null, stickyNoteContent: "", newNote: true });
  };

  const removeStickyNote = (e) => {
    const noteId = e.currentTarget.dataset.id;
    deleteStickyNote(noteId,saveStickyNotes)
  };

  const editStickyNote = (e) => {

    e.preventDefault();
    e.stopPropagation();
    const noteId = e.target.dataset.id;
    const currentNote = allStickyNotes.find((note) => note.id === noteId);
    if (!currentNote) return;
    setFocusedNote({
      newNote: false,
      id: currentNote.id,
      stickyNoteContent: currentNote.stickyNoteContent,
      posX: currentNote.posX,
      posY: currentNote.posY,
    });
    setInplaceEditText(currentNote.stickyNoteContent)
  };

  const handleMouseDown = (note, e) => {
    e.preventDefault()
    const { id, posX,posY} = note;
    const currentNoteRef = stickyNotesRef.current[id].current;

    //determinig current posaiton of the note wrt to the viewport
    const rect = currentNoteRef.getBoundingClientRect();
    //determing cuurent mouse position


   const offsetX= e.clientX-posX;
   const offsetY=e.clientY-posY;
    //calculating distance bw mose position and notes left corner
    // const offset = {
    //   x: mousePos.x - rect.left,
    //   y: mousePos.y - rect.top,
    // };

    const parentRect = currentNoteRef.parentElement.getBoundingClientRect();

    const handleMouseMove = (e) => {

      let newX = Math.max(
        0,
        Math.min(e.clientX-offsetX, parentRect.width - rect.width - 10)
      );
      let newY = Math.max(
        0,
        Math.min(e.clientY-offsetY, parentRect.height - rect.height - 10)
      );

      // let newX=e.clientX-offsetX
      // let newY=e.clientY-offsetY

      currentNoteRef.style.left = `${newX}px`;
      currentNoteRef.style.top = `${newY}px`;
      // currentNoteRef.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const handleMouseUp = (e) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // let finalX=e.clientX-offsetX
      // let finalY=e.clientY-offsetY
      let finalX = Math.max(
        0,
        Math.min(e.clientX - offset.x, parentRect.width - rect.width - 10)
      );
      let finalY = Math.max(
        0,
        Math.min(e.clientY - offset.y, parentRect.height - rect.height - 10)
      );

      updateNotePosition(id, finalX, finalY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateNotePosition = (id, newX, newY) => {
    let updatedStickyNote = allStickyNotes.find((note) =>
      note.id === id )
    updatedStickyNote={...updatedStickyNote,posX:newX,posY:newY}
   updateStickyNote(id,updatedStickyNote,saveStickyNotes)
  };

  return (
    <Container>
      <AddUpdate
        newNote={focusedNote.newNote}
        noteId={focusedNote.id}
        noteValue={focusedNote.stickyNoteContent}
        posX={focusedNote.posX}
        posY={focusedNote.posY}
        modifyStickyNotesList={modifyStickyNotesList}
      />
      <div className="allNotes" ref={stickyNoteContainerRef}>
        {allStickyNotes?.map((note) => (
          <StickyNoteContainer             key={note.id}     ref={
            stickyNotesRef.current[note.id]
              ? stickyNotesRef.current[note.id]
              : (stickyNotesRef.current[note.id] = createRef())
          }  onMouseDown={(e) => handleMouseDown(note, e)}      posX={note.posX}
          posY={note.posY}>
            <div>
            <button data-id={note.id} onClick={editStickyNote}>
              /
            </button>
            <button data-id={note.id} onClick={removeStickyNote}>
              X
            </button>
            </div>
    { focusedNote.id===note.id?<input autoFocus value={inPlaceEditText}
    onKeyDown={(e)=>{
      if(e.key==="Enter"){
        modifyStickyNotesList(false, note.id,inPlaceEditText,note.posX,note.posY )
      }
    }}
    onBlur={()=>{
      modifyStickyNotesList(false, note.id,inPlaceEditText,note.posX,note.posY )
    }}
    onChange={(e)=>{
      setInplaceEditText(e.target.value)
    }}/>: <IndividualNote
            
       
     
            className="individualStickyNote"

          >
            📌<span>{note.stickyNoteContent}</span>

          </IndividualNote>}

          </StickyNoteContainer>
    
        ))}
      </div>
    </Container>
  );
};

export default StickyNotes;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .allNotes {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid red;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const StickyNoteContainer=styled.div`
    position: absolute;
  left: ${(props) => props.posX}px;
  top: ${(props) => props.posY}px;
  margin: 5px;
  padding: 5px;
  border: 0.5px solid black;
  cursor: move;
  background-color: lightyellow;
  
  button{
    background-color: transparent;
  }
`

const IndividualNote = styled.div`
  margin: 5px;
  padding: 5px;
  border: 0.5px solid black;
  border-radius: 4px;
  width: fit-content;
  max-width: 200px;
  max-height: 200px;
  overflow: auto;
  display: flex;
  gap: 5px;
 // user-select: none;
 


  button {
    padding: 5px;
    background: transparent;
  }
`;
