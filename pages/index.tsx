import { Canvas, useLoader } from "@react-three/fiber";
import AnimatedBox from "@/components/AnimatedBox";
import { useState } from "react";
// import CameraOrbitController from "@/components/CameraOrbitController";
import { OrbitControls, useTexture, Sky } from "@react-three/drei";

import Plane from "../components/Plane";
import InfoBox from "../components/InfoBox";
import { Key } from "react";
let data = require("../data.json");

const TexturedSpheres = () => {
  // const colorMap = useLoader(
  //   TextureLoader,
  //   "./textures/pavement_03_diff_1k.png"
  // );
  const map = useTexture("/textures/pavement_03_diff_1k.png");
  const dis = useTexture("/textures/pavement_03_disp_1k.png");
  const diff = useTexture("/textures/pavement_03_nor_gl_1k.png");
  const rou = useTexture("/textures/pavement_03_rough_1k.png");
  // const ma = useTexture(`${map}`);
  // console.log(map);

  return (
    <>
      {/* <mesh scale={[0.5, 0.5, 0.5]} position={[-1, 0, 0]}>
        <sphereGeometry />
        <meshStandardMaterial map={map} />
      </mesh>
      <mesh scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 100, 100]} />
        <meshStandardMaterial map={map} normalMap={diff} roughnessMap={rou} />
      </mesh>
      <mesh scale={[0.5, 0.5, 0.5]} position={[1, 0, 0]}>
        <sphereGeometry />
        <meshStandardMaterial map={map} />
      </mesh> */}
    </>
  );
};

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

export default function Home() {
  const testing = true;
  const [landId, setLandId] = useState("");
  const [owner, setOwner] = useState("");
  const [isOwner, setIsOwner] = useState();
  const [forSale, setForSale] = useState();
  const [forBid, setForBid] = useState();
  return (
    <div className="container">
      <Canvas>
        <Sky
          distance={100}
          sunPosition={[0, 0, 10]}
          inclination={0}
          azimuth={0.5}
        />
        {testing ? <axesHelper visible={testing} args={[2]} /> : null}
        {testing ? <gridHelper visible={testing} args={[10, 10]} /> : null}
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} />
        <TexturedSpheres />
        <Plane width={10} height={1} position={[0, 0, 0]} color={0xff00}>
          {data.map(
            (box: {
              id: string;
              uid: string;
              position: [number, number, number];
              dimension: [number, number, number];
              price: number;
            }) => {
              return (
                <AnimatedBox
                  key={box.id}
                  uid={box.id}
                  isTesting={testing}
                  position={box.position}
                  dimensions={box.dimension}
                  price={box.price}
                  setLandId={setLandId}
                />
              );
            }
          )}
          {/* <AnimatedBox
            isTesting={testing}
            position={[2.5, 1.5, 1]}
            dimensions={[1, 1, 2]}
            price={0.1}
          />
          <AnimatedBox
            isTesting={testing}
            position={[-2.5, 3.5, 0.5]}
            dimensions={[2, 1, 1]}
            price={1}
          />
          <AnimatedBox
            isTesting={testing}
            position={[4.5, -2.5, 1]}
            dimensions={[1, 3, 2]}
            price={0.4}
          />
          <AnimatedBox
            isTesting={testing}
            position={[-2.5, -1.5, 1]}
            dimensions={[2, 1, 2]}
            price={0.5}
          /> */}
        </Plane>
      </Canvas>

      {landId && (
        <>
          <p>building info {landId}</p>
          <button>Buy</button>
          <button
            onClick={() => {
              setLandId("");
            }}
          >
            X
          </button>
        </>
      )}
    </div>
  );
}
