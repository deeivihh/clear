// importing globals
import {
  GlobalContext,
  ApplicationStateContext,
  UIContext,
  getData,
  importSteamGames,
  translateText,
  updateData,
  openDialog,
  triggerToast,
  toggleSideBar,
  closeDialogImmediately,
  checkIfConnectedToInternet,
} from "./Globals";

// importing components
import { SideBar } from "./SideBar";
import { EditFolder } from "./modals/EditFolder";
import { EditGame } from "./modals/EditGame";
import { GamePopUp } from "./modals/GamePopUp";
import { NewFolder } from "./modals/NewFolder";
import { NewGame } from "./modals/NewGame";
import { Notepad } from "./modals/Notepad";
import { Settings } from "./modals/Settings";
import { Loading } from "./modals/Loading";
import { ChevronArrows, EmptyTray, Steam } from "./libraries/Icons";
import { GameCards } from "./components/GameCards";
import { LanguageSelector } from "./components/LanguageSelector";
import { Hotkeys } from "./components/Hotkeys";

// importing code snippets and library functions
import { For, Show, onMount, useContext, Switch, Match, createEffect } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { fuzzysearch } from "./libraries/fuzzysearch";

// importing style related files
import "./App.css";

function App() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  // setting up effects for styles that can be changed in settings
  createEffect(() => {
    document.body.style.setProperty(
      "--text-color",
      globalContext.libraryData.userSettings.currentTheme === "light" ? "#000000" : "#ffffff",
    );
  });

  createEffect(() => {
    let fontFamily;
    switch (globalContext.libraryData.userSettings.fontName) {
      case "sans serif":
        fontFamily = "Helvetica, Arial, sans-serif";
        break;
      case "serif":
        fontFamily = "Times New Roman";
        break;
      case "mono":
        fontFamily = "IBM Plex Mono, Consolas";
        break;
    }
    document.body.style.setProperty("--font-family", fontFamily);
  });

  createEffect(() => {
    document.body.style.setProperty(
      "--border-radius",
      globalContext.libraryData.userSettings.roundedBorders ? "6px" : "0px",
    );
  });

  createEffect(() => {
    document.body.style.setProperty(
      "--outline-color",
      globalContext.libraryData.userSettings.currentTheme === "light" ? "#000000" : "#ffffff",
    );
  });

  async function closeApp() {
    invoke("close_app");
  }

  function addEventListeners() {
    // adds user-is-tabbing to body whenever tab is used
    // used for changing tooltip delay
    function handleFirstTab(e) {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDown);
        uiContext.setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
      }
    }
    function handleMouseDown() {
      document.body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDown);
      window.addEventListener("keydown", handleFirstTab);
      uiContext.setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
    }
    window.addEventListener("keydown", handleFirstTab);

    // disabling right click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // storing window width in application state context
    window.addEventListener("resize", () => {
      applicationStateContext.setWindowWidth(window.innerWidth);
    });

    // keyboard handling
    document.addEventListener("keydown", (e) => {
      const allDialogs = document.querySelectorAll("dialog");
      let anyDialogOpen = false;
      let currentlyOpenDialog;

      // checks if any dialogs are open
      for (const dialog of allDialogs) {
        if (dialog.open) {
          anyDialogOpen = true;
          currentlyOpenDialog = dialog;
        }
      }

      // if currently open dialog does not contain data that needs confirmation before being dismissed, close immediately upon escape
      if (e.key === "Escape") {
        e.preventDefault();
        if (anyDialogOpen) {
          if (
            !["newGame", "editGame", "newFolder", "editFolder"].includes(currentlyOpenDialog.getAttribute("data-modal"))
          ) {
            closeDialogImmediately(currentlyOpenDialog);
          }
        }
      }

      // modifier key is ctrl for windows / if on mac, it changes to meta key (cmd)
      const modifierKeyPrefix = applicationStateContext.systemPlatform() === "windows" ? "ctrlKey" : "metaKey";

      // if ctrl/cmd key is held down
      if (e[modifierKeyPrefix]) {
        // "play" tooltip added to sidebar game and game card if user is also hovering on a specific element
        for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
          sideBarGame.classList.add("tooltip-right");
          sideBarGame.style.cursor = "pointer";
        }
        for (const gameCard of document.querySelectorAll(".gameCard")) {
          gameCard.classList.add("tooltip-center");
        }

        // if ctrl/cmd + another key held down
        switch (e.code) {
          // increase game card zoom level
          case "Equal":
            globalContext.setLibraryData("userSettings", "zoomLevel", (zoomLevel) => {
              return zoomLevel !== 2 ? zoomLevel + 1 : 2;
            });
            updateData();
            break;

          // decrease game card zoom level
          case "Minus":
            globalContext.setLibraryData("userSettings", "zoomLevel", (zoomLevel) => {
              return zoomLevel !== 0 ? zoomLevel - 1 : 0;
            });
            updateData();
            break;

          // close the app
          case "KeyW":
            e.preventDefault();
            closeApp();
            break;

          // focuses game search bar
          case "KeyF":
            if (!anyDialogOpen) {
              e.preventDefault();
              document.querySelector("#searchInput").focus();
            } else {
              triggerToast(translateText("close current dialog before opening another"));
            }
            break;

          // opens new game modal
          case "KeyN":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("newGame");
            } else {
              if (!uiContext.showNewGameModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens new folder modal
          case "KeyM":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("newFolder");
            } else {
              if (!uiContext.showNewFolderModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens notepad modal
          case "KeyL":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("notepad");
            } else {
              if (!uiContext.showNotepadModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens settings modal
          case "Comma":
            if (!anyDialogOpen) {
              e.preventDefault();
              openDialog("settings");
            } else {
              if (!uiContext.showSettingsModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // toggles sidebar
          case "Backslash":
            if (!anyDialogOpen) {
              e.preventDefault();
              toggleSideBar();
              document.querySelector("#searchInput").blur();
            } else {
              triggerToast(translateText("close current dialog before toggling sidebar"));
            }
            break;

          // disabling misc webview shortcuts
          case "KeyR":
          case "KeyG":
          case "KeyP":
          case "KeyU":
            e.preventDefault();
            break;
        }
      }
    });
  }

  document.addEventListener("keyup", () => {
    // resets sidebar cursor back to grab when ctrl/cmd is let go of
    for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
      sideBarGame.style.cursor = "grab";
    }

    // hides "play" tooltip from sidebar game / game card when ctrl/cmd is let go of
    for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
      sideBarGame.classList.remove("tooltip-right");
    }
    for (const gameCard of document.querySelectorAll(".gameCard")) {
      gameCard.classList.remove("tooltip-center");
    }
  });

  onMount(async () => {
    // fetches library data and populates the ui
    getData();

    // loading app by default in dark mode so there's no bright flash of white while getData fetches preferences
    document.documentElement.classList.add("dark");

    // only shows the window after the ui has been rendered
    invoke("show_window");

    addEventListeners();
    applicationStateContext.setSystemPlatform(await invoke("get_platform"));

    if (await checkIfConnectedToInternet()) {
      try {
        // checks latest version and stores it in variable
        const response = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?version=a`);
        const clearVersion = await response.json();
        applicationStateContext.setLatestVersion(clearVersion.clearVersion);

        // shows new version indicators if update is available
        applicationStateContext.latestVersion().replaceAll(".", "") >
          applicationStateContext.appVersion().replaceAll(".", "")
          ? uiContext.setShowNewVersionAvailable(true)
          : uiContext.setShowNewVersionAvailable(false);
      } catch (error) {
        triggerToast(`could not check if newer version available: ${error.message.toLowerCase()}`);
      }
    }
  });

  return (
    <>
      {/* fading out bg color to make the app loading look a bit more smoother */}
      <div class="loading pointer-events-none absolute z-[1000] flex h-screen w-screen items-center justify-center bg-[#121212]">
        <p class="" />
      </div>

      <div class="flex h-full gap-[30px] overflow-y-hidden">
        <Show
          when={
            globalContext.libraryData.userSettings.showSideBar === false &&
            applicationStateContext.windowWidth() >= 1000
          }
        >
          <button
            type="button"
            class="!absolute right-[31px] top-[32px] z-20 w-[25.25px] cursor-pointer p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323] tooltip-delayed-left"
            onClick={() => {
              toggleSideBar();
            }}
            data-tooltip={translateText("open sidebar")}
          >
            <ChevronArrows class="rotate-180" />
          </button>
        </Show>
        <Show
          when={globalContext.libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000}
        >
          <SideBar />
        </Show>

        <Show
          when={
            JSON.stringify(globalContext.libraryData.folders) === "{}" &&
            (applicationStateContext.searchValue() === "" || applicationStateContext.searchValue() === undefined)
          }
        >
          <div
            class={`absolute flex h-[100vh] w-full flex-col items-center justify-center overflow-y-scroll py-[20px] pr-[30px]
              ${globalContext.libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000
                ? "pl-[23%] large:pl-[17%]"
                : "pl-[30px] large:pl-[30px]"
              }`}
          >
            <div class="!z-50">
              <p class="text-[#000000] dark:text-[#ffffff80]">
                {translateText("hey there! thank you so much for using clear")}
                <br />
                <br />- {translateText("add some new games using the sidebar buttons")}
                <br />
                <br />- {translateText("create new folders and drag and drop your games into them")}
                <br />
                <br />- {translateText("don't forget to check out the settings!")}
              </p>

              <div class="mt-[35px] flex gap-6">
                <button
                  type="button"
                  class="standardButton tooltip-bottom !flex !w-max !gap-3 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                  data-tooltip={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (globalContext.libraryData.folders.steam !== undefined) {
                      uiContext.showImportAndOverwriteConfirm()
                        ? importSteamGames()
                        : uiContext.setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        uiContext.setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}
                >
                  <Show
                    when={globalContext.libraryData.folders.steam !== undefined}
                    fallback={translateText("import Steam games")}
                  >
                    <Show
                      when={uiContext.showImportAndOverwriteConfirm() === true}
                      fallback={translateText("import Steam games")}
                    >
                      <span class="text-[#FF3636]">
                        {translateText("current 'steam' folder will be overwritten. confirm?")}
                      </span>
                    </Show>
                  </Show>

                  <Steam />
                </button>

                <LanguageSelector onSettingsPage={false} />
              </div>

              <Hotkeys onSettingsPage={false} />
            </div>
          </div>
        </Show>
        <div
          class={`absolute h-[100vh] w-full overflow-y-scroll !rounded-[0px] py-[20px] pr-[30px]
            ${globalContext.libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000
              ? "pl-[23%] large:pl-[17%]"
              : "pl-[30px] large:pl-[30px]"
            }`}
        >
          <Show
            when={applicationStateContext.searchValue() === "" || applicationStateContext.searchValue() === undefined}
          >
            <For each={applicationStateContext.currentFolders()}>
              {(folderName) => {
                const folder = globalContext.libraryData.folders[folderName];

                return (
                  <Show when={folder.games !== "" && !folder.hide}>
                    <div class="mb-[40px]">
                      <Show when={globalContext.libraryData.userSettings.folderTitle}>
                        <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">{folder.name}</p>
                      </Show>
                      <div
                        class={`foldersDiv mt-4 grid gap-5
                          ${globalContext.libraryData.userSettings.zoomLevel === 0
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "grid-cols-4 medium:grid-cols-5 large:grid-cols-7"
                              : "grid-cols-4 medium:grid-cols-6 large:grid-cols-8"
                            : globalContext.libraryData.userSettings.zoomLevel === 1
                              ? globalContext.libraryData.userSettings.showSideBar
                                ? "grid-cols-3 medium:grid-cols-4 large:grid-cols-6"
                                : "grid-cols-3 medium:grid-cols-5 large:grid-cols-7"
                              : globalContext.libraryData.userSettings.zoomLevel === 2
                                ? globalContext.libraryData.userSettings.showSideBar
                                  ? "grid-cols-2 medium:grid-cols-3 large:grid-cols-5"
                                  : "grid-cols-2 medium:grid-cols-4 large:grid-cols-6"
                                : ""
                          }`}
                      >
                        <GameCards gamesList={folder.games} />
                      </div>
                    </div>
                  </Show>
                );
              }}
            </For>
          </Show>

          <Show
            when={applicationStateContext.searchValue() !== "" && applicationStateContext.searchValue() !== undefined}
          >
            {() => {
              const searchResults = [];
              const allGameNames = [];

              if (applicationStateContext.searchValue() !== "" && applicationStateContext.searchValue() !== undefined) {
                for (const key in globalContext.libraryData.games) {
                  allGameNames.push(key);
                }
              }

              for (const libraryGame of Object.keys(globalContext.libraryData.games)) {
                const result = fuzzysearch(
                  applicationStateContext.searchValue(),
                  libraryGame.toLowerCase().replace("-", " "),
                );
                if (result === true) {
                  searchResults.push(libraryGame);
                }
              }

              return (
                <div>
                  <div
                    class={`foldersDiv mt-4 grid gap-5
                      ${globalContext.libraryData.userSettings.zoomLevel === 0
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "grid-cols-4 medium:grid-cols-5 large:grid-cols-7"
                          : "grid-cols-4 medium:grid-cols-6 large:grid-cols-8"
                        : globalContext.libraryData.userSettings.zoomLevel === 1
                          ? globalContext.libraryData.userSettings.showSideBar
                            ? "grid-cols-3 medium:grid-cols-4 large:grid-cols-6"
                            : "grid-cols-3 medium:grid-cols-5 large:grid-cols-7"
                          : globalContext.libraryData.userSettings.zoomLevel === 2
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "grid-cols-2 medium:grid-cols-3 large:grid-cols-5"
                              : "grid-cols-2 medium:grid-cols-4 large:grid-cols-6"
                            : ""
                      }`}
                  >
                    <GameCards gamesList={searchResults} />
                  </div>
                  <div class="items-center">
                    <Show when={searchResults.length === 0}>
                      <div class="flex h-[calc(100vh-100px)]  w-full items-center justify-center gap-3 align-middle">
                        <EmptyTray />
                        {translateText("no games found")}
                      </div>
                    </Show>
                  </div>
                </div>
              );
            }}
          </Show>
        </div>
      </div>

      <div
        popover
        class="toast bg-[#E8E8E8] p-[10px] text-black hover:bg-[#d6d6d6] dark:bg-[#232323] dark:text-white dark:hover:bg-[#2b2b2b]"
      >
        {applicationStateContext.toastMessage()}
      </div>

      <div id="abovePage">
        <Switch>
          <Match when={uiContext.showNewGameModal()}>
            <NewGame />
          </Match>
          <Match when={uiContext.showEditGameModal()}>
            <EditGame />
          </Match>
          <Match when={uiContext.showNewFolderModal()}>
            <NewFolder />
          </Match>
          <Match when={uiContext.showEditFolderModal()}>
            <EditFolder />
          </Match>
          <Match when={uiContext.showGamePopUpModal()}>
            <GamePopUp />
          </Match>
          <Match when={uiContext.showNotepadModal()}>
            <Notepad />
          </Match>
          <Match when={uiContext.showSettingsModal()}>
            <Settings />
          </Match>
        </Switch>
        <Show when={uiContext.showLoadingModal()}>
          <Loading />
        </Show>
      </div>
    </>
  );
}

export default App;
