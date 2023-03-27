let data = require("../../data.json");
import { useFrame } from "@react-three/fiber";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useTexture, Sky } from "@react-three/drei";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import landAbi from "../../artifacts/contracts/Land.sol/Land.json";
import { landAddress } from "../../config";

function Model() {
  const gltf = useLoader(GLTFLoader, "/i.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

async function buyPlot(id) {
  try {
    const { ethereum } = window;
    console.log(ethereum);
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log(provider);
      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(landAddress, landAbi.abi, signer);
      console.log(contract);
      let newPrice = await contract.getPrice(id);
      // console.log(newPrice.toNumber());
      let dim = data[id].dimension;
      let pos = data[id].position;
      let basePrice = data[id].price;
      basePrice = ethers.utils.parseUnits(basePrice, "ether").toString();
      if (newPrice == 0) newPrice = basePrice;
      else {
        newPrice = ethers.utils.parseUnits(newPrice, "ether");
        // console.log(newPrice.toString());
        newPrice = newPrice.toString();
      }
      let i = await contract.plots(id).plotOwner;
      console.log(i);
      console.log(newPrice);
      console.log(basePrice);
      let buy = await contract.buy(
        id,
        dim[0],
        dim[1],
        dim[2],
        1,
        2,
        3,
        basePrice,
        {
          value: newPrice,
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

function InfoBox({ id }) {
  return (
    <>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} />
        <Model />
      </Canvas>
      <h1>Positions:</h1>
      {data[id].dimension.map((dim) => {
        // eslint-disable-next-line react/jsx-key
        return <h3>{dim}</h3>;
      })}
      <button onClick={() => buyPlot(id)}>Buy</button>
    </>
  );
}
InfoBox.getInitialProps = async ({ query }) => {
  const id = query;
  return id;
};

export default InfoBox;
