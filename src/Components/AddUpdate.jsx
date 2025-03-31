import React,{useEffect, useState} from "react";
import styled from "@emotion/styled";

const ADContainer=styled.div`
display:flex;
gap:20px;

input {
    border-radius: 4px;;
}
    
`

const AddUpdate=({newNote=true, noteId=null,noteValue='', modifyStickyNotesList, posX=null, posY=null})=>{
    const [stickyNoteValue, setStickynoteValue]=useState('')

    useEffect(()=>{
        setStickynoteValue(noteValue)
    },[noteValue])

    const handleValueUpdate=(e)=>{
        const {value} =e.target
        setStickynoteValue(value)
    }

    const handleClick=()=>{
        const updatedNoteId= noteId || crypto.randomUUID()
        modifyStickyNotesList(newNote,updatedNoteId,stickyNoteValue,posX,posY)
        setStickynoteValue('')
    }

    return <ADContainer>
        <input value={stickyNoteValue} onChange={handleValueUpdate}></input>
        <button onClick={handleClick} disabled={stickyNoteValue==''}>{newNote?"Add":"Update"}</button>
    </ADContainer>
}

export default AddUpdate
