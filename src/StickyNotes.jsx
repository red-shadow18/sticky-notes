import React, { createRef, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import AddUpdate from "./Components/AddUpdate";
import { getFromLocalStorage, saveToLocalStorage } from "./utils";

const maxX = window.innerWidth - 250;
const maxY = window.innerHeight - 250;
const StickyNotes = () => {
  const [allStickyNotes, setAllStickyNotes] = useState([]);
  const [focusedNote, setFocusedNote] = useState({
    id: null,
    value: "",
    newNote: true,
    posX: null,
    posY: null,
  });

  useEffect(() => {
    const savedStickyNotes = getFromLocalStorage("stickyNotes") || [];
    setAllStickyNotes(savedStickyNotes);
  }, []);

  const stickyNotesRef = useRef({});

  const modifyStickyNotesList = (newNote, noteId, noteContent, posX, posY) => {
    let modifiedStickyNotes = [...allStickyNotes];
    const newNoteContents = {
      id: noteId,
      value: noteContent,
      posX: posX || Math.floor(Math.random() * maxX),
      posY: posY || Math.floor(Math.random() * maxY),
    };
    if (newNote) {
      modifiedStickyNotes.push(newNoteContents);
    } else {
      const reqIndex = allStickyNotes.findIndex((item) => item.id === noteId);
      if (reqIndex > -1) {
        modifiedStickyNotes.splice(reqIndex, 1, newNoteContents);
      }
    }

    setAllStickyNotes(modifiedStickyNotes);
    saveToLocalStorage("stickyNotes", modifiedStickyNotes);
    setFocusedNote({ id: null, value: "", newNote: true });
  };

  const removeStickyNote = (e) => {
    const noteId = e.currentTarget.dataset.id;
    const modifiedStickyNotes = [...allStickyNotes];
    const reqIndex = modifiedStickyNotes.findIndex(
      (item) => item.id === noteId
    );
    modifiedStickyNotes.splice(reqIndex, 1);
    saveToLocalStorage("stickyNotes", modifiedStickyNotes);
    setAllStickyNotes(modifiedStickyNotes);
  };

  const editStickyNote = (e) => {
    const noteId = e.target.dataset.id;
    const currentNote = allStickyNotes.find((note) => note.id === noteId);
    if (!currentNote) return;
    setFocusedNote({
      newNote: false,
      id: currentNote.id,
      value: currentNote.value,
      posX: currentNote.posX,
      posY: currentNote.posY,
    });
  };

  const handleMouseDown = (note, e) => {
    const { id, posX, posY } = note;
    const currentNoteRef = stickyNotesRef.current[id].current;

    //determinig current posaiton of the note wrt to the viewport
    const rect = currentNoteRef.getBoundingClientRect();
    //determing cuurent mouse position
    const mousePos = { x: e.clientX, y: e.clientY };

    //calculating distance bw mose position and notes left corner
    const offset = {
      x: mousePos.x - rect.left,
      y: mousePos.y - rect.top,
    };

    const parentRect = currentNoteRef.parentElement.getBoundingClientRect();

    const handleMouseMove = (e) => {
      let newX = Math.max(
        0,
        Math.min(e.clientX - offset.x, parentRect.width - rect.width - 10)
      );
      let newY = Math.max(
        0,
        Math.min(e.clientY - offset.y, parentRect.height - rect.height - 10)
      );

      currentNoteRef.style.left = `${newX}px`;
      currentNoteRef.style.top = `${newY}px`;
    };

    const handleMouseUp = (e) => {
      let finalX = Math.max(
        0,
        Math.min(e.clientX - offset.x, parentRect.width - rect.width - 10)
      );
      let finalY = Math.max(
        0,
        Math.min(e.clientY - offset.y, parentRect.height - rect.height - 10)
      );
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      updateNotePosition(id, finalX, finalY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateNotePosition = (id, newX, newY) => {
    const newStickyNotes = allStickyNotes.map((note) =>
      note.id === id ? { ...note, posX: newX, posY: newY } : { ...note }
    );
    setAllStickyNotes(newStickyNotes);
    saveToLocalStorage("stickyNotes", newStickyNotes);
  };

  return (
    <Container>
      <AddUpdate
        newNote={focusedNote.newNote}
        noteId={focusedNote.id}
        noteValue={focusedNote.value}
        posX={focusedNote.posX}
        posY={focusedNote.posY}
        modifyStickyNotesList={modifyStickyNotesList}
      />
      <div className="allNotes">
        {allStickyNotes.map((note) => (
          <IndividualNote
            onMouseDown={(e) => handleMouseDown(note, e)}
            ref={
              stickyNotesRef.current[note.id]
                ? stickyNotesRef.current[note.id]
                : (stickyNotesRef.current[note.id] = createRef())
            }
            posX={note.posX}
            posY={note.posY}
            className="individualStickyNote"
            key={note.id}
          >
            📌<span>{note.value}</span>
            <button data-id={note.id} onClick={editStickyNote}>
              /
            </button>
            <button data-id={note.id} onClick={removeStickyNote}>
              X
            </button>
          </IndividualNote>
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
  user-select: none;
  cursor: move;
  background-color: lightyellow;
  position: absolute;
  left: ${(props) => props.posX}px;
  top: ${(props) => props.posY}px;

  button {
    padding: 5px;
    background: transparent;
  }
`;
