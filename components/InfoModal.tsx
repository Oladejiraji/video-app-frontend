import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Dispatch, Fragment, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

const InfoModal = ({ isOpen, setIsOpen }: IProps) => {
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center"></div> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Welcome
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 pb-3">
                      1. Create a room by clicking on new call
                    </p>
                    <p className="text-sm text-gray-500 pb-3">
                      2. Let other users join your call by opening your video
                      screen link on their browser
                    </p>
                    <p className="text-sm text-gray-500 pb-3">
                      3. You can also connect to other users by getting their id
                      from their url and putting it in the input form
                    </p>
                    <p className="text-sm text-gray-500 pb-3">
                      4. Url Example: https://example.com/video/[copy this id]
                    </p>
                    <p className="text-sm text-gray-500 pb-3">
                      4. I am working on adding more features to this app and
                      improving it&apos;s functionality
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Thank you!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InfoModal;
