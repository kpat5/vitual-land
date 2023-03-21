let data = require("../../data.json");
import { useFrame } from "@react-three/fiber";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useTexture, Sky } from "@react-three/drei";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import landAbi from "../../artifacts/contracts/Land.sol/Land.json";
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
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  console.log(
    await provider.getCode("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
  );
  console.log(landAddress);
  //   const price = ethers.utils.parseUnits(props.price.toString(), "ether");
  const contract = new ethers.Contract(landAddress, landAbi.abi, signer);

  let dim = data[id].dimension;
  let pos = data[id].position;
  let basePrice = 10;
  // basePrice = ethers.utils.parseUnits(basePrice.toString(), "ether");
  // let a = ethers.utils.parseUnits(id.toString(), "uint256");
  // console.log(a);
  let newPrice = await contract.getPrice(id);
  // console.log("price ", newPrice);
  // if (price == 0) newPrice = basePrice;
  console.log(dim);
  console.log(pos);
  // let buy = await contract.buy(id, dim[0], dim[1], dim[2], 1, 2, 3, basePrice, {
  //   value: basePrice,
  // });
  console.log(newPrice);
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
