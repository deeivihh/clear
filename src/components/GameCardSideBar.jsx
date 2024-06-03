import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { openDialog, openGame, translateText } from "../Globals";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
} from "../Globals";

export function GameCardSideBar(props) {
  const globalContext = useContext(GlobalContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <button
      className={`!flex gap-[5px] bg-transparent ${
        props.index == 0 ? "mt-4" : "mt-5"
      }  sideBarGame cursor-grab p-0`}
      aria-label={translateText("play")}
      draggable={true}
      onDragStart={(e) => {
        setTimeout(() => {
          e.srcElement.classList.add("dragging");
        }, 10);
        e.dataTransfer.setData("gameName", props.gameName);

        e.dataTransfer.setData("oldFolderName", props.folderName);
      }}
      onDragEnd={(e) => {
        e.srcElement.classList.remove("dragging");
      }}
      onClick={async (e) => {
        await selectedDataContext.setSelectedGame(
          globalContext.libraryData.games[props.gameName],
        );
        openDialog("gamePopup");

        if (e.ctrlKey) {
          openGame(globalContext.libraryData.games[props.gameName].location);
        }
      }}>
      <Show when={globalContext.libraryData.games[props.gameName].icon}>
        <img
          src={convertFileSrc(
            applicationStateContext.appDataDirPath() +
              "icons\\" +
              globalContext.libraryData.games[props.gameName].icon,
          )}
          alt=""
          className="h-[16px] aspect-square"
        />
      </Show>
      <span className="text-[#00000080] dark:text-[#ffffff80] active:dark:text-[#ffffff3a] active:text-[#0000003a]">
        {props.gameName}
      </span>
    </button>
  );
}
