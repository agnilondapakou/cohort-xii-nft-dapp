import { Icon } from "@iconify/react/dist/iconify.js";
import { formatEther, Contract } from "ethers";
import { React, useEffect, useState } from "react";
import { truncateString } from "../../utils";
import NFT_ABI from "../../ABI/nft.json";
import { getEthersSigner } from "../../config/wallet-connection/adapter";
import { useConfig } from "wagmi";
import { useAppContext } from "../../contexts/appContext";

export const NFTCard = ({ metadata, mintPrice, tokenId, nextTokenId, mintNFT }) => {
    return (
        <div className="w-full space-y-4 rounded-xl bg-secondary shadow-sm border border-primary p-2">
            <img
                src={metadata.image}
                alt={`${metadata.name} image`}
                className="rounded-xl w-full h-64"
            />
            <h1 className="font-bold">{metadata.name}</h1>
            <p className="text-s ">
                {truncateString(metadata.description, 100)}
            </p>

            <div className="flex gap-2">
                <Icon icon="ri:file-list-3-line" className="w-6 h-6" />
                <span>{metadata.attributes.length} Attributes</span>
            </div>

            <div className="flex gap-2">
                <Icon icon="ri:eth-line" className="w-6 h-6" />
                <span>{`${formatEther(mintPrice)} ETH`}</span>
            </div>

            <button
                disabled={Number(nextTokenId) !== tokenId}
                onClick={mintNFT}
                className="w-full p-4 bg-primary/80 rounded-md text-secondary font-bold disabled:bg-gray-500"
            >
                {Number(nextTokenId) <= tokenId ? "Mint NFT" : "Owned"}
            </button>
        </div>
    );
};

export const UserNFTCard = ({ metadata, tokenId }) => {
    const [owned, setOwned] = useState(false);
    const wagmiConfig = useConfig();
    const [ toAddr, setToAddr] = useState("");

    
    async function getContract() {
        const signer = await getEthersSigner(wagmiConfig);
        const owner = await signer.getAddress();
        const contract = new Contract(
            import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            signer
        );
    
        return {contract , signer, owner}
    }

    async function checkOwner() {
        try{
            const {contract, owner} = await getContract()
            const nftOwner = await contract.ownerOf(tokenId)
            setOwned(nftOwner === owner)
        } catch (error) {
            console.error(error)
        }
    }

    async function transfer() {
        try{
            console.log(toAddr)

            const { contract,  owner } = await getContract()
            const tx = await contract.transferFrom(owner, toAddr, tokenId);
            tx.wait();

            alert("Token transferred successfully");
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        checkOwner()
    }, [tokenId])

    if (owned == false) return null;

    return (
        <div className="w-full space-y-4 rounded-xl bg-secondary shadow-sm border border-primary p-2">
            <img
                src={metadata.image}
                alt={`${metadata.name} image`}
                className="rounded-xl w-full h-64"
            />
            <h1 className="font-bold">{metadata.name}</h1>
            <p className="text-s ">
                {truncateString(metadata.description, 100)}
            </p>

            <div className="flex gap-2">
                <Icon icon="ri:file-list-3-line" className="w-6 h-6" />
                <span>{metadata.attributes.length} Attributes</span>
            </div>

            <input type="text"   placeholder="To" className="p-3 border-1 rounded-md mb-5 w-full" value={toAddr}    onChange={(e) => setToAddr(e.target.value)}/>
            <button onClick={transfer} className="w-full p-4 bg-primary/80 rounded-md text-secondary font-bold disabled:bg-gray-500">Transfer</button>
        </div>
    );
};
