import { useContext } from "solid-js";
import { ApplicationStateContext, UIContext, closeToast } from "../Globals";

export function Toast() {
  let uiContext = useContext(UIContext);
  let applicationStateContext = useContext(ApplicationStateContext);

  return (
    <>
      <Show when={uiContext.showToast()}>
        <div
          onClick={() => {
            closeToast();
          }}
          id="toast"
          className="absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center ">
          <div
            className={`border-0 p-[10px] relative gap-1 z-[100000000] standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max h-max toast`}>
            {applicationStateContext.toastMessage()}
          </div>
        </div>
      </Show>
    </>
  );
}
