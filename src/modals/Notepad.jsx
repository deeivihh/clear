import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { libraryData, setNotepadValue, notepadValue } from "../Signals";

import { getData } from "../App";

export function Notepad() {
  async function saveNotepad() {
    libraryData().notepad = notepadValue();

    await writeTextFile(
      {
        path: "lib.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
    });
  }

  setTimeout(() => {
    setNotepadValue(libraryData().notepad || "");
  }, 50);

  return (
    <>
      <dialog
        data-notepadModal
        onClose={() => {
          setNotepadValue(libraryData().notepad || "");
        }}
        className="">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div className="modalWindow w-[50%]  rounded-[6px] p-6">
            <div className="flex justify-between">
              <div>
                <h1>notepad</h1>
              </div>

              <button
                className="flex items-center functionalInteractables"
                onClick={() => {
                  document.querySelector("[data-notepadModal]").close();
                  getData();
                }}>
                ​
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L11 10.3369M1 10.3369L11 1"
                    stroke="#FF3636"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <textarea
              onInput={(e) => {
                setNotepadValue(e.target.value);
                saveNotepad();
              }}
              className="w-full h-[40vh] mt-6 bg-transparent rounded-[6px] focus:outline-none resize-none"
              placeholder="write anything you want over here!"
              spellcheck="false"
              value={notepadValue()}></textarea>
          </div>
        </div>
      </dialog>
    </>
  );
}