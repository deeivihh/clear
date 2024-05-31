import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { openGame, translateText } from "../Globals";
import { Close, Play, Settings } from "../components/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
} from "../Globals";

export function GamePopUp() {
  const globalContext = useContext(GlobalContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <dialog
      data-gamePopup
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266]  bg-[#d1d1d166]"
      onDragStart={(e) => {
        e.preventDefault();
      }}>
      <Show when={selectedDataContext.selectedGame()}>
        <div className="flex flex-col items-center justify-center w-screen h-screen px-[40px]">
          <img
            src={convertFileSrc(
              applicationStateContext.appDataDirPath() +
                "heroes\\" +
                selectedDataContext.selectedGame().heroImage,
            )}
            alt=""
            className={`max-large:h-[270px] h-[350px] rounded-[${
              globalContext.libraryData.userSettings.roundedBorders
                ? "6px"
                : "0px"
            }] absolute blur-[80px] opacity-[0.4] -z-10`}
          />
          <div
            className="relative"
            ref={(ref) => {
              const focusableElements = ref.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
              );
              const firstElement = focusableElements[0];
              const lastElement =
                focusableElements[focusableElements.length - 1];

              function handleTab(e) {
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
            }}>
            <div className="absolute bottom-[30px] right-[30px] flex gap-[15px]">
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  openGame(selectedDataContext.selectedGame().location);
                }}>
                <div className="!w-max">{translateText("play")}</div>
                <Play />
              </button>
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  document.querySelector("[data-gamePopup]").close();
                  document.querySelector("[data-editGameModal]").show();
                }}>
                <Settings />
              </button>
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  document.querySelector("[data-gamePopup]").close();
                }}>
                <Close />
              </button>
            </div>
            <Show when={selectedDataContext.selectedGame().heroImage}>
              <img
                src={convertFileSrc(
                  applicationStateContext.appDataDirPath() +
                    "heroes\\" +
                    selectedDataContext.selectedGame().heroImage,
                )}
                alt=""
                className={`max-large:h-[270px] h-[350px] aspect-[96/31]  rounded-[${
                  globalContext.libraryData.userSettings.roundedBorders
                    ? "6px"
                    : "0px"
                }]`}
              />
            </Show>
            <Show when={!selectedDataContext.selectedGame().heroImage}>
              <div
                className={`max-large:h-[270px] h-[350px] aspect-[96/31] bg-[#f1f1f1] dark:bg-[#1c1c1c]  rounded-[${
                  globalContext.libraryData.userSettings.roundedBorders
                    ? "6px"
                    : "0px"
                }]`}
              />
            </Show>

            <div className="absolute max-large:bottom-[15px] bottom-[30px] left-[25px] h-[70px] w-[300px] items-center flex align-middle">
              <Show when={selectedDataContext.selectedGame().logo}>
                <img
                  src={convertFileSrc(
                    applicationStateContext.appDataDirPath() +
                      "logos\\" +
                      selectedDataContext.selectedGame().logo,
                  )}
                  alt=""
                  className=" relative aspect-auto max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                />
              </Show>
              <Show when={!selectedDataContext.selectedGame().logo}>
                <div
                  className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] absolute bottom-[5px] bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                    globalContext.libraryData.userSettings.roundedBorders
                      ? "6px"
                      : "0px"
                  }]`}
                />
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </dialog>
  );
}
