import axios from "axios";

 const saveStickyNote=(stickyNoteData, updateStickyNotesFunction)=>{
    axios.post("http://localhost:8081/api/saveNewStickyNote",{...stickyNoteData}).then((response)=>{
        updateStickyNotesFunction(response.data.updatedStickyNotes)
    })
}

const deleteStickyNote=(id,postSuccessfullDeleteFunction)=>{
    axios.delete(`http://localhost:8081/api/delete/${id}`).then((response)=>{
        postSuccessfullDeleteFunction(response.data.updatedStickyNotes)
    })
}


 const getAllStickyNotes=(postSuccessfullfetchFunction)=>{
    axios.get("http://localhost:8081/api/getAllStickyNotes").then((response)=>{
        postSuccessfullfetchFunction(response.data.allStickyNotes)
    })
}

const updateStickyNote=(id,updatedNote,postSuccesfullUpdateFunction)=>{
    axios.put("http://localhost:8081/api/updateStickyNote",{...updatedNote}).then(response=>{
        postSuccesfullUpdateFunction(response.data.updatedStickyNotes)
    })
}


export  {saveStickyNote, deleteStickyNote, getAllStickyNotes, updateStickyNote}