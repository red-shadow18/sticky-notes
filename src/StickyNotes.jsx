import React,{useState

} from "react";
import styled from '@emotion/styled'
import AddUpdate from "./Components/AddUpdate";

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
    }

    .individualStickyNote {
        margin:5px;
        padding:5px;
        border:.5px solid black;
        border-radius:4px;
        width: fit-content;
        display: flex;
        gap:5px;

        button {
            padding:5px;
        }
        
    }
`
const StickyNotes=()=>{
    const [allStickyNotes, setAllStickyNotes]=useState([])
    const [focusedNote,setFocusedNote]=useState({id:null, value:'', newNote:true})

    const modifyStickyNotesList =(newNote, noteId, noteContent)=>{
        let modifiedStickyNotes=[...allStickyNotes]
        const newNoteContents={
            id:noteId,
            value:noteContent,
            posX:'',
            posY:''
        }
        if(newNote){
            modifiedStickyNotes.push(newNoteContents)
        }else {
            
            const reqIndex=allStickyNotes.indexOf(item=>item.id===noteId)
            modifiedStickyNotes.splice(reqIndex,1,newNoteContents)
        }

        setAllStickyNotes(modifiedStickyNotes)
        setFocusedNote({id:null, value:'', newNote:true})
    }

    const removeStickyNote=(e)=>{
        const noteId=e.currentTarget.dataset.id
        const modifiedStickyNotes=[...allStickyNotes]
        const reqIndex=modifiedStickyNotes.findIndex(item=>item.id===noteId)
        modifiedStickyNotes.splice(reqIndex,1)
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
                allStickyNotes.map(note=><div className="individualStickyNote" key={note.id}><span>{note.value}</span><button data-id={note.id} onClick={editStickyNote}>/</button><button data-id={note.id} onClick={removeStickyNote}>X</button></div>)
            }
        </div>
    </Container>
}

export default StickyNotes