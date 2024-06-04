import { Show, useContext } from "solid-js";
import { produce } from "solid-js/store";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close, SaveDisk } from "../libraries/Icons";

import {
  GlobalContext,
  ApplicationStateContext,
  DataEntryContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function NewFolder() {
  const globalContext = useContext(GlobalContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  async function addFolder() {
    if (
      dataEntryContext.folderName() == "" ||
      dataEntryContext.folderName() == undefined
    ) {
      triggerToast(translateText("no folder name"));
      return;
    }

    let folderNameAlreadyExists = false;

    Object.keys(globalContext.libraryData.folders).forEach((folderName) => {
      if (dataEntryContext.folderName() == folderName) {
        folderNameAlreadyExists = true;
      }
    });

    if (folderNameAlreadyExists) {
      triggerToast(
        dataEntryContext.folderName() +
          " " +
          translateText("is already in your library"),
      );
      return;
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[dataEntryContext.folderName()] = {
          name: dataEntryContext.folderName(),
          hide: dataEntryContext.hideFolder(),
          games: [],
          index: applicationStateContext.currentFolders().length,
        };

        return data;
      }),
    );

    await updateData();
    getData();
    closeDialog("newFolderModal");
  }

  return (
    <dialog
      data-newFolderModal
      onClose={() => {
        dataEntryContext.setFolderName(undefined);
        dataEntryContext.setHideFolder(undefined);
        getData();
      }}
      ref={(ref) => {
        closeDialog("newFolderModal", ref);

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
      className="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] dark:bg-[#12121266]">
      <div className="flex h-screen w-screen items-center justify-center align-middle ">
        <div className="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            className={`flex justify-between ${
              globalContext.libraryData.userSettings.language != "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p className="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                {translateText("add new folder")}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  dataEntryContext.setHideFolder((x) => !x);
                }}
                className="relative cursor-pointer">
                <Show
                  when={dataEntryContext.hideFolder()}
                  fallback={
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                  }>
                  <div className="relative">
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                    <div className="absolute inset-0 opacity-70 blur-[5px]">
                      {translateText("hide in expanded view")}
                    </div>
                  </div>
                </Show>
              </button>
              <button
                onClick={addFolder}
                className="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                {translateText("save")}
                <SaveDisk />
              </button>
              <button
                className="standardButton flex !w-max items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                onClick={() => {
                  closeDialog("newFolderModal");
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-6">
            <input
              aria-autocomplete="none"
              type="text"
              name=""
              id=""
              className="w-full bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                dataEntryContext.setFolderName(e.currentTarget.value);
              }}
              value={dataEntryContext.folderName() || ""}
              placeholder={translateText("name of folder")}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
