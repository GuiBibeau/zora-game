import { FC, Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IdentificationIcon } from "@heroicons/react/outline";
import { useWen } from "wen-connect";
import { WenSession } from "wen-connect/dist/core/models";
import useSWR from "swr";
import { gqlFetcher } from "helpers/gqlFetcher";
import { NftGrid } from "./NftGrid";
import { useJoinGame } from "hooks/useJoinGame";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  session: WenSession;
};

export const JoinModal: FC<Props> = ({ open, setOpen, session }) => {
  const joinGame = useJoinGame();
  const cancelButtonRef = useRef(null);
  const { connect, wallet } = useWen(session);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data } = useSWR(
    wallet?.address.length > 0
      ? `
      query JacobsNFTs {
        tokens(
          networks: [{ network: ETHEREUM, chain: MAINNET }]
          pagination: { limit: 3 }
          where: { ownerAddresses: "${wallet.address}" }
        ) {
          nodes {
            token {
              image {
                url
              }
            }
          }
        }
      }      
      `
      : null,
    gqlFetcher
  );

  const handleJoin = () => {
    if (!data) {
      return;
    }

    const imageUrl =
      data.tokens.nodes.map((node: any) => node.token.image.url).length === 0
        ? "https://www.placecage.com/300/300"
        : data.tokens.nodes.map((node: any) => node.token.image.url)[
            selectedIndex
          ];

    console.log({ imageUrl });
    joinGame(imageUrl);
    setOpen(false);
  };

  const handleConnect = () => {
    connect();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl leading-6 font-medium text-gray-900 font-bangers"
                    >
                      Connect your wallet and choose your NFT
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Choose your favorite NFT to represent you in the game!
                        After you play frist game, you will be able to mint a
                        special Battleshot NFT to play in future games and
                        evolve it with time!
                      </p>
                    </div>
                  </div>
                </div>

                {data && (
                  <div className="mt-4">
                    <NftGrid
                      selectedIndex={selectedIndex}
                      onSelect={(selected: number) =>
                        setSelectedIndex(selected)
                      }
                      files={data.tokens.nodes.map(
                        (node: any) => node.token.image.url
                      )}
                    />
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  {wallet.address.length === 0 ? (
                    <button
                      type="button"
                      onClick={handleConnect}
                      style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
                      className=" h-16 inline-flex items-center justify-center rounded-md   shadow-sm px-4 py-2 text-black border-4 border-black text-base font-medium sm:col-start-2 sm:text-sm"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoin}
                      style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
                      className=" h-16 inline-flex items-center justify-center rounded-md   shadow-sm px-4 py-2 text-black border-4 border-black text-base font-medium sm:col-start-2 sm:text-sm"
                    >
                      {data?.tokens?.nodes?.length === 0
                        ? "No NFT? play with Nicolas Cage!"
                        : "Play with this nft!"}
                    </button>
                  )}
                  <button
                    type="button"
                    style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
                    className="h-16 w-48 flex shadow-3xl justify-center border-4 border-black items-center  px-6 py-3   text-base font-medium rounded-md text-gray-700 bg-white "
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
