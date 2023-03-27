import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useHelper, useTexture } from "@react-three/drei";
import { BoxHelper } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import landAbi from "../artifacts/contracts/Land.sol/Land.json";
import { landAddress } from "../config";
import InfoBox from "./InfoBox";
import { Key, Dispatch, SetStateAction } from "react";
import router from "next/router";

type Props = {
  uid: string;
  isTesting: boolean;
  position: [number, number, number];
  dimensions: [number, number, number];
  price: number;
  setLandId: (val: string) => void;
};

async function buyPlot(props: Props) {
  // const web3Modal = new Web3Modal();
  // const connection = await web3Modal.connect();
  // const provider = new ethers.providers.Web3Provider(connection);
  // const signer = provider.getSigner();
  // const price = ethers.utils.parseUnits(props.price.toString(), "ether");
  // let contract = new ethers.Contract(landAddress, landAbi.abi, signer);
  console.log(props.uid);
}

const AnimatedBox: React.FC<Props> = (props) => {
  const exporter = new GLTFExporter();
  const map = useTexture("/textures/pavement_03_diff_1k.png");
  const meshRef = useRef<THREE.Mesh>(null);
  {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    props.isTesting ? useHelper(meshRef, BoxHelper, "blue") : null;
  }
  // const handleClick = () => {
  //   alert("box clicked");
  //   exporter.parse(meshRef.current, function (result) {
  //     const data = JSON.stringify(result);
  //     // const data = result.glb;
  //     console.log(data);
  //     console.log("aaa");
  //   });
  // };
  // useEffect(() => {
  // const f = () => {

  // };
  // });

  useFrame(() => {
    // console.log("Hi");
    // if (meshRef.current) meshRef.current.rotation.z += 0.01;
  });

  const onClickHandler = () => {
    props.setLandId(props.uid);
    // router.push(`/info-box/[id]`, `/info-box/${props.uid}`);
  };
  return (
    <>
      <mesh
        ref={meshRef}
        position={props.position}
        onClick={onClickHandler}
        scale={[1, 1, 1]}
      >
        <boxGeometry args={props.dimensions} />
        <meshStandardMaterial map={map} />
      </mesh>
      {/* <InfoBox /> */}
    </>
  );
};

export default AnimatedBox;
