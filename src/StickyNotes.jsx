import React,{useEffect, useState

} from "react";
import styled from '@emotion/styled'
import AddUpdate from "./Components/AddUpdate";
import { getFromLocalStorage, saveToLocalStorage } from "./utils";

const Container = styled.div`
    height:100vh;
    width: 100vw;
    padding:20px;
    display:flex;
    flex-direction: column;
    align-items:center ;
    .allNotes {
        margin-top: 20px;
        padding:20px;
        border:1px solid red;
        border-radius:4px;
        width: 100%;
        height:100%;
        position: relative;
    }

`

const IndividualNote= styled.div`
       margin:5px;
        padding:5px;
        border:.5px solid black;
        border-radius:4px;
        width: fit-content;
        max-width: 200px;
        max-height: 200px;
        overflow: auto;
        display: flex;
        gap:5px;
        user-select: none;
        cursor: move;
        background-color:lightyellow;
        position: absolute;
        left:${props=>props.posX}px;
        top:${props=>props.posY}px;

        button {
            padding:5px;
            background: transparent;
        }
    
`
const maxX=window.innerWidth-250;
const maxY=window.innerHeight-250
const StickyNotes=()=>{
    const [allStickyNotes, setAllStickyNotes]=useState([])
    const [focusedNote,setFocusedNote]=useState({id:null, value:'', newNote:true})

    useEffect(()=>{
        const savedStickyNotes=getFromLocalStorage('stickyNotes') || []
        setAllStickyNotes(savedStickyNotes)
    },[])

    const modifyStickyNotesList =(newNote, noteId, noteContent)=>{
        let modifiedStickyNotes=[...allStickyNotes]
        const newNoteContents={
            id:noteId,
            value:noteContent,
            posX:Math.floor(Math.random()*maxX),
            posY:Math.floor(Math.random()*maxY)
        }
        if(newNote){
            modifiedStickyNotes.push(newNoteContents)
        }else {
            
            const reqIndex=allStickyNotes.indexOf(item=>item.id===noteId)
            modifiedStickyNotes.splice(reqIndex,1,newNoteContents)
        }

        setAllStickyNotes(modifiedStickyNotes)
        saveToLocalStorage('stickyNotes', modifiedStickyNotes)
        setFocusedNote({id:null, value:'', newNote:true})
    }

    const removeStickyNote=(e)=>{
        const noteId=e.currentTarget.dataset.id
        const modifiedStickyNotes=[...allStickyNotes]
        const reqIndex=modifiedStickyNotes.findIndex(item=>item.id===noteId)
        modifiedStickyNotes.splice(reqIndex,1)
        saveToLocalStorage('stickyNotes', modifiedStickyNotes)
        setAllStickyNotes(modifiedStickyNotes)
    }

    const editStickyNote=(e)=>{
        const noteId=e.target.dataset.id
        const currentNote=allStickyNotes.find(note=>note.id===noteId)
        setFocusedNote({newNote:false, id:currentNote.id, value:currentNote.value})
    }

    return <Container>
        <AddUpdate newNote={focusedNote.newNote} noteId={focusedNote.id} noteValue={focusedNote.value} modifyStickyNotesList={modifyStickyNotesList}/>
        <div className="allNotes">
            {
                allStickyNotes.map(note=><IndividualNote posX={note.posX} posY={note.posY} className="individualStickyNote" key={note.id}>📌<span>{note.value}</span><button data-id={note.id} onClick={editStickyNote}>/</button><button data-id={note.id} onClick={removeStickyNote}>X</button></IndividualNote>)
            }
        </div>
    </Container>
}

export default StickyNotes