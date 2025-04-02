import axios from "axios";

const API_BASE_URL="http://localhost:8081"
const API_PROD_BASE_URL="https://sticky-notes-am-be-production.up.railway.app"

const api=axios.create({
    baseURL:API_PROD_BASE_URL
})

 const saveStickyNote=(stickyNoteData, updateStickyNotesFunction)=>{
    api.post("/api/saveNewStickyNote",{...stickyNoteData}).then((response)=>{
        updateStickyNotesFunction(response.data.updatedStickyNotes)
    })
}

const deleteStickyNote=(id,postSuccessfullDeleteFunction)=>{
    api.delete(`/api/delete/${id}`).then((response)=>{
        postSuccessfullDeleteFunction(response.data.updatedStickyNotes)
    })
}


 const getAllStickyNotes=(postSuccessfullfetchFunction)=>{
    api.get("/api/getAllStickyNotes").then((response)=>{
        postSuccessfullfetchFunction(response.data.allStickyNotes)
    }).catch(error => {
        console.error("Error:", error.response?.status, error.response?.data);
    });
}

const updateStickyNote=(id,updatedNote,postSuccesfullUpdateFunction)=>{
    api.put("/api/updateStickyNote",{...updatedNote}).then(response=>{
        postSuccesfullUpdateFunction(response.data.updatedStickyNotes)
    })
}


export  {saveStickyNote, deleteStickyNote, getAllStickyNotes, updateStickyNote}