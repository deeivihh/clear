import { produce } from "solid-js/store";
import { Switch, useContext, Match, Show } from "solid-js";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close, SaveDisk, TrashDelete } from "../libraries/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  DataUpdateContext,
  UIContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function EditFolder() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const dataUpdateContext = useContext(DataUpdateContext);

  async function editFolder() {
    if (dataUpdateContext.editedFolderName() === "") {
      triggerToast(translateText("no folder name"));
      return;
    }

    if (
      selectedDataContext.selectedFolder().name !==
      dataUpdateContext.editedFolderName()
    ) {
      let folderNameAlreadyExists = false;

      for (const folderName of Object.keys(globalContext.libraryData.folders)) {
        if (dataUpdateContext.editedFolderName() === folderName) {
          folderNameAlreadyExists = true;
        }
      }

      if (folderNameAlreadyExists) {
        triggerToast(
          `${dataUpdateContext.editedFolderName()} ${translateText(
            "is already in your library"
          )}`
        );
        return;
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      })
    );

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[dataUpdateContext.editedFolderName()] = {
          ...selectedDataContext.selectedFolder(),
          name: dataUpdateContext.editedFolderName(),
          hide: dataUpdateContext.editedHideFolder(),
        };

        return data;
      })
    );

    await updateData();

    closeDialog("editFolderModal");
  }

  async function deleteFolder() {
    for (
      let x = 0;
      x < Object.keys(globalContext.libraryData.folders).length;
      x++
    ) {
      if (
        x >
        globalContext.libraryData.folders[
          selectedDataContext.selectedFolder().name
        ].index
      ) {
        globalContext.setLibraryData(
          produce((data) => {
            Object.values(data.folders)[x].index -= 1;

            return data;
          })
        );
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      })
    );

    await updateData();
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {
        getData();
      }}
      ref={(ref) => {
        closeDialog("editFolderModal", ref);

        function handleTab(e) {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
      }}
      class="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] dark:bg-[#12121266]">
      <div class="flex h-screen w-screen items-center justify-center align-middle ">
        <div class="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${
              globalContext.libraryData.userSettings.language !== "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                {translateText("edit")}{" "}
                {selectedDataContext.selectedFolder().name}
              </p>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  if (dataUpdateContext.editedHideFolder() === undefined) {
                    dataUpdateContext.setEditedHideFolder(
                      !selectedDataContext.selectedGame().hide
                    );
                  } else {
                    dataUpdateContext.setEditedHideFolder(
                      !dataUpdateContext.editedHideFolder()
                    );
                  }
                }}
                class="relative cursor-pointer">
                <Switch>
                  <Match
                    when={dataUpdateContext.editedHideFolder() === undefined}>
                    <Show
                      when={selectedDataContext.selectedFolder().hide}
                      fallback={
                        <div class="">
                          {translateText("hide in expanded view")}
                        </div>
                      }>
                      <div class="relative">
                        <div class="">
                          {translateText("hide in expanded view")}
                        </div>
                        <div class="absolute inset-0 opacity-70 blur-[5px]">
                          {translateText("hide in expanded view")}
                        </div>
                      </div>
                    </Show>
                  </Match>

                  <Match when={dataUpdateContext.editedHideFolder() === true}>
                    <div class="relative">
                      <div class="">
                        {translateText("hide in expanded view")}
                      </div>
                      <div class="absolute inset-0 opacity-70 blur-[5px]">
                        {translateText("hide in expanded view")}
                      </div>
                    </div>
                  </Match>

                  <Match when={dataUpdateContext.editedHideFolder() === false}>
                    <div class="">{translateText("hide in expanded view")}</div>
                  </Match>
                </Switch>
              </button>

              <button
                type="button"
                onClick={editFolder}
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                type="button"
                onClick={() => {
                  uiContext.showDeleteConfirm()
                    ? deleteFolder()
                    : uiContext.setShowDeleteConfirm(true);

                  setTimeout(() => {
                    uiContext.setShowDeleteConfirm(false);
                  }, 1500);
                }}
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                <span class="text-[#FF3636]">
                  {uiContext.showDeleteConfirm()
                    ? translateText("confirm?")
                    : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                type="button"
                class="standardButton flex !w-max !h-full items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
                onClick={() => {
                  closeDialog("editFolderModal");
                  getData();
                }}
                data-tooltiptext="close">
                <Close />
              </button>
            </div>
          </div>

          <div class="mt-6 flex items-end gap-6">
            <input
              aria-autocomplete="none"
              type="text"
              name=""
              id=""
              class="w-full bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                dataUpdateContext.setEditedFolderName(e.currentTarget.value);
              }}
              placeholder={translateText("name of folder")}
              value={selectedDataContext.selectedFolder().name}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
