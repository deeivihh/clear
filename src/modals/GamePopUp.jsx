import { appDataDirPath, selectedGame, roundedBorders } from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { openGame, translateText } from "../App";

export function GamePopUp() {
  return (
    <dialog
      data-gamePopup
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266]  bg-[#d1d1d166]"
      onDragStart={(e) => {
        e.preventDefault();
      }}>
      <Show when={selectedGame()}>
        <div className="flex flex-col items-center justify-center w-screen h-screen px-[40px]">
          <img
            src={convertFileSrc(
              appDataDirPath() + "heroes\\" + selectedGame().heroImage,
            )}
            alt=""
            className={`max-large:h-[270px] h-[350px] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] absolute blur-[80px] opacity-[0.4] -z-10`}
          />
          <div className="relative">
            <div className="absolute bottom-[30px] right-[30px] flex gap-[15px]">
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  openGame(selectedGame().location);
                }}>
                <div className="!w-max">{translateText("play")}</div>
                <svg
                  width="13"
                  height="16"
                  viewBox="0 0 13 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.69727 14.3947V0.894745L12.1973 7.64474L1.69727 14.3947Z"
                    className="dark:stroke-white stroke-black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  document.querySelector("[data-gamePopup]").close();
                  document.querySelector("[data-editGameModal]").show();
                }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0761 3.16311C10.136 2.50438 10.6883 2 11.3497 2H12.6503C13.3117 2 13.864 2.50438 13.9239 3.16311C13.9731 3.70392 14.3623 4.14543 14.8708 4.336C15.0015 4.38499 15.1307 4.43724 15.2582 4.49263C15.7613 4.71129 16.3531 4.66938 16.7745 4.31818C17.2953 3.8842 18.0611 3.91894 18.5404 4.39829L19.4584 5.31623C19.9154 5.77326 19.9485 6.50338 19.5347 6.99992C19.1901 7.41349 19.158 7.99745 19.3897 8.48341C19.49 8.69386 19.5816 8.90926 19.664 9.12916C19.8546 9.63767 20.2961 10.0269 20.8369 10.0761C21.4956 10.136 22 10.6883 22 11.3497V12.6503C22 13.3117 21.4956 13.864 20.8369 13.9239C20.2961 13.9731 19.8546 14.3623 19.664 14.8708C19.59 15.0682 19.5086 15.262 19.4202 15.4518C19.2053 15.913 19.2401 16.4637 19.5658 16.8546C19.962 17.33 19.9303 18.0291 19.4927 18.4667L18.4667 19.4927C18.0291 19.9303 17.33 19.962 16.8546 19.5658C16.4637 19.2401 15.913 19.2053 15.4518 19.4202C15.262 19.5086 15.0682 19.59 14.8708 19.664C14.3623 19.8546 13.9731 20.2961 13.9239 20.8369C13.864 21.4956 13.3117 22 12.6503 22H11.3497C10.6883 22 10.136 21.4956 10.0761 20.8369C10.0269 20.2961 9.63767 19.8546 9.12917 19.664C8.90927 19.5816 8.69387 19.49 8.48343 19.3897C7.99746 19.158 7.4135 19.1901 6.99992 19.5347C6.50338 19.9485 5.77325 19.9154 5.31622 19.4584L4.39829 18.5404C3.91893 18.0611 3.8842 17.2953 4.31818 16.7745C4.66939 16.3531 4.71129 15.7613 4.49263 15.2582C4.43724 15.1307 4.385 15.0016 4.336 14.8708C4.14544 14.3623 3.70392 13.9731 3.16311 13.9239C2.50438 13.864 2 13.3117 2 12.6503V11.3497C2 10.6883 2.50438 10.136 3.16311 10.0761C3.70393 10.0269 4.14544 9.63768 4.33601 9.12917C4.3936 8.9755 4.45568 8.82402 4.52209 8.67489C4.7571 8.14716 4.71804 7.52257 4.34821 7.07877C3.89722 6.53758 3.93332 5.74179 4.43145 5.24365L5.24364 4.43146C5.74178 3.93332 6.53757 3.89722 7.07876 4.34822C7.52256 4.71805 8.14715 4.7571 8.67488 4.52209C8.82401 4.45568 8.97549 4.3936 9.12916 4.33601C9.63767 4.14544 10.0269 3.70393 10.0761 3.16311Z"
                    className="dark:stroke-white stroke-black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                    className="dark:stroke-white stroke-black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !bg-opacity-80 hover:backdrop-blur-[5px]  !backdrop-blur-[10px]"
                onClick={() => {
                  document.querySelector("[data-gamePopup]").close();
                }}>
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
            <Show when={selectedGame().heroImage}>
              <img
                src={convertFileSrc(
                  appDataDirPath() + "heroes\\" + selectedGame().heroImage,
                )}
                alt=""
                className={`max-large:h-[270px] h-[350px] aspect-[96/31]  rounded-[${
                  roundedBorders() ? "6px" : "0px"
                }]`}
              />
            </Show>
            <Show when={!selectedGame().heroImage}>
              <div
                className={`max-large:h-[270px] h-[350px] aspect-[96/31] bg-[#f1f1f1] dark:bg-[#1c1c1c]  rounded-[${
                  roundedBorders() ? "6px" : "0px"
                }]`}
              />
            </Show>

            <div className="absolute max-large:bottom-[15px] bottom-[30px] left-[25px] h-[70px] w-[300px] items-center flex align-middle">
              <Show when={selectedGame().logo}>
                <img
                  src={convertFileSrc(
                    appDataDirPath() + "logos\\" + selectedGame().logo,
                  )}
                  alt=""
                  className=" relative aspect-auto max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                />
              </Show>
              <Show when={!selectedGame().logo}>
                <div
                  className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] absolute bottom-[5px] bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                    roundedBorders() ? "6px" : "0px"
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
