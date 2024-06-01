import { useContext } from "solid-js";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close } from "../components/Icons";

import { GlobalContext, DataEntryContext } from "../Globals";

export function Notepad() {
  const globalContext = useContext(GlobalContext);
  const dataEntryContext = useContext(DataEntryContext);

  async function saveNotepad() {
    globalContext.setLibraryData("notepad", dataEntryContext.notepadValue());
    await updateData();
  }

  setTimeout(() => {
    dataEntryContext.setNotepadValue(globalContext.libraryData.notepad || "");
  }, 50);

  return (
    <>
      <dialog
        data-notepadModal
        onClose={() => {
          dataEntryContext.setNotepadValue(
            globalContext.libraryData.notepad || "",
          );
        }}
        ref={(ref) => {
          closeDialog("notepadModal", ref);

          function handleTab(e) {
            const focusableElements = ref.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === "Tab") {
              if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                  e.preventDefault();
                  lastElement.focus();
                }
              } else {
                if (document.activeElement === lastElement) {
                  e.preventDefault();
                  firstElement.focus();
                }
              }
            }
          }

          ref.addEventListener("keydown", handleTab);

          ref.addEventListener("close", () => {
            previouslyFocusedElement.focus();
          });
        }}
        className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div className="border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] w-[50%] p-6">
            <div className="flex justify-between">
              <div>
                <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                  {translateText("notepad")}
                </p>
              </div>

              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  closeDialog("notepadModal");
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>
            <textarea
              onInput={(e) => {
                dataEntryContext.setNotepadValue(e.target.value);
                saveNotepad();
              }}
              className="w-full h-[40vh] mt-6 bg-transparent rounded-[6px] focus:outline-none resize-none"
              placeholder={translateText("write anything you want over here!")}
              spellcheck="false"
              value={dataEntryContext.notepadValue()}></textarea>
          </div>
        </div>
      </dialog>
    </>
  );
}
